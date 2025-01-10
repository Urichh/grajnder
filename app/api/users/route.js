import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

function levenshteinDistance(a, b) { //chatGPT my beloved
  const matrix = [];

  // Increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1) // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function stringSimilarity(str1, str2) {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 0; // Both strings are empty

  const distance = levenshteinDistance(str1, str2);
  const similarity = (1 - (distance / maxLen)) * 10;

  return Math.round(similarity);
}

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
      const query = `SELECT id, password, interests, game_preferences FROM users WHERE nickname = ?`;
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
      process.env.USER_GAME_PREFRENCES = user.game_preferences
      process.env.USER_INTRESTS = String(user.interests)

      await conn.end();
      return new Response(JSON.stringify('Login successful'), { status: 200 });

    } else if (action === 'getusers') {
      const query = `
        SELECT id, first_name, last_name, nickname, sex, profile_pic, interests, game_preferences,
        TIMESTAMPDIFF(YEAR, birth_date, CURDATE()) AS age 
        FROM users 
        WHERE id != ?
          AND id NOT IN (
            SELECT user2 FROM swipes 
            WHERE user1 = ?
          )`;
      const [rows] = await conn.execute(query, [process.env.USER_ID, process.env.USER_ID]);
      const preferences = process.env.USER_GAME_PREFRENCES.split(',')
      for (let i = 0; i < rows.length; i++) {
        var count = 0
        preferences.forEach(prefrence => {
          if (String(rows[i].game_preferences).includes(prefrence))
            count += 20
        });
        count += stringSimilarity(String(rows[i].interests), process.env.USER_INTRESTS)
        rows[i].ranking = count

      }
      rows.sort((a, b) => b.ranking - a.ranking);
      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (action === 'getswipedusers') {
      const query = `
        SELECT users.id, users.first_name, users.last_name, users.nickname, users.profile_pic, 
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
      const [rows] = await conn.execute(query, [process.env.USER_ID, process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } else if (action === 'getprofile') {
      const query = `SELECT first_name, last_name, nickname, sex, profile_pic, interests, game_preferences, birth_date FROM users WHERE id = ?`;

      const [rows] = await conn.execute(query, [process.env.USER_ID]);

      if (rows.length === 0) {
        return new Response(JSON.stringify('Error executing query'), { status: 401 });
      }

      await conn.end();
      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (action === 'setprofile') {
      const query = "UPDATE users SET " + updates.join(", ") + " WHERE id = ?";

      updates.forEach(update => { // spremeni ko user uredi profil da so spremembe live
        var updated = update.split(" = ")[0]
        if (updated == 'interests')
          process.env.USER_INTRESTS = update.slice(13, -1)
        if (updated == 'game_preferences')
          process.env.USER_GAME_PREFRENCES = update.slice(20, -1)
      });

      const [rows] = await conn.execute(query, [process.env.USER_ID]);

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
       
      const query2 = `
        SELECT user1, swipe_direction FROM swipes
        WHERE user2 = ? AND user1 = ?
      `;
      var [odgovor] = await conn.execute(query2, [process.env.USER_ID, swiped_user])
      await conn.execute(query, [process.env.USER_ID, swiped_user, direction]);

      await conn.end();
      //moj shit za hit detection
      if(odgovor.length === 0) {
        console.log("ni matcha")
        return new Response(JSON.stringify('ni matchaaa'), { status: 200 });
      }
      else {
        if(direction === 'right'){
          //zaznan match
          console.log("match zaznan")
          console.log(odgovor[0])
          return new Response(JSON.stringify('match'), { status: 200 });
        }
        else{
          return new Response(JSON.stringify('ni matchaa'), { status: 200 });
        }
      }

      
    } else {
      await conn.end();
      return new Response(JSON.stringify('Invalid action'), { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(JSON.stringify('Internal server error'), { status: 500 });
  }
}

