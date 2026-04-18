const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017').then(async client => {
  const db = client.db('attendance-system');
  try {
    await db.collection('users').dropIndex('email_1');
    console.log('✓ Old non-sparse email index dropped');
  } catch(e) {
    console.log('No old index found (or already dropped):', e.message);
  }
  await db.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true });
  console.log('✓ New sparse unique email index created!');
  await client.close();
  console.log('Done!');
}).catch(console.error);
