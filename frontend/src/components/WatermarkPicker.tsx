interface Props {
  watermark: File | null;
  onChange: (file: File | null) => void;
}

export default function WatermarkPicker({ watermark, onChange }: Props) {
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        Marca d'água
      </label>
      <label className="flex items-center gap-3 bg-zinc-800 rounded-xl px-4 py-3 cursor-pointer hover:bg-zinc-700 transition-colors">
        <span className="text-xl">💧</span>
        <div className="flex-1 min-w-0">
          {watermark ? (
            <span className="text-sm text-violet-300 truncate block">
              {watermark.name}
            </span>
          ) : (
            <span className="text-sm text-zinc-400">Selecionar imagem...</span>
          )}
        </div>
        {watermark && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onChange(null);
            }}
            className="text-zinc-500 hover:text-red-400 shrink-0"
          >
            ✕
          </button>
        )}
        <input
          type="file"
          accept="image/png,image/webp,image/jpeg"
          className="hidden"
          onChange={handleInput}
        />
      </label>
      <p className="text-xs text-zinc-500">
        PNG com transparência recomendado
      </p>
    </div>
  );
}
