const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const today_date = new Date();
const {Client} = require('pg');

// Подключение к PostgreSQL 
const client = new Client({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'postgres',
  password: 'zarad88kik', 
  port: 5432 
}); 
 
client.connect();

io.on('connection', (socket) => {
  let startTime;
  let endTime;
  let formate_start_time;
  let formate_today_date;
  console.log(socket.id);
  socket.on('game_is_started', flagStart => {
    startTime = new Date().getTime();
    const today_date = new Date();
    formate_start_time = today_date.toLocaleTimeString('ru-RU', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    });
    formate_today_date = today_date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  });
  socket.on('send-table', (tableArr, flag, active_player) => {
    socket.broadcast.emit('receive-table', {tableArr, flag, active_player});
    console.log(tableArr);
    console.log("--------------------");
    console.log(flag);
    console.log("--------------------");
    console.log(active_player);
    console.log("--------------------");
    console.log(startTime);
    console.log("--------------------");
  });
  socket.on('set_end_of_game', winner => {
    socket.broadcast.emit('get_end_of_game', winner);
    endTime = new Date().getTime();
    let duration = (endTime - startTime) / (1000);
    console.log(duration);
    console.log("--------------------");
    client.query(`INSERT INTO games_table (winner, duration, game_date, game_time) VALUES ($1, $2, $3, $4)`, 
    [winner, duration, formate_today_date, formate_start_time], (err, res) => { 
      if (err) throw err; 
      console.log(res.rows);
    });
  });
});

app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  const game_is_started = req.session.game_is_started;
  res.render('homepage', { game_is_started });
});

app.get('/player1', (req, res) => {
  req.session.game_is_started = true;
  console.log('Player 1 joined');
  res.render('virus');
});

app.get('/player2', (req, res) => {
  const game_is_started = req.session.game_is_started;
  if (game_is_started) {
    console.log('Player 2 joined');
  }
  res.render('virus');
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});