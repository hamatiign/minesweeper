'use client';

import { useEffect, useState } from 'react';

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
//残りのボム数返す
const countleftbomb = (board: number[][], bombnum: number) => {
  return (
    bombnum - board.reduce((totalbom, row) => totalbom + row.filter((tmp) => tmp === 3).length, 0)
  );
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
// const check_timer_active = (board: number[][]) => {
//   if (board.some((row) => row.some((num) => num !== 0))) return true;
// };
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

  //初期値を-１として
  const [time, settime] = useState(0);
  // const starttimer = (board: number[][]) => {
  //   if (board.some((row) => row.some((num) => num !== 0))) settime(0);
  // };
  const [istimerRun, setistimerRun] = useState(false);
  useEffect(
    () => {
      if (!istimerRun) return;
      const interval = setInterval(() => {
        settime(time + 1);
      }, 1000);
      return () => clearInterval(interval);
    },
    //ここに依存するものを書く
    [time, istimerRun],
  );

  const gameover = false;
  //========================================~~~~~~~~~~~~~==
  const reset = (boardlength: number, newuserInput: number[][], newbombMap: number[][]) => {
    newuserInput.forEach((row) => row.fill(0));
    newbombMap.forEach((row) => row.fill(0));
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    setistimerRun(false);
    settime(0);
  };

  const choiselevels = () => {};
  const rightclick = (
    newuserInput: number[][],
    x: number,
    y: number,
    evt: React.MouseEvent<HTMLDivElement>,
  ) => {
    evt.preventDefault();
    if (isgameover(newuserInput, newbombMap)) return;
    // newuserInput[y][x] = 3;
    if (newuserInput[y][x] === 0) newuserInput[y][x] = 3;
    else if (newuserInput[y][x] === 3) newuserInput[y][x] = 2;
    else if (newuserInput[y][x] === 2) newuserInput[y][x] = 0;
    setuserInput(newuserInput);
    if (!istimerRun) setistimerRun(true);
    return;
  };

  const clickHandler = (x: number, y: number) => {
    if (isgameover(newuserInput, newbombMap)) return;
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
    userInput[y][x] = 1; //ボムを引いた時のユーザー入力を再起関数でいじれてないため

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
    if (!istimerRun) setistimerRun(true);
  };
  //=========================================================
  return (
    <div className={styles.container}>
      <div className={styles.levels}>
        <span className={styles.myspan}>初級</span>
        <span className={styles.myspan}>中級</span>
        <span className={styles.myspan}>上級</span>
        <span className={styles.myspan}>カスタム</span>
      </div>
      <div
        className={styles.backgroundboard}
        style={{ width: boardlength * 30 + 36, height: boardlength * 30 + 16.5 * 3 + 70 }}
      >
        <div className={styles.optionbox} style={{ width: 30 * boardlength }}>
          <div className={styles.leftbomb}>{countleftbomb(board, bombnum)}</div>
          <div
            onClick={() => reset(boardlength, newuserInput, newbombMap)}
            className={isgameover(newuserInput, newbombMap) ? styles.iconbad : styles.iconsmile}
          />
          <div className={styles.time}>{time}</div>
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
                onContextMenu={(evt) => rightclick(newuserInput, x, y, evt)}
              >
                {boardnum === 0 && <div className={styles.covered} />}
                {boardnum === 1 &&
                  newbombMap[y][x] !== 1 &&
                  (countArroundBomb(y, x, directions, bombMap) === 0 ? (
                    <div className={styles.empty} />
                  ) : (
                    <div
                      className={styles.nums}
                      style={{
                        backgroundPosition:
                          -30 * (countArroundBomb(y, x, directions, newbombMap) - 1),
                      }}
                    />
                  ))}
                {boardnum === 2 && <div className={styles.question} />}
                {boardnum === 3 && <div className={styles.flag} />}
                {boardnum === 4 && <div className={styles.bomb} />}
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

// style={{
//   backgroundSize: boardnum === (2 | 3) ? '294px, 21px' : '420px, 30px',
//   border: boardnum === (2 | 3) ? '4px, solid' : '2px, solid',
//   borderTopColor: boardnum === (2 | 3) ? '#fff' : '#c6c6c6',
//   borderLeftColor: boardnum === (2 | 3) ? '#fff' : '#c6c6c6',
//   borderRightColor: '#c6c6c6',
//   borderBottomColor: '#c6c6c6',
//   backgroundPosition:
//     boardnum === (2 | 3) ? -20.9 * (6 + boardnum) : -30 * (6 + boardnum),
// }}
