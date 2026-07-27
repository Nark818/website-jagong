type Segment = { label: string; value: number; color: string };

export function DonutChart({
  data,
  size = 168,
  thickness = 24,
}: {
  data: Segment[];
  size?: number;
  thickness?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let acc = 0;

  return (
    <div className="flex flex-wrap items-center gap-8">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 shrink-0"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border-default)"
          strokeWidth={thickness}
        />
        {data.map((d) => {
          const frac = total > 0 ? d.value / total : 0;
          const dash = frac * circumference;
          const strokeDashoffset = -acc;
          acc += dash;
          return (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={strokeDashoffset}
            />
          );
        })}
      </svg>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-text-secondary">{d.label}</span>
            <span className="font-mono font-semibold text-text-primary">
              {total > 0
                ? ((d.value / total) * 100).toFixed(1).replace(".", ",")
                : "0"}
              %
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RadialProgress({
  value,
  size = 100,
  thickness = 10,
  color,
  label,
}: {
  value: number;
  size?: number;
  thickness?: number;
  color: string;
  label: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(value, 0), 100);
  const dash = (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-border-default)"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute font-mono text-lg font-semibold text-text-primary">
          {clamped.toFixed(2).replace(".", ",")}%
        </span>
      </div>
      <span className="max-w-[16ch] text-[13px] leading-snug text-text-secondary">
        {label}
      </span>
    </div>
  );
}
