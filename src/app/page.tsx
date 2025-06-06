'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.css';

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

  const [customboardwidth, setcustomboardwidth] = useState(9);
  const [customboardheight, setcustomboardheight] = useState(9);
  const [custombombcount, setcustombombcount] = useState(10);

  const newuserInput = structuredClone(userInput);
  const newbombMap = structuredClone(bombMap);

  let board = newuserInput;

  const [time, settime] = useState(-1);

  const [iscustom, setcustom] = useState(false);

  useEffect(() => {
    if (time === -1 || time > 1000) return;
    const interval = setInterval(() => {
      settime(time + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const checkdlevelstr = (newuserInput: number[][], iscustom: boolean) => {
    const width = newuserInput[0].length;
    if (width === 9 && !iscustom) return 'easy';
    if (width === 16 && !iscustom) return 'normal';
    if (width === 30 && !iscustom) return 'hard';
    else return 'custom';
  };

  const leftbombnumleft = Math.floor(countleftbomb(board, bombnum) / 100);
  const leftbombnumcenter = Math.floor(
    (countleftbomb(board, bombnum) - leftbombnumleft * 100) / 10,
  );
  const leftbombnumright = Math.floor(
    countleftbomb(board, bombnum) - (leftbombnumleft * 100 + leftbombnumcenter * 10),
  );
  const time_thousandsplace = time >= 1000 ? 1 : 0;
  const timeleft = time === -1 ? 0 : Math.floor((time - time_thousandsplace * 1000) / 100);
  const timecenter = time === -1 ? 0 : Math.floor((time - timeleft * 100) / 10);
  const timeright = time === -1 ? 0 : Math.floor(time - (timeleft * 100 + timecenter * 10));

  //========================================~~~~~~~~~~~~~==

  const reset = (newuserInput: number[][], newbombMap: number[][]) => {
    newuserInput.forEach((row) => row.fill(0));
    newbombMap.forEach((row) => row.fill(0));
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    settime(-1);
  };

  const checkthenNumber = (inputstr: string, min: number, max: number) => {
    console.log('inputstr', inputstr);
    if (inputstr === '') return min;
    if (inputstr === '0') return min;
    if (Number(inputstr) > max) return max;
    else return Number(inputstr);
  };

  const updatecustomboard = () => {
    if (customboardwidth < 1) setcustomboardwidth(1);
    if (customboardheight < 1) setcustomboardheight(1);
    if (custombombcount < 1) setcustombombcount(1);
    if (customboardwidth > 100) setcustomboardwidth(100);
    if (customboardheight > 100) setcustomboardheight(100);
    if (custombombcount > customboardwidth * customboardheight - 1)
      setcustombombcount(customboardwidth * customboardheight - 1);
    changeboard(
      customboardwidth,
      customboardheight,
      custombombcount,
      createZeroGrid(customboardwidth, customboardheight),
    );
    settime(-1);
    setcustom(true);
  };
  const custombottun = () => {
    changeboard(9, 9, 10, createZeroGrid(9, 9));
    settime(-1);
    setcustom(true);
  };
  const easylevelbottun = () => {
    changeboard(9, 9, 10, createZeroGrid(9, 9));
    settime(-1);
    setcustom(false);
  };
  const normallevelbottun = () => {
    changeboard(16, 16, 40, createZeroGrid(16, 16));
    settime(-1);
    setcustom(false);
  };
  const hardlevelbottun = () => {
    changeboard(30, 16, 99, createZeroGrid(30, 16));
    settime(-1);
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
    if (time === -1) settime(0);
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
    }

    board = userInput;
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    if (time === -1) settime(0);
    if (isgameover(newuserInput, newbombMap)) settime(1000 + time);
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
            checkdlevelstr(newuserInput, iscustom) === 'hard' ? styles.currentlevel : styles.level
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
            <input
              type="number"
              value={customboardwidth}
              onChange={(e) =>
                !isNaN(Number(e.target.value)) &&
                setcustomboardwidth(checkthenNumber(e.target.value, 1, 100))
              }
              className={styles.myinput}
            />
          </span>
          <span className={styles.myspancustoms}>
            高さ：
            <input
              type="number"
              value={customboardheight}
              onChange={(e) =>
                !isNaN(Number(e.target.value)) &&
                setcustomboardheight(checkthenNumber(e.target.value, 1, 100))
              }
              className={styles.myinput}
            />
          </span>
          <span className={styles.myspancustoms}>
            爆弾数：
            <input
              type="number"
              max={customboardwidth * customboardheight - 1}
              aria-valuetext="custombombcount"
              value={custombombcount}
              onChange={(e) =>
                !isNaN(Number(e.target.value)) &&
                setcustombombcount(
                  checkthenNumber(e.target.value, 1, customboardwidth * customboardheight - 1),
                )
              }
              className={styles.myinput}
            />
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
          {boardlength[0] >= 4 && (
            <div className={styles.leftbomb}>
              <div
                className={styles.leftbombnum}
                style={{
                  backgroundPosition: -30 * leftbombnumleft - 4,
                }}
              />
              <div
                className={styles.leftbombnum}
                style={{
                  backgroundPosition: -30 * leftbombnumcenter - 4,
                }}
              />
              <div
                className={styles.leftbombnum}
                style={{
                  backgroundPosition: -30 * leftbombnumright - 4,
                }}
              />
            </div>
          )}
          {boardlength[0] >= 6 && (
            <div
              onClick={() => reset(newuserInput, newbombMap)}
              className={isgameover(newuserInput, newbombMap) ? styles.iconbad : styles.iconsmile}
            />
          )}
          {boardlength[0] >= 9 && (
            <div className={styles.time}>
              <div className={styles.timenum} style={{ backgroundPosition: -30 * timeleft - 4 }} />
              <div
                className={styles.timenum}
                style={{ backgroundPosition: -30 * timecenter - 4 }}
              />
              <div className={styles.timenum} style={{ backgroundPosition: -30 * timeright - 4 }} />
            </div>
          )}
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
