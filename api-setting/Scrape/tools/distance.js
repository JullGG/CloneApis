const axios = require("axios");

async function getCoordinates(city) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "Node.js" }
  });
  const data = response.data;
  if (data.length > 0) {
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  }
  throw new Error(`Kota tidak ditemukan: ${city}`);
}

function haversineDistance(lat1, lon1, lat2, lon2, unit = "km") {
  const R = unit === "km" ? 6371 : 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function getDrivingDistance(lat1, lon1, lat2, lon2, unit = "km") {
  const url = `http://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
  const response = await axios.get(url);
  const data = response.data;
  if (data.routes && data.routes.length > 0) {
    return unit === "km" ? data.routes[0].distance / 1000 : data.routes[0].distance / 1609.34;
  }
  return null;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = Math.floor(minutes % 60);
  return `${hours}j ${mins}m`;
}

function estimateTravelTimes(crow, driving, unit = "km") {
  const motorcycleSpeed = unit === "km" ? 40 : 24.85;
  const carSpeed = unit === "km" ? 80 : 49.71;
  const busSpeed = unit === "km" ? 50 : 31.07;
  const trainSpeed = unit === "km" ? 100 : 62.14;
  const planeSpeed = unit === "km" ? 800 : 497.10;

  const calc = (d, speed) => d ? formatTime((d / speed) * 60) : "N/A";

  return {
    motorcycle: calc(driving, motorcycleSpeed),
    car: calc(driving, carSpeed),
    bus: calc(driving, busSpeed),
    train: calc(driving, trainSpeed),
    plane: formatTime((crow / planeSpeed) * 60)
  };
}

// Fungsi utama yang menggabungkan semua proses async dan sync
async function travelDistance(from, to, unit = "km") {
  const fromCoord = await getCoordinates(from);
  const toCoord = await getCoordinates(to);
  const crowDistance = haversineDistance(fromCoord.lat, fromCoord.lon, toCoord.lat, toCoord.lon, unit);
  const drivingDistance = await getDrivingDistance(fromCoord.lat, fromCoord.lon, toCoord.lat, toCoord.lon, unit);
  const estimasi = estimateTravelTimes(crowDistance, drivingDistance, unit);

  return {
    from,
    to,
    crowDistance: `${crowDistance.toFixed(2)} ${unit}`,
    drivingDistance: drivingDistance ? `${drivingDistance.toFixed(2)} ${unit}` : "N/A",
    estimasi
  };
}

module.exports = travelDistance;
