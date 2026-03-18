import { useEffect, useRef, useState } from "react";
import type { Config } from "./ConfigPanel";

interface Props {
  image: File | null;
  watermark: File | null;
  config: Config;
}

export default function Preview({ image, watermark, config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!image || !watermark) return;
    setError(null);

    const imgUrl = URL.createObjectURL(image);
    const wmUrl = URL.createObjectURL(watermark);

    const baseImg = new Image();
    const wmImg = new Image();

    let loaded = 0;
    const onLoad = () => {
      loaded++;
      if (loaded < 2) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const MAX = 600;
      const ratio = Math.min(MAX / baseImg.naturalWidth, MAX / baseImg.naturalHeight, 1);
      canvas.width = baseImg.naturalWidth * ratio;
      canvas.height = baseImg.naturalHeight * ratio;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Watermark size
      const wmWidth = canvas.width * config.scale;
      const wmHeight = (wmImg.naturalHeight / wmImg.naturalWidth) * wmWidth;
      const margin = config.margin * ratio;

      let x = 0, y = 0;
      if (config.position === "top-left") { x = margin; y = margin; }
      if (config.position === "top-right") { x = canvas.width - wmWidth - margin; y = margin; }
      if (config.position === "bottom-left") { x = margin; y = canvas.height - wmHeight - margin; }
      if (config.position === "bottom-right") { x = canvas.width - wmWidth - margin; y = canvas.height - wmHeight - margin; }

      ctx.globalAlpha = config.opacity;
      ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
      ctx.globalAlpha = 1;

      URL.revokeObjectURL(imgUrl);
      URL.revokeObjectURL(wmUrl);
    };

    baseImg.onerror = () => setError("Erro ao carregar imagem base");
    wmImg.onerror = () => setError("Erro ao carregar marca d'água");
    baseImg.onload = onLoad;
    wmImg.onload = onLoad;
    baseImg.src = imgUrl;
    wmImg.src = wmUrl;
  }, [image, watermark, config]);

  if (!image || !watermark) {
    return (
      <div className="flex items-center justify-center h-full min-h-48 bg-zinc-800/50 rounded-xl border border-dashed border-zinc-700">
        <p className="text-zinc-500 text-sm text-center px-4">
          {!image ? "Adicione imagens para ver o preview" : "Selecione uma marca d'água"}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-48 bg-zinc-800/50 rounded-xl">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Preview
      </label>
      <div className="rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
}
