const { Firestore } = require('@google-cloud/firestore');
const path = require('path');

const pathKey = path.resolve('./credentials.json');

async function getHistories() {
  const db = new Firestore({
    projectId: 'submissionmlgc-ardhiyana',
    keyFilename: pathKey,
  });
  const predictCollection = db.collection('predictions');

  const history = await predictCollection.get();
  return history;
}

module.exports = getHistories;
