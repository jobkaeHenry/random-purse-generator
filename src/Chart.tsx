import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  gridColor?: CanvasFillStrokeStyles["strokeStyle"];
  lineColor?: CanvasFillStrokeStyles["strokeStyle"];
  backgroundColor?: CanvasFillStrokeStyles["fillStyle"];
  defaultMagnificationLevel?:number
}
export const Chart = ({
  data,
  width = 700,
  height = 200,
  gridColor = "#555",
  lineColor = "rgb(69, 234, 221)",
  backgroundColor = "#555",
  defaultMagnificationLevel=3
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<null | CanvasRenderingContext2D>(null);
  const [magnifyLevel, setMagnifyLevel] = useState<number>(defaultMagnificationLevel);

  const memoiedArr = useMemo(() => data, [data]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = width;
      canvas.height = height;
      setCtx(ctx);
    }
  }, []);

  // 마우스 휠을 굴릴 시 증폭레벨을 올리는 함수
  const onWheelHandler = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (e.deltaY < 0 && magnifyLevel <= 10) {
      setMagnifyLevel((prev) => prev + 1);
    } else if (e.deltaY > 0 && magnifyLevel >= 2) {
      setMagnifyLevel((prev) => prev - 1);
    }
  };

  const getPositionX = (index: number) => (width / 100) * index
  const getPositionY = (val: number) => ((val - 400) / 5) * magnifyLevel + 100;

  const drawLine = (ctx: CanvasRenderingContext2D, dataArr: number[]) => {
    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = gridColor;
    ctx.strokeRect(0, height / 3, width, height / 3);
    ctx.strokeRect(width / 3, 0, width / 3, height);

    ctx.beginPath();
    ctx.moveTo(0, getPositionY(dataArr[1]));

    dataArr.forEach((e, i) => {
      ctx?.lineTo(getPositionX(i + 1), getPositionY(e));
    });

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  useEffect(() => {
    if (ctx) {
      drawLine(ctx, memoiedArr);
      ctx.font = "24px Comic Sans MS";
      ctx.textAlign = "left";
      ctx.fillStyle = backgroundColor;
      ctx.fillText(`증폭레벨 : ${magnifyLevel}`, 10, height - 10);
    }
  }, [memoiedArr, magnifyLevel]);

  return (
    <canvas
      onWheel={onWheelHandler}
      ref={canvasRef}
      style={{ border: "3px solid " }}
    />
  );
};
