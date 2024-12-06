const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function klasifikasiprediksi(model, image) {
  try {
    const tensor = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).toFloat().div(255.0).expandDims();
    console.log('input tensor shape:', tensor.shape);

    const prediction = await model.predict(tensor).data();
    console.log('score (sigmoid output):', prediction[0]);

    const confidenceScore = prediction[0] * 100;
    console.log('confidence score:', confidenceScore);

    const threshold = 0.58;
    const label = prediction[0] <= threshold ? 'Non-cancer' : 'Cancer';

    let suggestion;

    if (label === 'Cancer') {
      suggestion = 'Segera periksa ke dokter!';
    } else {
      suggestion = 'Penyakit kanker tidak terdeteksi.';
    }

    return { confidenceScore, label, suggestion };
  } catch (error) {
    console.error('prediction failed', error);
    throw new InputError(`Terjadi kesalahan input: ${error.message}`);
  }
}

module.exports = klasifikasiprediksi;
