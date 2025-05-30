'use client';

import { useState } from 'react';
import styles from './page.module.css';

//後でstateやコンテキストでレベル別で出来るようにする
const bombnum = 10;
const boardlength: number = 8;

//今のところ関係ない
const calcTotal = (array: number[], counter: number) => {
  let ans: number = 0;
  for (let i = 0; i < array.length; i++) {
    ans += array[i];
  }
  return ans + counter;
};
//周囲のボム数えて返す
const countArroundBomb = (y: number, x: number, directions: number[][], bombMap: number[][]) => {
  let arroundBombNum = 0;
  for (let i = 0; i < directions.length; i++) {
    if (bombMap[y + directions[i][1]] === undefined) continue;
    if (bombMap[y + directions[i][1]][x + directions[i][0]] === undefined) continue;
    if (bombMap[y + directions[i][1]][x + directions[i][0]] === 1) arroundBombNum++;
  }
  return arroundBombNum;
};
//ボム生成用の乱数  添え字を返す
const getRandomValue = (boardlength: number): number => {
  return Math.floor(Math.random() * boardlength);
};
//二次元配列同氏の足し算
// function addMatrices(a: number[][], b: number[][]): number[][] {
//   return a.map((row, i) => row.map((value, j) => value + (b[i]?.[j] ?? 0)));
// }

//空白連鎖の再起関数  値を直接いじらないようにしたい
const do_empty_chain = (
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

const isgameover = (newuserInput: number[][], newbombMap: number[][]) => {
  for (let i = 0; i < newuserInput.length; i++)
    for (let j = 0; j < newuserInput.length; j++)
      if (newuserInput[i][j] === 1 && newbombMap[i][j] === 1) return true;
};

export default function Home() {
  const directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, 1],
    [0, -1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];
  const [userInput, setuserInput] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [bombMap, setbombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const newuserInput = structuredClone(userInput);
  const newbombMap = structuredClone(bombMap);
  let board = newuserInput;
  const gameover = false;
  //========================================~~~~~~~~~~~~~==
  const reset = (boardlength: number, newuserInput: number[][], newbombMap: number[][]) => {
    newuserInput.forEach((row) => row.fill(0));
    newbombMap.forEach((row) => row.fill(0));
    setuserInput(newuserInput);
    setbombMap(newbombMap);
  };
  const createflag = (
    newuserInput: number[][],
    x: number,
    y: number,
    evt: React.MouseEvent<HTMLDivElement>,
  ) => {
    evt.preventDefault();
    // newuserInput[y][x] = 3;
    if (newuserInput[y][x] === 0 || newuserInput[y][x] === 2) newuserInput[y][x] = 3;
    else if (newuserInput[y][x] === 3) newuserInput[y][x] = 0;
    setuserInput(newuserInput);
    return;
  };
  const clickHandler = (x: number, y: number) => {
    //初チェック時の爆弾生成
    while (
      newbombMap.reduce((totalbom, row) => totalbom + row.filter((tmp) => tmp === 1).length, 0) <
      bombnum
    ) {
      const bom_x = getRandomValue(boardlength);
      const bom_y = getRandomValue(boardlength);
      if (bom_x === x && bom_y === y) continue;
      newbombMap[bom_y][bom_x] = 1;
    }

    // //gameover判定
    // if (newbombMap[y][x] === 1) gameover = true;

    do_empty_chain(y, x, directions, newbombMap, newuserInput);

    //gameoverでboardに爆弾を適応
    if (isgameover(newuserInput, newbombMap)) {
      for (let i = 0; i < boardlength; i++)
        for (let j = 0; j < boardlength; j++)
          if (newbombMap[i][j] === 1) {
            board[i][j] = 4;
          }
      newuserInput[y][x] = 1;
      alert('gameover');
    }

    console.log('gameover', gameover);
    console.log('newbommap', newbombMap);
    console.log('newuserInput', newuserInput);
    console.log('board', board);
    // console.log('reccount', rec_count);
    board = userInput;
    setuserInput(newuserInput);
    setbombMap(newbombMap);
  };
  //=========================================================
  return (
    <div className={styles.container}>
      <div className={styles.backgroundboard}>
        <div className={styles.optionbox}>
          <div className={styles.leftbomb}>残りボム</div>
          <div
            onClick={() => reset(boardlength, newuserInput, newbombMap)}
            className={isgameover(newuserInput, newbombMap) ? styles.iconbad : styles.iconsmile}
          />
          <div className={styles.time}>時間</div>
        </div>
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((boardnum, x) => (
              <div
                key={`${x}-${y}`}
                className={
                  userInput[y][x] === 1 && newbombMap[y][x] === 1 ? styles.bombfired : styles.cell
                }
                onClick={() => clickHandler(x, y)}
                onContextMenu={(evt) => createflag(newuserInput, x, y, evt)}
              >
                {boardnum === 0 && <div className={styles.covered} />}
                {boardnum === 1 &&
                  newbombMap[y][x] !== 1 &&
                  (countArroundBomb(y, x, directions, bombMap) === 0 ? (
                    <div className={styles.empty} />
                  ) : (
                    <div
                      className={styles.opened}
                      style={{
                        backgroundPosition:
                          -30 * (countArroundBomb(y, x, directions, newbombMap) - 1),
                      }}
                    />
                  ))}
                {boardnum > 1 && (
                  <div
                    className={styles.opened}
                    style={{
                      border: boardnum === (2 | 3) ? '4px, solid' : '2px, solid',
                      borderTopColor: boardnum === (2 | 3) ? '#fff' : '#c6c6c6',
                      borderLeftColor: boardnum === (2 | 3) ? '#fff' : '#c6c6c6',
                      borderRightColor: '#c6c6c6',
                      borderBottomColor: '#c6c6c6',
                      backgroundPosition: -30 * (6 + boardnum),
                    }}
                  />
                )}
                {/* {boardnum !== 0 && countArroundBomb(y, x, directions, bombMap) > 0 && (
                  <div
                    className={styles.opened}
                    style={{
                      backgroundPosition:
                        boardnum === 1
                          ? -30 * (countArroundBomb(y, x, directions, newbombMap) - 1)
                          : -30 * (6 + boardnum),
                    }}
                  />
                )} */}
                {/* {boardnum === 0 && <div className={styles.covered} />}
              {boardnum === 1 && <div className={styles.opened} />}
              {boardnum === 2 && <div className={styles.question} />}
              {boardnum === 3 && <div className={styles.flag} />}
              {boardnum === 4 && <div className={styles.bom} />} */}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
