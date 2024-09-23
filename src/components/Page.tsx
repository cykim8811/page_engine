import React, { useCallback, useState } from "react";
import { useDraggableBackground } from "../hooks/useDraggableBackground";
import "../styles/Page.css";
import Cell, { CellData } from "./Cell";

const Page: React.FC = () => {
  const { offset: dragOffset, ref } = useDraggableBackground();
  const [cellSize, setCellSize] = useState<number>(32);
  const offset = {
    x: Math.round(dragOffset.x / cellSize) * cellSize,
    y: Math.round(dragOffset.y / cellSize) * cellSize,
  };

  const [cellData, setCellData] = useState<{ [key: number]: CellData }>({});
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const x = Math.floor((e.clientX - offset.x) / cellSize);
      const y = Math.floor((e.clientY - offset.y) / cellSize);

      const index = Object.values(cellData).findIndex(
        (cell) =>
          x >= cell.x &&
          x < cell.x + cell.width &&
          y >= cell.y &&
          y < cell.y + cell.height
      );

      if (index !== -1) {
        setSelectedCell(index);
        return;
      }

      setCellData((prev) => {
        const next = { ...prev };
        const id = Date.now();
        next[id] = {
          x,
          y,
          width: 1,
          height: 1,
          value: "",
          isOnCreation: true,
          id,
        };
        setSelectedCell(id);
        return next;
      });
    },
    [offset, cellSize]
  );

  return (
    <div
      className="page-bg w-full h-full bg-white cursor-text"
      ref={ref}
      style={{
        backgroundPositionX: offset.x - 1,
        backgroundPositionY: offset.y - 1,
      }}
      onClick={handleClick}
    >
      {cellData &&
        Object.values(cellData).map((cell) => (
          <Cell
            key={cell.id}
            cellData={cell}
            setCellData={(newData) => {
              setCellData((prev) => {
                const next = { ...prev };
                next[cell.id] = newData;
                return next;
              });
            }}
            offset={offset}
            cellSize={cellSize}
            selected={cell.id === selectedCell}
            onDeletion={() => {
              setCellData((prev) => {
                const next = { ...prev };
                delete next[cell.id];
                return next;
              });
              setSelectedCell(null);
            }}
          />
        ))}
    </div>
  );
};

export default Page;
