import mysql from 'mysql2';

export async function GET(request) {
  return new Promise((resolve, reject) => {
    const conn = mysql.createConnection({
      host: 'tileng.si',
      port: 3306,
      user: process.env.NEXT_PUBLIC_DB_USERNAME,
      password: process.env.NEXT_PUBLIC_DB_PASS,
      database: 'grajnder'
    });

    conn.connect((err) => {
      if (err) {
        console.error('Error connecting to the database:', err.message);
        reject(new Response('Database connection failed', { status: 500 }));
      }
      else {
        console.log('Connected to the database!');
        
        //query
        conn.query('SELECT * FROM users', (err, results) => {
          if (err) {
            console.error('Error executing query:', err.message);
            reject(new Response('Error executing query', { status: 500 }));
          }
          else {
            console.log('Query results:', results);
            resolve(new Response(JSON.stringify(results), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }));
          }
        });
        conn.end();
      }
    });
  });
}