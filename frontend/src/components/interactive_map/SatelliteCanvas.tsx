import React, { useRef, useCallback } from 'react';

interface UseSatelliteCanvasProps {
  onMapLoading: (loading: boolean) => void;
}

const useSatelliteCanvas = ({ onMapLoading }: UseSatelliteCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadTile = useCallback((
    tileX: number,
    tileY: number,
    zoom: number,
    drawX: number,
    drawY: number,
    ctx: CanvasRenderingContext2D
  ): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      const providers = [
        `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`,
        `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`,
      ];

      let providerIndex = 0;

      const tryLoadTile = () => {
        if (providerIndex >= providers.length) {
          ctx.fillStyle = "#f0f0f0";
          ctx.fillRect(drawX, drawY, 256, 256);
          ctx.fillStyle = "#999";
          ctx.font = "12px Arial";
          ctx.fillText("No Image", drawX + 110, drawY + 128);
          resolve();
          return;
        }

        const tileUrl = providers[providerIndex];
        img.src = tileUrl;

        img.onload = () => {
          try {
            ctx.drawImage(img, drawX, drawY);
            resolve();
          } catch (error) {
            providerIndex++;
            tryLoadTile();
          }
        };

        img.onerror = () => {
          providerIndex++;
          setTimeout(tryLoadTile, 100);
        };
      };

      tryLoadTile();
    });
  }, []);

  const drawSatelliteMap = useCallback(async (lat: number, lon: number) => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    onMapLoading(true);

    try {
      const zoom = 17;
      const tileSize = 256;
      const mapSize = 3;

      canvas.width = tileSize * mapSize;
      canvas.height = tileSize * mapSize;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerTileX = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
      const centerTileY = Math.floor(
        ((1 -
          Math.log(
            Math.tan((lat * Math.PI) / 180) +
              1 / Math.cos((lat * Math.PI) / 180)
          ) /
            Math.PI) /
          2) *
          Math.pow(2, zoom)
      );

      const tilePromises = [];
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          const tileX = centerTileX + x;
          const tileY = centerTileY + y;

          tilePromises.push(
            loadTile(
              tileX,
              tileY,
              zoom,
              (x + 1) * tileSize,
              (y + 1) * tileSize,
              ctx
            )
          );
        }
      }

      await Promise.all(tilePromises);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw location marker with shadow
      ctx.beginPath();
      ctx.arc(centerX + 2, centerY + 2, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fill();

      // Draw main marker
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#ff4444";
      ctx.fill();

      // Draw marker border
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw outer ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(255, 68, 68, 0.3)";
      ctx.lineWidth = 2;
      ctx.stroke();

    } catch (error) {
      throw error;
    } finally {
      onMapLoading(false);
    }
  }, [loadTile, onMapLoading]);

  return {
    canvasRef,
    drawSatelliteMap
  };
};

export default useSatelliteCanvas;