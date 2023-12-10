const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('send-table', (tableArr, flag, active_player) => {
    socket.broadcast.emit('receive-table', {tableArr, flag, active_player});
    console.log(tableArr);
    console.log("--------------------");
    console.log(flag);
    console.log("--------------------");
    console.log(active_player);
    console.log("--------------------");
  });
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  const gameStarted = req.session.gameStarted || false;
  res.render('homepage', { gameStarted });
});

app.get('/player1', (req, res) => {
  req.session.gameStarted = true;
  console.log('Player 1 joined');
  res.render('virus');
});

app.get('/player2', (req, res) => {
  const gameStarted = req.session.gameStarted || false;
  if (gameStarted) {
    console.log('Player 2 joined');
  }
  res.render('virus');
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
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
*/