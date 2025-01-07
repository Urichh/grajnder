import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const { action, username, password, email, firstName, lastName, age, sex, updates, swiped_user, direction } = await request.json();

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
        INSERT INTO users (email, nickname, first_name, last_name, birth_date, sex, password)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
      await conn.execute(query, [email, username, firstName, lastName, age, sex, hashedPassword]);

      await conn.end();
      return new Response(JSON.stringify('User registered successfully'), { status: 200 });
    } else if (action === 'login') {
      const query = `SELECT id, password FROM users WHERE nickname = ?`;
      const [rows] = await conn.execute(query, [username]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Invalid username or password'), { status: 401 });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new Response(JSON.stringify('Invalid username or password'), { status: 401 });
      }
      process.env.USER_ID = user.id
      
      await conn.end();
      return new Response(JSON.stringify('Login successful'), { status: 200 });

    } else if (action === 'getusers'){
      const query = `
        SELECT id, first_name, last_name, nickname, sex, profile_pic, interests, game_preferences,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age 
        FROM users 
        WHERE id != ?
          AND id NOT IN (
            SELECT user2 FROM swipes 
            WHERE user1 = ?
          )`;
      const [rows] = await conn.execute(query, [process.env.USER_ID,process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (action === 'getswipedusers'){
      const query = `
        SELECT users.id, users.first_name, users.last_name, users.nickname, 
          TIMESTAMPDIFF(YEAR, users.birth_date, CURDATE()) AS age,
          CASE 
            WHEN TIMESTAMPDIFF(MINUTE, swipes.swipe_date, NOW()) < 60 
              THEN CONCAT(TIMESTAMPDIFF(MINUTE, swipes.swipe_date, NOW()), 'min')
            ELSE CONCAT(TIMESTAMPDIFF(HOUR, swipes.swipe_date, NOW()), 'h')
          END AS swipe_time_ago, 
          swipes.swipe_direction AS direction
        FROM users 
        JOIN swipes ON users.id = swipes.user2
        WHERE users.id != ? AND swipes.user1 = ?`;
      const [rows] = await conn.execute(query, [process.env.USER_ID,process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

        } else if (action === 'getprofile'){
      const query = `SELECT first_name, last_name, nickname, sex, profile_pic, interests, game_preferences, birth_date FROM users WHERE id = ?`;

      const [rows] = await conn.execute(query,[process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'setprofile'){
      const query = "UPDATE users SET " + updates.join(", ") + " WHERE id = ?";

      const [rows] = await conn.execute(query,[process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }
    
      await conn.end();
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } if (action === 'swipe') {
      console.log(swiped_user);
      
      const query = `
        INSERT INTO swipes (user1, user2, swipe_direction)
        VALUES (?, ?, ?);
      `;
      await conn.execute(query, [process.env.USER_ID, swiped_user, direction]);

      await conn.end();
      return new Response(JSON.stringify('Swipe saved successfully'), { status: 200 });
    } else {
      await conn.end();
      return new Response(JSON.stringify('Invalid action'), { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify('Internal server error'), { status: 500 });
  }
}

