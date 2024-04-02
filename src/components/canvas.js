"use client";

import React, { useRef, useEffect, useState } from "react";

const DrawableArea = ({ width, height }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [selectedBrush, setSelectedBrush] = useState("normal");
  const [gradientStartColor, setGradientStartColor] = useState("#FF0000");
  const [gradientEndColor, setGradientEndColor] = useState("#00FF00");

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
  }, [width, height]);

  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = event.nativeEvent;

    if (isErasing) {
      context.clearRect(
        offsetX - brushSize / 2,
        offsetY - brushSize / 2,
        brushSize,
        brushSize
      );
    } else {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      context.lineWidth = brushSize;
    }
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = event.nativeEvent;

    if (isErasing) {
      context.clearRect(
        offsetX - brushSize / 2,
        offsetY - brushSize / 2,
        brushSize,
        brushSize
      );
    } else {
      context.lineTo(offsetX, offsetY);
      if (selectedBrush === "normal") {
        context.strokeStyle = selectedColor;
      } else if (selectedBrush === "gradient") {
        const gradient = context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, gradientStartColor);
        gradient.addColorStop(1, gradientEndColor);
        context.strokeStyle = gradient;
      }
      context.lineWidth = brushSize;
      context.stroke();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const toggleEraser = () => {
    setIsErasing(!isErasing);
  };

  const resetArea = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleGradientStartColorChange = (color) => {
    setGradientStartColor(color);
  };

  const handleGradientEndColorChange = (color) => {
    setGradientEndColor(color);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "Desenho.png";
    link.href = url;
    link.click();
  };

  const fillArea = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = selectedColor;
    context.fillRect(0, 0, width, height);
  };

  const handleBrushSizeChange = (event) => {
    setBrushSize(parseInt(event.target.value));
  };

  const handleBrushChange = (brushType) => {
    setSelectedBrush(brushType);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "75vw",
          display: "flex",
          justifyContent: "space-between",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <button onClick={toggleEraser} className={isErasing ? "active" : ""}>
            {isErasing ? "Pincel" : "Borracha"}
          </button>
          <button onClick={resetArea}>Limpar</button>
          <button onClick={fillArea}>Pintar fundo</button>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={handleBrushSizeChange}
          />
        </div>
        <div>
          <button onClick={downloadDrawing}>Baixar Desenho</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <div>
          <span>Cor:</span>
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
        <div>
          <span>Gradiente:</span>
          <input
            type="color"
            value={gradientStartColor}
            onChange={(e) => handleGradientStartColorChange(e.target.value)}
          />
          <input
            type="color"
            value={gradientEndColor}
            onChange={(e) => handleGradientEndColorChange(e.target.value)}
          />
        </div>
      </div>
      <div>
        <span>Pincel:</span>
        <button
          onClick={() => handleBrushChange("normal")}
          className={selectedBrush === "normal" ? "active" : ""}
        >
          Normal
        </button>
        <button
          onClick={() => handleBrushChange("gradient")}
          className={selectedBrush === "gradient" ? "active" : ""}
        >
          Gradiente
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{
          border: "1px solid black",
          cursor: isErasing ? "cell" : "crosshair",
        }}
      />
    </div>
  );
};

export default DrawableArea;
