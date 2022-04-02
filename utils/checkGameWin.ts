export const checkWinner = (
  iIdx: number,
  jIdx: number,
  player: String,
  data: (String | null)[][]
) => {
  var arraySize = data.length;
  var moveCount = 0;
  for (var row of data) {
    for (var ele of row) {
      if (ele === null) {
        moveCount += 1;
      }
    }
  }
  //horizontal
  var flag = true;
  for (var i = 0; i < arraySize; i++) {
    if (data[i][jIdx] !== player) {
      flag = false;
      break;
    }
  }
  if (flag) {
    return 1;
  }

  flag = true;
  for (var i = 0; i < arraySize; i++) {
    if (data[iIdx][i] !== player) {
      flag = false;
      break;
    }
  }
  if (flag) {
    return 1;
  }
  //diagonal
  if (iIdx === jIdx || iIdx === arraySize - jIdx - 1) {
    flag = true;
    for (var i = 0; i < arraySize; i++) {
      if (data[i][i] !== player) {
        flag = false;
        break;
      }
    }
    if (flag) {
      return 1;
    }
    flag = true;
    for (var i = 0; i < arraySize; i++) {
      if (data[i][arraySize - i - 1] !== player) {
        flag = false;
        break;
      }
    }
    if (flag) {
      return 1;
    }
  }

  if (moveCount === 0) return 0;
};
