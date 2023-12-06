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

function check_victory(tableArr, player, i, j) {
  let av_count = 0;
  for (let x = i - 1; x < i + 2; x++) {
    for (let y = j - 1; y < j + 2; y++) {
      if (tableArr[x][y] == 0 || tableArr[x][y] == 2) {
        av_count++;
      }
    }
  }
  if (av_count == 0) {
    alert("win");
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
            turn_count.next();
          }
          else if (tableArr[i][j] == 2) {
            newCell.innerHTML = '<img src="assets/oax_CP.gif">';
            tableArr[i][j] = 21;
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
            turn_count.next();
          }
          else if (tableArr[i][j] == 1) {
            newCell.innerHTML = '<img src="assets/oax_CY.gif">';
            tableArr[i][j] = 12;
            turn_count.next();
          }
        }
      }
    }
  }
  if (turn_count.comp(3)) {
    alert('made the move');
    turn_count.make_null();
  }
  check_victory(tableArr, player, i, j);
}

function createTable(table, tableArr, parent, turn_count, player) {
  for (let i = 1; i < tableArr.length - 1; i++) {
    let row = table.insertRow();
    for (let j = 1; j < tableArr[i].length - 1; j++) {
      let newCell = row.insertCell();
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
        check_cell(tableArr, newCell, player, turn_count, i, j);
      };
    }
  }
  parent.appendChild(table);
}

var parent_table = document.getElementById('table-container');
var tableArr = [
  [3, 3, 3, 3, 3, 3, 3, 3],
  [3, 0, 1, 1, 1, 1, 1, 3],
  [3, 0, 1, 1, 1, 1, 1, 3],
  [3, 0, 1, 1, 1, 1, 1, 3],
  [3, 0, 1, 1, 1, 1, 1, 3],
  [3, 0, 1, 1, 1, 1, 1, 3],
  [3, 2, 1, 1, 1, 1, 1, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
let table = document.createElement('table');
var player_figures = ['X', 'O'];
var player = player_figures[0];
var turn_count = new Counter();

createTable(table, tableArr, parent_table, turn_count, player);