const { Client } = require('pg'); 
 
// Подключение к PostgreSQL 
const client = new Client({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'postgres',
  password: 'zarad88kik', 
  port: 5432 
}); 
 
client.connect(); 
 
// Выполнение SQL-запросов 
client.query('SELECT * FROM players', (err, res) => { 
  if (err) throw err; 
  console.log(res.rows);
  
  client.end(); 
});