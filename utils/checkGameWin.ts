export const checkWinner = (
  iIdx: number,
  jIdx: number,
  player: String,
  data: (String | null)[][],
  moveCount: number
) => {
  var arraySize = data.length;

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

  if (moveCount === 1) return 0;
};
