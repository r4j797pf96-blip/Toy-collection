import { RGB, Shape, ShapePrimitive } from "./types";

function rgbToHex([r, g, b]: RGB): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const GAP_RATIO = 0.12;

export function renderToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  shapes: Shape[],
  palette: RGB[],
  background: RGB,
  shape: ShapePrimitive,
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = rgbToHex(background);
  ctx.fillRect(0, 0, width, height);

  for (const s of shapes) {
    ctx.fillStyle = rgbToHex(palette[s.colorIndex] ?? [0, 0, 0]);
    drawShapeOnCanvas(ctx, s, shape);
  }
}

function drawShapeOnCanvas(ctx: CanvasRenderingContext2D, s: Shape, shape: ShapePrimitive): void {
  const w = s.w * (1 - GAP_RATIO);
  const h = s.h * (1 - GAP_RATIO);
  const x = s.cx - w / 2;
  const y = s.cy - h / 2;

  switch (shape) {
    case "circle": {
      const r = Math.min(w, h) / 2;
      if (w === h) {
        ctx.beginPath();
        ctx.arc(s.cx, s.cy, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        drawRoundedRect(ctx, x, y, w, h, Math.min(w, h) / 2);
      }
      break;
    }
    case "capsule":
      drawRoundedRect(ctx, x, y, w, h, Math.min(w, h) / 2);
      break;
    case "square":
      ctx.fillRect(x, y, w, h);
      break;
    case "line":
      if (w >= h) {
        ctx.fillRect(x, s.cy - h * 0.18, w, h * 0.36);
      } else {
        ctx.fillRect(s.cx - w * 0.18, y, w * 0.36, h);
      }
      break;
  }
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fill();
}

export function renderToSvg(
  width: number,
  height: number,
  shapes: Shape[],
  palette: RGB[],
  background: RGB,
  shape: ShapePrimitive,
): string {
  const elements = shapes.map((s) => shapeToSvgElement(s, palette, shape)).join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${rgbToHex(background)}" />
  ${elements}
</svg>`;
}

function shapeToSvgElement(s: Shape, palette: RGB[], shape: ShapePrimitive): string {
  const fill = rgbToHex(palette[s.colorIndex] ?? [0, 0, 0]);
  const w = s.w * (1 - GAP_RATIO);
  const h = s.h * (1 - GAP_RATIO);
  const x = s.cx - w / 2;
  const y = s.cy - h / 2;

  switch (shape) {
    case "circle":
      if (w === h) {
        return `<circle cx="${s.cx}" cy="${s.cy}" r="${(Math.min(w, h) / 2).toFixed(2)}" fill="${fill}" />`;
      }
      return roundedRectSvg(x, y, w, h, Math.min(w, h) / 2, fill);
    case "capsule":
      return roundedRectSvg(x, y, w, h, Math.min(w, h) / 2, fill);
    case "square":
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" fill="${fill}" />`;
    case "line":
      if (w >= h) {
        return `<rect x="${x.toFixed(2)}" y="${(s.cy - h * 0.18).toFixed(2)}" width="${w.toFixed(2)}" height="${(h * 0.36).toFixed(2)}" fill="${fill}" />`;
      }
      return `<rect x="${(s.cx - w * 0.18).toFixed(2)}" y="${y.toFixed(2)}" width="${(w * 0.36).toFixed(2)}" height="${h.toFixed(2)}" fill="${fill}" />`;
  }
}

function roundedRectSvg(x: number, y: number, w: number, h: number, r: number, fill: string): string {
  const radius = Math.min(r, w / 2, h / 2);
  return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" rx="${radius.toFixed(2)}" ry="${radius.toFixed(2)}" fill="${fill}" />`;
}
