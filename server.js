const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const today_date = new Date();
const {Client} = require('pg');
var game_is_started;

// Подключение к PostgreSQL 
const client = new Client({ 
  user: 'postgres', 
  host: 'localhost', 
  database: 'postgres',
  password: 'zarad88kik', 
  port: 5432 
}); 
 
client.connect();

//Подключение к сокету происходит в virus.js в
//socket.on('connect')
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
  //Принимает с клиента параметры, указанные в скобках
  socket.on('send-table', (tableArr, flag, active_player) => {
    //Здесь emit передаёт объект с параметрами в фиг. скобках
    //Внутри фигурных скобок создаётся объект с ключами, именами которых будут
    //их переменные
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

//Функция создания сессии
app.use(session({
  //строка, которой подписывается сохраняемый в cookie идентификатор сессии
  secret: '12345',
  /*булевое значение, указывает, нужно ли пересохранять сессию в хранилище, 
  если она не изменилась*/
  resave: false,
  //булевое значение, если true, то в хранилище будут попадать пустые сессии;
  saveUninitialized: true, 
}));

//Указываем, что надо использовать шаблонизатор ejs
app.set('view engine', 'ejs');
//Обслуживает статичные файлы в папке 'public'
app.use(express.static('public'));

/* 
Проверяет началась ли игра и, если нет, то рендерит страницу с start game. 
В обратном случае рендерит с join game. 
Здесь в шаблонизатор передается параметр game_is_started
*/



app.get('/', (req, res) => {
  res.render('homepage', { game_is_started });
});

//Отличие app.post() от app.get():
//get - собирает данные с сервера и не изменяет его состояние
//post - отправляет данные на сервер и может изменять его состояние

app.get('/player1', (req, res) => {
  game_is_started = true;
  console.log('Player 1 joined');
  res.render('virus');
});

app.get('/player2', (req, res) => {
  if (game_is_started) {
    console.log('Player 2 joined');
  }
  res.render('virus');
});

http.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
