
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "1234",
//   database: "skillsphere",
// });


import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skillsphere'
});

export default pool.promise();
