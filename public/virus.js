/*
  0 = empty
  1 = cross
  2 = circle
  12 = blue cross
  21 = red circle
  3 - borders
*/
/*
  Варианты победы:
  1. Крестики заняли последний нолик
  2. Крестики так распространились, что ноликам больше некуда идти
  3. Нолики заняли последний крестик
  4. Нолики так распространились, что крестиками больше некуда идти
*/

import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

socket.on('connect', () => {
  console.log(`You connected with id: ${socket.id}`);
});

socket.on('receive-table', (GameData) => {
  //удаление старой таблицы перед получением новой
  let tb = document.querySelector('tbody');
  while (tb.childNodes.length) {
    tb.removeChild(tb.childNodes[0]);
  }
  active_player = GameData.active_player;
  tableArr = GameData.tableArr;
  flag = GameData.flag;
  document.getElementById('giveUpBtn').disabled = false;
  //получение таблицы другим клиентом
  createTable(tableArr);
  console.log(GameData.tableArr);
  console.log(GameData.flag);
  console.log(GameData.active_player);
});

socket.on('get_end_of_game', winner => {
  if (winner == 'X') {
    winText.innerHTML = 'Crosses won';
  } else if (winner == 'O') {
    winText.innerHTML = 'Circles won';
  }
  flag = false;
  let tb = document.querySelector('tbody');
  while (tb.childNodes.length) {
    tb.removeChild(tb.childNodes[0]);
  }
  createTable(tableArr);
});

function handle_turn_change(tableArrLocal, player) {
  if (player == 'X') {
    active_player = 'O';
  } else if (player == 'O') {
    active_player = 'X';
  }
  tableArr = tableArrLocal;
  flag = false;
  document.getElementById('giveUpBtn').disabled = true;
  socket.emit('send-table', tableArr, true, active_player);
  let tb = document.querySelector('tbody');
  while (tb.childNodes.length) {
    tb.removeChild(tb.childNodes[0]);
  }
  createTable(tableArr);
}

function check_victory(tableArr) {
  let cir_count = 0;
  let cross_count = 0;
  for (let i = 1; i < tableArr.length - 1; i++) {
    for (let j = 1; j < tableArr[i].length - 1; j++) {
      if (tableArr[i][j] == 2) {
        cir_count++;
      }
      if (tableArr[i][j] == 1) {
        cross_count++;
      }
    }
  }
  if (cir_count == 0) {
    handle_end_of_game('X');
    return;
  }
  else if (cross_count == 0) {
    handle_end_of_game('O');
    return;
  }
}

function check_cell(tableArr, newCell, i, j) {
  console.log(`active player is ${active_player}`);
  if (active_player == 'X') {
    for (let x = i - 1; x < i + 2; x++) {
      for (let y = j - 1; y < j + 2; y++) {
        if (tableArr[x][y] == 1 || tableArr[x][y] == 21) {
          if (tableArr[i][j] == 0) {
            newCell.innerHTML = '<img src="assets/oax_CX.gif">';
            tableArr[i][j] = 1;
            check_victory(tableArr, active_player, i, j);
            turn_count++;
          }
          else if (tableArr[i][j] == 2) {
            newCell.innerHTML = '<img src="assets/oax_CP.gif">';
            tableArr[i][j] = 21;
            check_victory(tableArr, active_player, i, j);
            turn_count++;
          }
        }
      }
    }
  }
  else if (active_player == 'O') {
    for (let x = i - 1; x < i + 2; x++) {
      for (let y = j - 1; y < j + 2; y++) {
        if (tableArr[x][y] == 2 || tableArr[x][y] == 12) {
          if (tableArr[i][j] == 0) {
            newCell.innerHTML = '<img src="assets/oax_CO.gif">';
            tableArr[i][j] = 2;
            check_victory(tableArr, active_player, i, j);
            turn_count++;
          }
          else if (tableArr[i][j] == 1) {
            newCell.innerHTML = '<img src="assets/oax_CY.gif">';
            tableArr[i][j] = 12;
            check_victory(tableArr, active_player, i, j);
            turn_count++;
          }
        }
      }
    }
  }
  if (turn_count == 3) {
    handle_turn_change(tableArr, active_player);
    turn_count = 0;
    
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createTable(tableArr);
  socket.emit('game_is_started', true);
});

function createTable(tableArr) {
  let table = document.getElementById('game_field');
  let tbody = table.getElementsByTagName('tbody')[0];
  for (let i = 1; i < tableArr.length - 1; i++) {
    let row = document.createElement('tr');
    for (let j = 1; j < tableArr[i].length - 1; j++) {
      let newCell = document.createElement('td');
      if (tableArr[i][j] == 0) {
        newCell.innerHTML = '<img src="assets/oax_W.gif">';
      }
      else if (tableArr[i][j] == 1) {
        newCell.innerHTML = '<img src="assets/oax_CX.gif">';
      }
      else if (tableArr[i][j] == 2) {
        newCell.innerHTML = '<img src="assets/oax_CO.gif">';
      }
      else if (tableArr[i][j] == 12) {
        newCell.innerHTML = '<img src="assets/oax_CY.gif">';
      }
      else if (tableArr[i][j] == 21) {
        newCell.innerHTML = '<img src="assets/oax_CP.gif">';
      }
      if (flag) {
        newCell.onclick = function () {
          check_cell(tableArr, newCell, i, j);
        };
      } else { newCell.onclick = function () { }; }
      row.appendChild(newCell);
    }
    tbody.appendChild(row);
  }
}

function handle_end_of_game(winner) {
  if (winner == 'X') {
    winText.innerHTML = 'Crosses won';
  } else if (winner == 'O') {
    winText.innerHTML = 'Circles won';
  }
  flag = false;
  let tb = document.querySelector('tbody');
  while (tb.childNodes.length) {
    tb.removeChild(tb.childNodes[0]);
  }
  createTable(tableArr);
  socket.emit('set_end_of_game', winner);
}

let giveUpButton = document.getElementById('giveUpBtn');
let winText = document.getElementById('game_res');
giveUpButton.addEventListener('click', () => {
  let winner;
  if (active_player == 'O') {
    winner = 'X';
  } else if (active_player == 'X') {
    winner = 'O';
  }
  handle_end_of_game(winner);
});

var tableArr = [
  [3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 0, 0, 0, 0, 1, 3],
  [3, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 0, 3],
  [3, 2, 0, 0, 0, 0, 0, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
var active_player = 'O';
var turn_count = 0;
var flag = true;