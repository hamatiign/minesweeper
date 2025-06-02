'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.css';

//後でstateやコンテキストでレベル別で出来るようにする

//今のところ関係ない
const calcTotal = (array: number[], counter: number) => {
  let ans: number = 0;
  for (let i = 0; i < array.length; i++) {
    ans += array[i];
  }
  return ans + counter;
};

//二次元配列の生成
function createZeroGrid(cols: number, rows: number): number[][] {
  const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  return grid;
}
// 例: 縦3×横4のグリッドを生成
console.log(createZeroGrid(3, 4));

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
const getRandomValue = (endnum: number) => {
  return Math.floor(Math.random() * endnum);
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
    for (let j = 0; j < newuserInput[0].length; j++)
      if (newuserInput[i][j] === 1 && newbombMap[i][j] === 1) return true;
};

export default function Home() {
  const [bombnum, setbombnum] = useState(10);
  const [boardlength, setboardlength] = useState([9, 9]); //（横、縦）
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [bombMap, setbombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const newuserInput = structuredClone(userInput);
  const newbombMap = structuredClone(bombMap);
  let board = newuserInput;

  const [time, settime] = useState(0);

  const [istimerRun, setistimerRun] = useState(false);
  const [iscustom, setcustom] = useState(false);

  useEffect(() => {
    if (!istimerRun) return;
    const interval = setInterval(() => {
      settime(time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time, istimerRun]);

  const checkdlevelstr = (newuserInput: number[][], iscustom: boolean) => {
    const width = newuserInput.length;
    if (width === 9 && !iscustom) return 'easy';
    if (width === 16 && !iscustom) return 'normal';
    if (width === 30 && !iscustom) return 'hard';
    else return 'custom';
  };

  // const gameover = false;

  //========================================~~~~~~~~~~~~~==
  const reset = (newuserInput: number[][], newbombMap: number[][]) => {
    newuserInput.forEach((row) => row.fill(0));
    newbombMap.forEach((row) => row.fill(0));
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    setistimerRun(false);
    settime(0);
  };

  const updatecustomboard = () => {
    const inputwidth = document.getElementsByName('inputwidth')[0] as HTMLInputElement;
    const inputheight = document.getElementsByName('inputheight')[0] as HTMLInputElement;
    const inputbombnum = document.getElementsByName('inputbombnum')[0] as HTMLInputElement;

    const width = parseInt(inputwidth.value, 10);
    const height = parseInt(inputheight.value, 10);
    const bombnum = parseInt(inputbombnum.value, 10);

    changeboard(width, height, bombnum, createZeroGrid(width, height));
    setistimerRun(false);
    settime(0);
    setcustom(true);
  };
  const custombottun = () => {
    changeboard(9, 9, 10, createZeroGrid(9, 9));
    setistimerRun(false);
    settime(0);
    setcustom(true);
  };
  const easylevelbottun = () => {
    changeboard(9, 9, 10, createZeroGrid(9, 9));
    setistimerRun(false);
    settime(0);
    setcustom(false);
  };
  const normallevelbottun = () => {
    changeboard(16, 16, 40, createZeroGrid(16, 16));
    setistimerRun(false);
    settime(0);
    setcustom(false);
  };
  const hardlevelbottun = () => {
    changeboard(30, 16, 99, createZeroGrid(30, 16));
    setistimerRun(false);
    settime(0);
    setcustom(false);
  };

  const changeboard = (
    width: number,
    height: number,
    bombnum: number,
    newuserInput: number[][],
  ) => {
    setboardlength([width, height]);
    setbombnum(bombnum);
    setuserInput(newuserInput);
    setbombMap(newuserInput);
    console.log('boardlength', boardlength);
    console.log('bombnum', bombnum);
  };

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
      const bom_x = getRandomValue(boardlength[0]);
      const bom_y = getRandomValue(boardlength[1]);
      if (bom_x === x && bom_y === y) continue;
      newbombMap[bom_y][bom_x] = 1;
    }

    do_empty_chain(y, x, directions, newbombMap, newuserInput);
    userInput[y][x] = 1; //ボムを引いた時のユーザー入力を再起関数でいじれてないため

    //gameoverでboardに爆弾を適応
    if (isgameover(newuserInput, newbombMap)) {
      for (let i = 0; i < boardlength[1]; i++)
        for (let j = 0; j < boardlength[0]; j++)
          if (newbombMap[i][j] === 1) {
            board[i][j] = 4;
          }
      newuserInput[y][x] = 1;
      alert('gameover');
    }

    board = userInput;
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    if (!istimerRun) setistimerRun(true);
  };
  //=========================================================
  return (
    <div className={styles.container}>
      <div className={styles.levels}>
        <div
          className={
            checkdlevelstr(newuserInput, iscustom) === 'easy' ? styles.currentlevel : styles.level
          }
          id="easy"
          onClick={() => easylevelbottun()}
        >
          初級
        </div>
        <div
          className={
            checkdlevelstr(newuserInput, iscustom) === 'normal' ? styles.currentlevel : styles.level
          }
          id="normal"
          onClick={() => normallevelbottun()}
        >
          中級
        </div>
        <div
          className={
            checkdlevelstr(newuserInput, iscustom) === 'hard' ? styles.correntlevel : styles.level
          }
          id="hard"
          onClick={() => hardlevelbottun()}
        >
          上級
        </div>
        <div
          className={
            checkdlevelstr(newuserInput, iscustom) === 'custom' ? styles.currentlevel : styles.level
          }
          id="custom"
          onClick={() => custombottun()}
        >
          カスタム
        </div>
      </div>
      {iscustom === true && (
        <div className={styles.customs}>
          <span className={styles.myspancustoms}>
            幅：
            <input type="text" name="inputwidth" className={styles.myinput} />
          </span>
          <span className={styles.myspancustoms}>
            高さ：
            <input type="text" name="inputheight" className={styles.myinput} />
          </span>
          <span className={styles.myspancustoms}>
            爆弾数：
            <input type="text" name="inputbombnum" className={styles.myinput} />
          </span>
          <span className={styles.myspancustoms} onClick={() => updatecustomboard()}>
            <button>更新</button>
          </span>
        </div>
      )}

      <div
        className={styles.backgroundboard}
        style={{ width: boardlength[0] * 30 + 36, height: boardlength[1] * 30 + 16.5 * 3 + 70 }}
      >
        <div className={styles.optionbox} style={{ width: 30 * boardlength[0] }}>
          <div className={styles.leftbomb}>{countleftbomb(board, bombnum)}</div>
          <div
            onClick={() => reset(newuserInput, newbombMap)}
            className={isgameover(newuserInput, newbombMap) ? styles.iconbad : styles.iconsmile}
          />
          <div className={styles.time}>{time}</div>
        </div>
        <div
          className={styles.board}
          style={{ width: boardlength[0] * 30 + 8, height: boardlength[1] * 30 + 8 }}
        >
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
