const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance-system';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Check if admin exists
    const admin = await users.findOne({ username: 'admin' });
    if (admin) {
      await users.updateOne({ username: 'admin' }, { $set: { password: hashedPassword, role: 'admin' } });
      console.log('Admin password reset to admin123');
    } else {
      await users.insertOne({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: true,
        createdAt: new Date()
      });
      console.log('Created admin user successfully.');
    }
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
