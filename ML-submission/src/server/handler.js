const klasifikasiprediksi = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getHistories = require('../services/history');

async function predictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await klasifikasiprediksi(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    await storeData(id, data);

    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('prediction failed:', error);
    return h
      .response({
        status: 'fail',
        message: 'Terjadi kesalahan dalam melakukan prediksi',
      })
      .code(400);
  }
}

async function historiesHandler(request, h) {
  const histories = await getHistories();

  const formathistories = [];
  histories.forEach((doc) => {
    const data = doc.data();
    formathistories.push({
      id: doc.id,
      history: {
        result: data.result,
        createdAt: data.createdAt,
        suggestion: data.suggestion,
        id: doc.id,
      },
    });
  });

  const response = h.response({
    status: 'success',
    data: formathistories,
  });
  response.code(200);
  return response;
}

module.exports = { predictHandler, historiesHandler };
