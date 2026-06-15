const { Client } = require('pg');

async function test() {
  const client = new Client({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    port: 5433,
    database: 'chaos_planner',
  });

  await client.connect();

  console.log("Connected to DB.");

  const res1 = await client.query(`SELECT id FROM users WHERE email = 'nakkarockysohan@gmail.com'`);
  if (res1.rows.length === 0) {
    console.log("User not found!");
    process.exit(1);
  }
  const userId = res1.rows[0].id;
  console.log(`User ID: ${userId}`);

  const res2 = await client.query(`SELECT * FROM otp_verifications WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
  console.log("OTP Verifications:");
  console.table(res2.rows);

  await client.end();
}

test().catch(console.error);
