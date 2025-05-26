const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/src', express.static('src'));

const apiConfig = require('./src/web-set.json');
const chatFile = path.join(__dirname, 'home', 'chat.json');

// Load Scraper Handlers
const loadScrapers = () => {
    const scrapers = {};
    const endpointConfigs = {};
    const baseDir = path.join(__dirname, 'api-setting', 'Scrape');

    apiConfig.categories.forEach(category => {
        category.items.forEach(item => {
            const cleanPath = item.path.split('?')[0];
            endpointConfigs[cleanPath] = {
                requireKey: item.requireKey !== undefined ? item.requireKey : apiConfig.apiSettings.defaultRequireKey,
                path: item.path
            };
        });
    });

    const walkDir = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                walkDir(fullPath);
            } else if (file.endsWith('.js')) {
                const relativePath = path.relative(baseDir, fullPath);
                const routePath = '/' + relativePath
                    .replace(/\\/g, '/')
                    .replace('.js', '')
                    .toLowerCase();

                const config = endpointConfigs[routePath] || {
                    requireKey: apiConfig.apiSettings.defaultRequireKey
                };

                scrapers[routePath] = {
                    handler: require(fullPath),
                    config: config
                };
            }
        });
    };

    walkDir(baseDir);
    return scrapers;
};

const scrapers = loadScrapers();

const checkApiKey = (req, res, next) => {
    const path = req.path;
    const endpoint = scrapers[path];

    if (!endpoint) return next();
    if (!endpoint.config.requireKey) return next();

    const apiKey = req.headers['x-api-key'] || req.query.apikey;
    if (!apiKey) {
        return res.status(401).json({
            status: false,
            message: 'API key diperlukan untuk endpoint ini'
        });
    }

    if (!apiConfig.apiSettings.globalKey.includes(apiKey)) {
        return res.status(403).json({
            status: false,
            message: 'API key tidak valid'
        });
    }

    next();
};

// Register API routes
Object.entries(scrapers).forEach(([route, { handler, config }]) => {
    app.get(route, checkApiKey, async (req, res) => {
        try {
            const params = Object.keys(req.query)
                .filter(key => key !== 'apikey')
                .map(key => req.query[key]);

            const result = await handler(...params);
            res.json({
                status: true,
                creator: apiConfig.apiSettings.creator,
                result
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    });

    if (config.path && config.path.includes('?')) {
        app.get(config.path.split('?')[0], checkApiKey, (req, res) => {
            res.status(400).json({
                status: false,
                message: 'Parameter diperlukan',
                example: `${req.protocol}://${req.get('host')}${config.path}param_value`
            });
        });
    }
});

// API: Get chat messages
app.get('/api/chat', (req, res) => {
    fs.readFile(chatFile, 'utf8', (err, data) => {
        if (err) return res.json([]);
        try {
            res.json(JSON.parse(data));
        } catch {
            res.json([]);
        }
    });
});

// API: Post new message
app.post('/api/chat', (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({ error: 'Nama dan pesan wajib diisi.' });
    }

    const newMessage = {
        name,
        message,
        timestamp: new Date().toISOString()
    };

    fs.readFile(chatFile, 'utf8', (err, data) => {
        let messages = [];
        if (!err && data) {
            try {
                messages = JSON.parse(data);
            } catch {}
        }

        messages.push(newMessage);
        fs.writeFile(chatFile, JSON.stringify(messages, null, 2), (err) => {
            if (err) return res.status(500).json({ error: 'Gagal menyimpan pesan.' });
            res.json({ success: true, message: 'Pesan berhasil dikirim.' });
        });
    });
});

// Pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/documentation', (req, res) => {
    res.sendFile(path.join(__dirname, 'home', 'index.html'));
});

app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'home', 'chat.html'));
});

app.get('/chatai', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'aichat.html'));
});


// Fallback 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Run server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log('Endpoint yang tersedia:');
    Object.entries(scrapers).forEach(([path, { config }]) => {
        console.log(`- ${path} (Require Key: ${config.requireKey ? 'Ya' : 'Tidak'})`);
    });
});

module.exports = app;
