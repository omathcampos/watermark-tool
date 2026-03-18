import type { Config } from "./components/ConfigPanel";

export async function processImage(
  imageFile: File,
  watermarkFile: File,
  config: Config
): Promise<Blob> {
  const [baseImg, wmImg] = await Promise.all([
    loadImage(imageFile),
    loadImage(watermarkFile),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = baseImg.naturalWidth;
  canvas.height = baseImg.naturalHeight;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(baseImg, 0, 0);

  const wmWidth = Math.round(canvas.width * config.scale);
  const wmHeight = Math.round(wmImg.naturalHeight * (wmWidth / wmImg.naturalWidth));
  const margin = config.margin;

  let x = 0, y = 0;
  if (config.position === "top-left")     { x = margin; y = margin; }
  if (config.position === "top-right")    { x = canvas.width - wmWidth - margin; y = margin; }
  if (config.position === "bottom-left")  { x = margin; y = canvas.height - wmHeight - margin; }
  if (config.position === "bottom-right") { x = canvas.width - wmWidth - margin; y = canvas.height - wmHeight - margin; }

  ctx.globalAlpha = config.opacity;
  ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
  ctx.globalAlpha = 1;

  const isJpeg = imageFile.type === "image/jpeg";
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b!), isJpeg ? "image/jpeg" : "image/png", isJpeg ? 0.95 : undefined)
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}
