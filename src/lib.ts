//二次元配列の生成
export function createZeroGrid(cols: number, rows: number): number[][] {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  return grid;
}

//残りのボム数返す
export const countleftbomb = (board: number[][], bombnum: number) => {
  return (
    bombnum - board.reduce((totalbom, row) => totalbom + row.filter((tmp) => tmp === 3).length, 0)
  );
};

//周囲のボム数えて返す
export const countArroundBomb = (
  y: number,
  x: number,
  directions: number[][],
  bombMap: number[][],
) => {
  let arroundBombNum = 0;
  for (let i = 0; i < directions.length; i++) {
    if (bombMap[y + directions[i][1]] === undefined) continue;
    if (bombMap[y + directions[i][1]][x + directions[i][0]] === undefined) continue;
    if (bombMap[y + directions[i][1]][x + directions[i][0]] === 1) arroundBombNum++;
  }
  return arroundBombNum;
};

//ボム生成用の乱数  添え字を返す
export const getRandomValue = (endnum: number) => {
  return Math.floor(Math.random() * endnum);
};

//空白連鎖の再起関数  値を直接いじらないようにしたい
export const do_empty_chain = (
  y: number,
  x: number,
  directions: number[][],
  newbombMap: number[][],
  userInput: number[][],
) => {
  if (userInput[y] === undefined) return;
  if (userInput[y][x] === undefined) return;
  if (userInput[y][x] === 1) return;
  userInput[y][x] = 1;
  if (countArroundBomb(y, x, directions, newbombMap) > 0) return;
  for (let i = 0; i < 8; i++)
    do_empty_chain(y + directions[i][1], x + directions[i][0], directions, newbombMap, userInput);
};

export const checkGameover = (newuserInput: number[][], newbombMap: number[][]): boolean => {
  for (let i = 0; i < newuserInput.length; i++)
    for (let j = 0; j < newuserInput[0].length; j++)
      if (newuserInput[i][j] === 1 && newbombMap[i][j] === 1) return true;
  return false;
};

//クリア判定
export const checkClear = (newuserInput: number[][], newbombMap: number[][]) => {
  if (
    newuserInput.reduce((total, row) => total + row.filter((tmp) => tmp !== 1).length, 0) ===
    newbombMap.reduce((total, row) => total + row.filter((tmp) => tmp === 1).length, 0)
  )
    return true;
  return false;
};

export const change_clear_board = (newuserInput: number[][]) => {
  for (let i = 0; i < newuserInput.length; i++)
    for (let j = 0; j < newuserInput[0].length; j++) {
      if (newuserInput[i][j] !== 1) newuserInput[i][j] = 3;
    }
};
