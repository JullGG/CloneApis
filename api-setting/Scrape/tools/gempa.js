const axios = require ("axios")

async function ScrapeBMKG() {
  try {
    const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
    const earthquakeData = response.data.Infogempa.gempa;
    return {
      date: earthquakeData.Tanggal,
      time: earthquakeData.Jam,
      magnitude: earthquakeData.Magnitudo || earthquakeData.magnitude || 'Tidak tersedia',
      depth: earthquakeData.Kedalaman,
      location: earthquakeData.Wilayah,
      coordinates: earthquakeData.Coordinates,
      potential: earthquakeData.Potensi,
      feltIn: earthquakeData.Dirasakan || 'Tidak ada info dirasakan',
      shakemap: earthquakeData.Shakemap ? `https://data.bmkg.go.id/DataMKG/TEWS/${earthquakeData.Shakemap}` : null
    };
  } catch (error) {
    console.error('Error fetching earthquake data:', error.message);
    return null;
  }
}

module.exports = ScrapeBMKG;
