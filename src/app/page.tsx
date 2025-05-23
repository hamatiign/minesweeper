'use client';

import { useState } from 'react';
import styles from './page.module.css';

//今のところ関係ない
const calcTotal = (array: number[], counter: number) => {
  let ans: number = 0;
  for (let i = 0; i < array.length; i++) {
    ans += array[i];
  }
  return ans + counter;
};

//ボム生成用の乱数  添え字を返す
const getRandomValue = (boardlength: number): number => {
  return Math.floor(Math.random() * boardlength);
};

//後でstateやコンテキストでレベル別で出来るようにする
const bombnum = 10;
const boardlength = 8;

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
    [0, 2, 3, 4, 0, 0, 0, 0],
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
  const board = newuserInput;
  console.log('board', board);
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
      for (let j = 0; j < boardlength; j++) if (newbombMap[i][j] === 1) board[i][j] = 4;

    console.log('newbommap', newbombMap);
    newuserInput[y][x] === 1;
    setuserInput(newuserInput);
    setbombMap(newbombMap);
  };
  //=========================================================
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((boardnum, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
              className={styles.cell}
              style={{ backgroundPosition: boardnum === 1 ? -30 : -30 * (6 + boardnum) }}
            >
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
  );
}
