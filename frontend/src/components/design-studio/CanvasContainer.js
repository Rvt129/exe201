import React from "react";

function CanvasContainer({ canvasRef }) {
  return (
    <div className="canvas-inner">
      <div className="design-instructions">
        <i className="fas fa-info-circle"></i>
        <span>Thiết kế của bạn sẽ xuất hiện trong khung màu xanh trên áo</span>
      </div>
      <canvas ref={canvasRef} id="canvas" className="design-canvas" />
    </div>
  );
}

export default CanvasContainer;
