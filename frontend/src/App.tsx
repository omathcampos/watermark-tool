import { useState } from "react";
import JSZip from "jszip";
import FileDropzone from "./components/FileDropzone";
import WatermarkPicker from "./components/WatermarkPicker";
import ConfigPanel, { type Config } from "./components/ConfigPanel";
import Preview from "./components/Preview";
import { processImage } from "./processImage";

const DEFAULT_CONFIG: Config = {
  position: "bottom-right",
  opacity: 0.8,
  scale: 0.2,
  margin: 20,
};

type Status = "idle" | "processing" | "done" | "error";

export default function App() {
  const [images, setImages] = useState<File[]>([]);
  const [watermark, setWatermark] = useState<File | null>(null);
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canProcess = images.length > 0 && watermark !== null;

  const handleProcess = async () => {
    if (!canProcess) return;

    setStatus("processing");
    setProgress(0);
    setErrorMsg(null);

    try {
      const zip = new JSZip();

      for (let i = 0; i < images.length; i++) {
        const blob = await processImage(images[i], watermark!, config);
        const isJpeg = images[i].type === "image/jpeg";
        const baseName = images[i].name.replace(/\.[^.]+$/, "");
        zip.file(`${baseName}.${isJpeg ? "jpg" : "png"}`, blob);
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "watermarked.zip";
      a.click();
      URL.revokeObjectURL(url);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">💧</span>
        <h1 className="text-lg font-semibold">Watermark Tool</h1>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Left panel */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Imagens
            </label>
            <FileDropzone files={images} onChange={setImages} />
          </div>

          <WatermarkPicker watermark={watermark} onChange={setWatermark} />
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-6">
          <Preview image={images[0] ?? null} watermark={watermark} config={config} />

          <ConfigPanel config={config} onChange={setConfig} />

          <div className="flex flex-col gap-2">
            <button
              onClick={handleProcess}
              disabled={!canProcess || status === "processing"}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                canProcess && status !== "processing"
                  ? "bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }`}
            >
              {status === "processing"
                ? "Processando..."
                : status === "done"
                ? "✓ Download iniciado!"
                : `Processar ${images.length > 0 ? `${images.length} ` : ""}imagen${images.length !== 1 ? "s" : ""}`}
            </button>

            {status === "processing" && (
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div
                  className="bg-violet-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {status === "error" && errorMsg && (
              <p className="text-red-400 text-sm text-center">{errorMsg}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
