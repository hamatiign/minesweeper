'use client';

import { useState } from 'react';
import styles from './page.module.css';
//テスト
const down = (n: number) => {
  if (n === 0) return;
  console.log(n);
  down(n - 1);
};
down(10);

//その数までの和
const sum1 = (i: number): number => {
  if (i === 0) return 0;
  return sum1(i - 1) + i;
};

//両端含む間の和
const sum2 = (first: number, last: number) => {
  return sum1(last) - sum1(first - 1);
};

const sum3 = (a: number, b: number) => ((a + b) * (b - a + 1)) / 2;

console.log(sum1(10));
console.log(sum2(4, 10));
console.log(sum3(4, 10));

const calcTotal = (array: number[], counter: number) => {
  let ans: number = 0;
  for (let i = 0; i < array.length; i++) {
    ans += array[i];
  }
  return ans + counter;
};
export default function Home() {
  const [numbers, setnumbers] = useState([0, 0, 0, 0, 0]);
  const [sampleCounter, setsampleCounter] = useState(0);
  console.log(numbers);
  const total = calcTotal(numbers, sampleCounter);
  console.log(total);
  const clickHandler = () => {
    setsampleCounter((sampleCounter + 1) % 14);
    const newnumbers = structuredClone(numbers);
    newnumbers[sampleCounter % 5] += 1;
    setnumbers(newnumbers);
  };
  console.log(sampleCounter);

  return (
    <div className={styles.container}>
      <div className={styles.sampleCell} style={{ backgroundPosition: sampleCounter * -30 }} />
      <button onClick={() => clickHandler()}>クリック</button>
    </div>
  );
}
