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
function addMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((value, j) => value + (b[i]?.[j] ?? 0)));
}

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
  //========================================~~~~~~~~~~~~~==

  const clickHandler = (x: number, y: number) => {
    //初チェック時の爆弾生成
    while (
      newbombMap.reduce((totalbom, row) => totalbom + row.filter((tmp) => tmp === 1).length, 0) <
      bombnum
    ) {
      const bom_x = getRandomValue(boardlength);
      const bom_y = getRandomValue(boardlength);
      if (bom_x === x && bom_y === y) continue;
      newbombMap[bom_x][bom_y] = 1;
    }

    for (let i = 0; i < boardlength; i++)
      for (let j = 0; j < boardlength; j++)
        if (newbombMap[i][j] === 1) {
          board[i][j] = 4;
        }

    do_empty_chain(y, x, directions, newbombMap, newuserInput);
    // newuserInput[y][x] = 1;

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
        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((boardnum, x) => (
              <div
                key={`${x}-${y}`}
                onClick={() => clickHandler(x, y)}
                className={styles.cell}
                style={{
                  backgroundPosition:
                    boardnum === 1
                      ? -30 * (countArroundBomb(y, x, directions, newbombMap) - 1)
                      : -30 * (6 + boardnum),
                }}
                //参考 style={boardnum === 1 ? { backgroundColor: "lightblue" } : {}}
              >
                {boardnum === 1 && countArroundBomb(y, x, directions, bombMap) === 0 && (
                  <div className={styles.empty} />
                )}
                {boardnum === 0 && <div className={styles.covered} />}
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
