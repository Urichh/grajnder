import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { action, username, password, email, firstName, lastName, age, sex } = await request.json();
    
    const conn = await mysql.createConnection({
      host: 'tileng.si',
      port: 3306,
      user: process.env.NEXT_PUBLIC_DB_USERNAME,
      password: process.env.NEXT_PUBLIC_DB_PASS,
      database: 'grajnder',
    });

    if (action === 'register') {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO users (email, nickname, first_name, last_name, age, sex, password)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
      await conn.execute(query, [email, username, firstName, lastName, age, sex, hashedPassword]);

      await conn.end();
      return new Response('User registered successfully', { status: 200 });
    } else if (action === 'login') {
      const query = `SELECT id, password FROM users WHERE username = ?`;
      const [rows] = await conn.execute(query, [username]);

      if (rows.length === 0) {
        return new Response('Invalid username or password', { status: 401 });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response('Invalid username or password', { status: 401 });
      }

      await conn.end();
      return new Response('Login successful', { status: 200 });
    } else if (action === 'getusers'){
      const query = `SELECT * FROM users`;
      const [rows] = await conn.execute(query);

      if (rows.length === 0) {
        return new Response('Error executing query', { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      await conn.end();
      return new Response('Invalid action', { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response('Internal server error', { status: 500 });
  }
}
