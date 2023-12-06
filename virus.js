/*
  0 = empty
  1 = cross
  2 = circle
  12 = blue cross
  21 = red circle
*/

function check_victory(tableArr) {
  
}

function check_cell(tableArr, newCell, player, i, j) {
  if (player == 'X') {
    for (let x = i - 1; x < i + 2; x++) {
      for (let y = j - 1; y < j + 2; y++) {
        if (tableArr[x][y] == 1 || tableArr[x][y] == 21) {
          if (tableArr[i][j] == 0) {
            newCell.innerHTML = '<img src="assets/oax_CX.gif">';
            tableArr[i][j] = 1;
          }
          else if (tableArr[i][j] == 2) {
            newCell.innerHTML = '<img src="assets/oax_CP.gif">';
            tableArr[i][j] = 21;
          }
          check_victory(tableArr);
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
          }
          else if (tableArr[i][j] == 1) {
            newCell.innerHTML = '<img src="assets/oax_CY.gif">';
            tableArr[i][j] = 12;
          }
        }
      }
    }
  }
}

function createTable(table, tableArr, parent, player) {
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
        check_cell(tableArr, newCell, player, i, j);
      };
    }
  }
  parent.appendChild(table);
}

var parent_table = document.getElementById('table-container');
var tableArr = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
let table = document.createElement('table');
var player_figures = ['X', 'O'];
var player = player_figures[0];

createTable(table, tableArr, parent_table, player);