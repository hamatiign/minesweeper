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

//TODO  後でstateやコンテキストでレベル別で出来るようにする
const bombnum = 10;
const boardlength = 8;

export default function Home() {
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
  //========================================~~~~~~~~~~~~~==

  const clickHandler = (x: number, y: number) => {
    //初チェック時の爆弾生成
    if (!newuserInput.some((row) => row.some((num) => num === 1))) {
      for (let i = 0; i < bombnum; i++) {
        const bom_x = getRandomValue(boardlength);
        const bom_y = getRandomValue(boardlength);
        if (bom_x === x && bom_y === y) {
          i--;
          continue;
        }
        newbombMap[bom_x][bom_y] = 1;
      }
    }

    console.log(newbombMap);
    setuserInput(newuserInput);
    setbombMap(newbombMap);
  };
  //=========================================================
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {userInput.map((row, y) =>
          row.map((column, x) => (
            <div key={`${x}-${y}`} onClick={() => clickHandler(x, y)} className={styles.cell} />
          )),
        )}
      </div>
    </div>
  );
}
