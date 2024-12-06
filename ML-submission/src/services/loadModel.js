const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
    return tf.loadGraphModel(process.env.BUCKET_URL);
}

module.exports = loadModel;