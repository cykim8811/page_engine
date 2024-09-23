import React, { useRef, useEffect, useState } from "react";

export interface CellData {
  x: number;
  y: number;
  width: number;
  height: number;
  value: any;
  isOnCreation?: boolean;
  id: number;
}

export interface CellProps {
  cellData: CellData;
  setCellData: (newData: CellData) => void;
  offset: { x: number; y: number };
  cellSize: number;
  selected?: boolean;
  onDeletion?: () => void;
}

const Cell: React.FC<CellProps> = ({
  cellData,
  setCellData,
  offset,
  cellSize,
  selected = false,
  onDeletion,
}) => {
  const cellRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState(cellData.width * cellSize);

  useEffect(() => {
    if (selected && cellRef.current) {
      cellRef.current.focus();
    }
    if (!selected && cellData.isOnCreation && cellData.value === "") {
      onDeletion && onDeletion();
    } else if (!selected && cellData.isOnCreation) {
      setCellData({ ...cellData, isOnCreation: false });
    }
  }, [selected, cellData, setCellData, onDeletion]);

  useEffect(() => {
    if (cellRef.current) {
      const textWidth = getTextWidth(
        cellData.value,
        getComputedStyle(cellRef.current).font
      );
      const newWidth = Math.max(cellSize, textWidth + 10); // 10px for padding
      setInputWidth(newWidth);

      const newCellWidth = Math.ceil(newWidth / cellSize);
      if (newCellWidth !== cellData.width) {
        setCellData({ ...cellData, width: newCellWidth });
      }
    }
  }, [cellData.value, cellSize, setCellData]);

  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    return 0;
  };

  return (
    <input
      ref={cellRef}
      className="border border-2 border-gray-500 px-1"
      style={{
        position: "absolute",
        left: cellData.x * cellSize + offset.x - 1,
        top: cellData.y * cellSize + offset.y - 1,
        width: cellData.width * cellSize + 2,
        height: cellData.height * cellSize + 2,
      }}
      value={cellData.value}
      onChange={(e) => setCellData({ ...cellData, value: e.target.value })}
    />
  );
};

export default Cell;
