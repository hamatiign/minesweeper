'use client';

import { useEffect, useState } from 'react';

import styles from './page.module.css';

import { EasyLevelButton } from '../components/easylevelbutton';
import { LeftBombNum } from '../components/leftbomb';
import { ResetButtom } from '../components/resetbutton';
import { directions } from '../constants';
import {
  change_clear_board,
  checkClear,
  checkGameover,
  countArroundBomb,
  countleftbomb,
  createZeroGrid,
  do_empty_chain,
  getRandomValue,
} from '../lib';

export default function Home() {
  const [bombnum, setbombnum] = useState(10);
  const [boardlength, setboardlength] = useState([9, 9]); //（横、縦）

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

  const [customboardwidth, setcustomboardwidth] = useState('9');
  const [customboardheight, setcustomboardheight] = useState('9');
  const [custombombcount, setcustombombcount] = useState('10');

  const newuserInput = structuredClone(userInput);
  const newbombMap = structuredClone(bombMap);

  const board = newuserInput;

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
  if (checkClear(newuserInput, newbombMap)) change_clear_board(newuserInput);

  const leftbombnumleft = Math.floor(countleftbomb(board, bombnum) / 100);
  const leftbombnumcenter = Math.floor(
    (countleftbomb(board, bombnum) - leftbombnumleft * 100) / 10,
  );
  const leftbombnumright = Math.floor(
    countleftbomb(board, bombnum) - (leftbombnumleft * 100 + leftbombnumcenter * 10),
  );
  const reset = () => {
    newuserInput.forEach((row) => row.fill(0));
    newbombMap.forEach((row) => row.fill(0));
    setuserInput(newuserInput);
    setbombMap(newbombMap);
    settime(-1);
  };
  const time_thousandsplace = time >= 1000 ? 1 : 0;
  const timeleft = time === -1 ? 0 : Math.floor((time - time_thousandsplace * 1000) / 100);
  const timecenter = time === -1 ? 0 : Math.floor((time - timeleft * 100) / 10);
  const timeright = time === -1 ? 0 : Math.floor(time - (timeleft * 100 + timecenter * 10));

  //========================================~~~~~~~~~~~~~==

  const updatecustomboard = () => {
    let numcustomboardwidth = customboardwidth === '' ? 1 : Number(customboardwidth);
    let numcustomboardheight = customboardheight === '' ? 1 : Number(customboardheight);
    let numcustombombcount = custombombcount === '' ? 1 : Number(custombombcount);

    if (numcustomboardwidth < 1) numcustomboardwidth = 1;
    if (numcustomboardheight < 1) numcustomboardheight = 1;
    if (numcustombombcount < 1) numcustombombcount = 1;
    if (numcustomboardwidth > 100) numcustomboardwidth = 100;
    if (numcustomboardheight > 100) numcustomboardheight = 100;
    if (
      numcustombombcount > numcustomboardwidth * numcustomboardheight - 1 &&
      numcustombombcount !== 1
    )
      numcustombombcount = numcustomboardwidth * numcustomboardheight - 1;
    if (
      numcustombombcount > numcustomboardwidth * numcustomboardheight - 1 &&
      numcustombombcount === 1
    )
      numcustombombcount = 1;

    setcustomboardwidth(String(numcustomboardwidth));
    setcustomboardheight(String(numcustomboardheight));
    setcustombombcount(String(numcustombombcount));
    changeboard(
      numcustomboardwidth,
      numcustomboardheight,
      numcustombombcount,
      createZeroGrid(numcustomboardwidth, numcustomboardheight),
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
    if (checkClear(newuserInput, newbombMap) || checkGameover(newuserInput, newbombMap)) return;
    // newuserInput[y][x] = 3;
    if (newuserInput[y][x] === 0) newuserInput[y][x] = 3;
    else if (newuserInput[y][x] === 3) newuserInput[y][x] = 2;
    else if (newuserInput[y][x] === 2) newuserInput[y][x] = 0;
    setuserInput(newuserInput);
    if (time === -1) settime(0);
    return;
  };

  const clickHandler = (x: number, y: number) => {
    if (checkClear(newuserInput, newbombMap) || checkGameover(newuserInput, newbombMap)) return;

    //初チェック時の爆弾生成
    if (newuserInput.length === 1 && newuserInput[0].length === 1)
      newbombMap[0][0] = 1; //カスタムでの一マスのみの時用
    else {
      while (
        newbombMap.reduce((totalbom, row) => totalbom + row.filter((tmp) => tmp === 1).length, 0) <
        bombnum
      ) {
        const bom_x = getRandomValue(boardlength[0]);
        const bom_y = getRandomValue(boardlength[1]);
        if (bom_x === x && bom_y === y) continue;
        newbombMap[bom_y][bom_x] = 1;
      }
    }

    do_empty_chain(y, x, directions, newbombMap, newuserInput);
    userInput[y][x] = 1; //ボムを引いた時のユーザー入力を再起関数でいじれてないため

    //gameoverでboardに爆弾を適応
    if (checkGameover(newuserInput, newbombMap)) {
      newuserInput.forEach((row, y) => {
        row.forEach((num, x) => {
          if (newbombMap[y][x] === 1) newuserInput[y][x] = 4;
        });
      });
      newuserInput[y][x] = 1;
    }

    setuserInput(newuserInput);
    setbombMap(newbombMap);
    if (time === -1) settime(0);
    if (checkGameover(newuserInput, newbombMap)) settime(1000 + time);
    if (checkClear(newuserInput, newbombMap)) settime(1000 + time);
  };
  //=========================================================
  const isClear = checkClear(newuserInput, newbombMap);
  const isGameover = checkGameover(newuserInput, newbombMap);
  const levelstr = checkdlevelstr(newuserInput, iscustom);
  return (
    <div className={styles.container}>
      <div className={styles.levels}>
        <EasyLevelButton levelstr={levelstr} oneasylevelbutton={easylevelbottun} />
        {/* <div
          className={
            checkdlevelstr(newuserInput, iscustom) === 'easy' ? styles.currentlevel : styles.level
          }
          id="easy"
          onClick={() => easylevelbottun()}
        >
          初級
        </div> */}
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
              onChange={(e) => setcustomboardwidth(e.target.value)}
              // onChange={(e) =>
              //   !isNaN(Number(e.target.value)) &&
              //   setcustomboardwidth(checkthenNumber(e.target.value, 1, 100))
              // }
              className={styles.myinput}
            />
          </span>
          <span className={styles.myspancustoms}>
            高さ：
            <input
              type="number"
              value={customboardheight}
              onChange={(e) => setcustomboardheight(e.target.value)}
              // onChange={(e) =>
              //   !isNaN(Number(e.target.value)) &&
              //   setcustomboardheight(checkthenNumber(e.target.value, 1, 100))
              // }
              className={styles.myinput}
            />
          </span>
          <span className={styles.myspancustoms}>
            爆弾数：
            <input
              type="number"
              aria-valuetext="custombombcount"
              value={custombombcount}
              onChange={(e) => setcustombombcount(e.target.value)}
              // onChange={(e) =>
              //   !isNaN(Number(e.target.value)) &&
              //   setcustombombcount(
              //     checkthenNumber(e.target.value, 1, customboardwidth * customboardheight - 1),
              //   )
              // }
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
        style={{ width: boardlength[0] * 30 + 38, height: boardlength[1] * 30 + 102 }}
      >
        <div className={styles.optionbox} style={{ width: 30 * boardlength[0] + 8 }}>
          {boardlength[0] >= 4 && (
            <LeftBombNum
              leftbombnumleft={leftbombnumleft}
              leftbombnumcenter={leftbombnumcenter}
              leftbombnumright={leftbombnumright}
            />
          )}
          {boardlength[0] >= 6 && (
            <ResetButtom onReset={reset} isClear={isClear} isGameover={isGameover} />
          )}
          {boardlength[0] >= 9 && (
            <div className={styles.time}>
              <div
                className={styles.timenum}
                style={{ backgroundPosition: -30 * timeleft - 5.7 }}
              />
              <div
                className={styles.timenum}
                style={{ backgroundPosition: -30 * timecenter - 5.7 }}
              />
              <div
                className={styles.timenum}
                style={{ backgroundPosition: -30 * timeright - 5.7 }}
              />
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
                {boardnum === 0 && (
                  // (isgameover(newuserInput, newbombMap) ? (
                  //   <div className={styles.lockedcovered} />
                  // ) : (
                  //   <div className={styles.covered} />
                  // ))
                  // <div className={styles.lockedcovered} />
                  <div
                    className={
                      checkGameover(newuserInput, newbombMap)
                        ? styles.lockedcovered
                        : styles.covered
                    }
                  />
                )}
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
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
