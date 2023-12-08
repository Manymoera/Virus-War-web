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

function Counter() {
  this.value = 0;
}
Counter.prototype.next = function () {
  return this.value++;
};
Counter.prototype.make_null = function () {
  return this.value = 0;
};
Counter.prototype.comp = function (val) {
  if (this.value == val) {
    return true;
  }
  else {
    return false;
  }
};

function handle_turn_change() {
  alert('made the move');
}

function check_victory(tableArr, player) {
  let av_count = 0;
  let cir_count = 0;
  let cross_count = 0;
  for (let i = 1; i < tableArr.length - 1; i++) {
    for (let j = 1; j < tableArr[i].length - 1; j++) {
      if ((player == 'X' && tableArr[i][j] == 1) ||
        (player == 'O' && tableArr[i][j] == 2)) {
        for (let x = i - 1; x < i + 2; x++) {
          for (let y = j - 1; y < j + 2; y++) {
            if ((player == 'X' && (tableArr[x][y] == 0 || tableArr[x][y] == 2 || tableArr[x][y] == 21)) ||
              (player == 'O' && (tableArr[x][y] == 0 || tableArr[x][y] == 1 || tableArr[x][y] == 12))) {
              av_count++;
            }
          }
        }
      }
      if (tableArr[i][j] == 2) {
        cir_count++;
      }
      if (tableArr[i][j] == 1) {
        cross_count++;
      }
    }
  }
  if (av_count == 0) {
    alert('win');
    return;
  }
  else if (cir_count == 0) {
    alert('crosses win');
    return;
  }
  else if (cross_count == 0) {
    alert('circles win');
    return;
  }
}

function check_cell(tableArr, newCell, player, turn_count, i, j) {
  if (player == 'X') {
    for (let x = i - 1; x < i + 2; x++) {
      for (let y = j - 1; y < j + 2; y++) {
        if (tableArr[x][y] == 1 || tableArr[x][y] == 21) {
          if (tableArr[i][j] == 0) {
            newCell.innerHTML = '<img src="assets/oax_CX.gif">';
            tableArr[i][j] = 1;
            check_victory(tableArr, player, i, j);
            turn_count.next();
          }
          else if (tableArr[i][j] == 2) {
            newCell.innerHTML = '<img src="assets/oax_CP.gif">';
            tableArr[i][j] = 21;
            check_victory(tableArr, player, i, j);
            turn_count.next();
          }
        }
      }
    }
  }
  else if (player == 'O') {
    for (let x = i - 1; x < i + 2; x++) {
      for (let y = j - 1; y < j + 2; y++) {
        if (tableArr[x][y] == 2 || tableArr[x][y] == 12) {
          if (tableArr[i][j] == 0) {
            newCell.innerHTML = '<img src="assets/oax_CO.gif">';
            tableArr[i][j] = 2;
            check_victory(tableArr, player, i, j);
            turn_count.next();
          }
          else if (tableArr[i][j] == 1) {
            newCell.innerHTML = '<img src="assets/oax_CY.gif">';
            tableArr[i][j] = 12;
            check_victory(tableArr, player, i, j);
            turn_count.next();
          }
        }
      }
    }
  }
  if (turn_count.comp(3)) {
    handle_turn_change();
    turn_count.make_null();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createTable(tableArr, turn_count, active_player);
});

function createTable(tableArr, turn_count, active_player) {
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
      newCell.onclick = function () {
        check_cell(tableArr, newCell, active_player, turn_count, i, j);
      };
      row.appendChild(newCell);
    }
    tbody.appendChild(row);
  }
}

var parent_table = document.getElementById('table-container');
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
var player_figures = ['X', 'O'];
var active_player = player_figures[0];
var turn_count = new Counter();