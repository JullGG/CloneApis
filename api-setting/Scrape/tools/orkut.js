const axios = require('axios');

async function createCustomQRIS(total, qris) {
  try {
    const url = `https://api.jkt48connect.my.id/api/orkut/createpayment?amount=${total}&qris=${encodeURIComponent(qris)}&api_key=JKTCONNECT`;
    const { data } = await axios.get(url);
    return {
      nameQRIS: data.originalQRIS,
      generatedQRIS: data.dynamicQRIS,
      totalAmount: data.amount,
      hasFee: data.includeFee,
      qrImage: data.qrImageUrl
    };
  } catch (error) {
    throw new Error(`Gagal membuat QRIS: ${error.message}`);
  }
}

module.exports = createCustomQRIS;
