import { useCallback } from "react";

interface Props {
  files: File[];
  onChange: (files: File[]) => void;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function FileDropzone({ files, onChange }: Props) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const dropped = Array.from(e.dataTransfer.files).filter((f) =>
        ACCEPTED.includes(f.type)
      );
      if (dropped.length) onChange([...files, ...dropped]);
    },
    [files, onChange]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter((f) =>
      ACCEPTED.includes(f.type)
    );
    if (selected.length) onChange([...files, ...selected]);
    e.target.value = "";
  };

  const remove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <label
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-zinc-600 rounded-xl p-6 cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-colors"
      >
        <span className="text-3xl">🖼️</span>
        <p className="text-sm text-zinc-400 text-center">
          Arraste imagens aqui
          <br />
          <span className="text-violet-400">ou clique para selecionar</span>
        </p>
        <input
          type="file"
          multiple
          accept={ACCEPTED.join(",")}
          className="hidden"
          onChange={handleInput}
        />
      </label>

      {files.length > 0 && (
        <div className="flex flex-col gap-1 overflow-y-auto max-h-64">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2 text-sm"
            >
              <span className="truncate text-zinc-300 max-w-[160px]">
                {f.name}
              </span>
              <button
                onClick={() => remove(i)}
                className="text-zinc-500 hover:text-red-400 ml-2 shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
          <p className="text-xs text-zinc-500 text-center mt-1">
            {files.length} {files.length === 1 ? "imagem" : "imagens"}
          </p>
        </div>
      )}
    </div>
  );
}
