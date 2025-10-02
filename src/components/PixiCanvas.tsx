'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface PixiCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function PixiCanvas({ 
  width = 800, 
  height = 600, 
  className = '' 
}: PixiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Create PIXI application
    const app = new PIXI.Application();
    
    const initPixi = async () => {
      await app.init({
        canvas: canvasRef.current!,
        width,
        height,
        backgroundColor: 0x1099bb,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      // Create a simple rectangle
      const rectangle = new PIXI.Graphics();
      rectangle.rect(0, 0, 100, 100);
      rectangle.fill(0xff0000);
      rectangle.x = width / 2 - 50;
      rectangle.y = height / 2 - 50;
      app.stage.addChild(rectangle);

      // Add some text
      const text = new PIXI.Text({
        text: 'PixiJS is working!',
        style: {
          fontFamily: 'Arial',
          fontSize: 24,
          fill: 0xffffff,
          align: 'center',
        },
      });
      text.x = width / 2 - text.width / 2;
      text.y = height / 2 + 60;
      app.stage.addChild(text);

      // Add animation
      let time = 0;
      app.ticker.add(() => {
        time += 0.01;
        rectangle.rotation = time;
        rectangle.x = width / 2 - 50 + Math.sin(time) * 50;
        rectangle.y = height / 2 - 50 + Math.cos(time) * 50;
      });

      appRef.current = app;
    };

    initPixi();

    // Cleanup
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [width, height]);

  return (
    <div className={`flex justify-center ${className}`}>
      <canvas ref={canvasRef} />
    </div>
  );
}
