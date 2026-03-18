export type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left";

export interface Config {
  position: Position;
  opacity: number;
  scale: number;
  margin: number;
  prefix: string;
  suffix: string;
}

interface Props {
  config: Config;
  onChange: (config: Config) => void;
}

const POSITIONS: { value: Position; label: string }[] = [
  { value: "top-left", label: "↖" },
  { value: "top-right", label: "↗" },
  { value: "bottom-left", label: "↙" },
  { value: "bottom-right", label: "↘" },
];

export default function ConfigPanel({ config, onChange }: Props) {
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    onChange({ ...config, [key]: value });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Posição
        </label>
        <div className="grid grid-cols-2 gap-1 w-fit">
          {POSITIONS.map((p) => (
            <button
              key={p.value}
              onClick={() => set("position", p.value)}
              className={`w-10 h-10 rounded-lg text-lg transition-colors ${
                config.position === p.value
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <Slider
        label="Opacidade"
        value={config.opacity}
        min={0.1}
        max={1}
        step={0.05}
        display={`${Math.round(config.opacity * 100)}%`}
        onChange={(v) => set("opacity", v)}
      />

      <Slider
        label="Tamanho"
        value={config.scale}
        min={0.05}
        max={0.5}
        step={0.01}
        display={`${Math.round(config.scale * 100)}%`}
        onChange={(v) => set("scale", v)}
      />

      <Slider
        label="Margem"
        value={config.margin}
        min={0}
        max={100}
        step={1}
        display={`${config.margin}px`}
        onChange={(v) => set("margin", v)}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Nome do arquivo
        </label>
        <div className="flex items-center gap-1 text-sm">
          <input
            type="text"
            placeholder="prefixo_"
            value={config.prefix}
            onChange={(e) => set("prefix", e.target.value)}
            className="w-24 bg-zinc-800 rounded-lg px-2 py-1.5 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
          <span className="text-zinc-500 shrink-0">nome</span>
          <input
            type="text"
            placeholder="_sufixo"
            value={config.suffix}
            onChange={(e) => set("suffix", e.target.value)}
            className="w-24 bg-zinc-800 rounded-lg px-2 py-1.5 text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        {(config.prefix || config.suffix) && (
          <p className="text-xs text-zinc-500 font-mono">
            ex: {config.prefix || ""}foto.jpg{config.suffix || ""}
          </p>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          {label}
        </label>
        <span className="text-xs text-violet-400 font-mono">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-violet-500"
      />
    </div>
  );
}
