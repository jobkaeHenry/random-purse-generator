import "./styles.css";
import { Chart } from "./Chart";
import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState({ value: 400 });
  const [parsedData, setParsedData] = useState<number[]>(
    Array.from({ length: 100 }, () => 400)
  );
  const frameRate = 16;

  // 새로운 데이터를 계속 서버에서 받는다는 가정으로 데이터를 생성
  useEffect(() => {
    const interval = setInterval(() => {
      //랜덤 숫자를 생성
      const randomNum = Number(Math.random() * (380 - 420) + 420);
      setData({ value: randomNum });
    }, frameRate);
    return () => clearInterval(interval);
  }, []);

  //서버에서 새로운 데이터를 받으면, chart에서 사용할 수 있는 형태로 변경 
  useEffect(() => {
    // 현재 데이터배열 길이가 60 이하일 경우, 새롭게 추가
    if (parsedData.length < 60) {
      setParsedData((prev) => [...prev, data.value]);
    // 현재 데이터배열 길이가 60 이상일 경우 , 기존값을 제거 후 추가
    } else if(parsedData.length>=60) {
      setParsedData((prev) => {
        const [_beforeNum, ...others] = prev;
        return [...others, data.value];
      });
    }
  }, [data]);

  return (
    <div className="App">
      <Chart data={parsedData}></Chart>
    </div>
  );
}
