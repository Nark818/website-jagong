type Bar = { label: string; value: number };
type SegmentDef = { key: string; label: string; color: string };
type StackedCategory = { label: string; segments: { key: string; value: number }[] };

function niceTicks(max: number, tickCount = 4) {
  if (max <= 0) return { ticks: [0, 1], niceMax: 1 };
  const rawStep = max / tickCount;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const residual = rawStep / magnitude;
  const step =
    (residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10) *
    magnitude;
  const niceMax = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  for (let t = 0; t <= niceMax + 1e-9; t += step) ticks.push(Math.round(t));
  return { ticks, niceMax };
}

function topRoundedPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, Math.max(h, 0));
  if (h <= 0) return "";
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

function rightRoundedPath(x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h / 2, Math.max(w, 0));
  if (w <= 0) return "";
  return `M${x},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h - rr} Q${x + w},${y + h} ${x + w - rr},${y + h} L${x},${y + h} Z`;
}

const fmt = (n: number) => n.toLocaleString("id-ID");

/** Single-series column chart — for comparing magnitude across a handful of categories. */
export function BarChart({
  data,
  color,
  height = 240,
  unit = "",
}: {
  data: Bar[];
  color: string;
  height?: number;
  unit?: string;
}) {
  const width = 480;
  const marginLeft = 44;
  const marginRight = 12;
  const marginTop = 28;
  const marginBottom = 28;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;
  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const { ticks, niceMax } = niceTicks(maxValue);
  const y = (v: number) => marginTop + plotH - (v / niceMax) * plotH;
  const bandWidth = plotW / data.length;
  const barWidth = Math.min(24, bandWidth * 0.5);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Diagram batang"
    >
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={marginLeft}
            x2={width - marginRight}
            y1={y(t)}
            y2={y(t)}
            className="stroke-border-default"
            strokeWidth={1}
          />
          <text
            x={marginLeft - 8}
            y={y(t)}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-text-muted font-mono"
            fontSize={10}
          >
            {fmt(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = marginLeft + bandWidth * i + bandWidth / 2;
        const yTop = y(d.value);
        const barH = marginTop + plotH - yTop;
        return (
          <g key={d.label}>
            <path
              d={topRoundedPath(cx - barWidth / 2, yTop, barWidth, barH, 4)}
              fill={color}
              className="transition-opacity duration-150 hover:opacity-80"
            >
              <title>{`${d.label}: ${fmt(d.value)}${unit}`}</title>
            </path>
            <text
              x={cx}
              y={yTop - 8}
              textAnchor="middle"
              className="fill-text-primary font-mono font-semibold"
              fontSize={11}
            >
              {fmt(d.value)}
            </text>
            <text
              x={cx}
              y={height - marginBottom + 16}
              textAnchor="middle"
              className="fill-text-secondary"
              fontSize={11}
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <line
        x1={marginLeft}
        x2={width - marginRight}
        y1={marginTop + plotH}
        y2={marginTop + plotH}
        className="stroke-border-default"
        strokeWidth={1.5}
      />
    </svg>
  );
}

/** Horizontal bar chart — same job as BarChart, better fit for short label lists. */
export function HorizontalBarChart({
  data,
  color,
  unit = "",
}: {
  data: Bar[];
  color: string;
  unit?: string;
}) {
  const width = 480;
  const marginLeft = 64;
  const marginRight = 44;
  const marginTop = 8;
  const marginBottom = 8;
  const rowHeight = 40;
  const barHeight = 20;
  const plotW = width - marginLeft - marginRight;
  const height = marginTop + marginBottom + data.length * rowHeight;
  const maxValue = Math.max(...data.map((d) => d.value), 0);
  const { niceMax } = niceTicks(maxValue);
  const x = (v: number) => (v / niceMax) * plotW;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Diagram batang horizontal"
    >
      <line
        x1={marginLeft}
        x2={marginLeft}
        y1={marginTop}
        y2={height - marginBottom}
        className="stroke-border-default"
        strokeWidth={1.5}
      />
      {data.map((d, i) => {
        const cy = marginTop + rowHeight * i + rowHeight / 2;
        const w = x(d.value);
        return (
          <g key={d.label}>
            <text
              x={marginLeft - 8}
              y={cy}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-text-secondary"
              fontSize={12}
            >
              {d.label}
            </text>
            <path
              d={rightRoundedPath(marginLeft, cy - barHeight / 2, Math.max(w, 4), barHeight, 4)}
              fill={color}
              className="transition-opacity duration-150 hover:opacity-80"
            >
              <title>{`${d.label}: ${fmt(d.value)}${unit}`}</title>
            </path>
            <text
              x={marginLeft + w + 8}
              y={cy}
              dominantBaseline="middle"
              className="fill-text-primary font-mono font-semibold"
              fontSize={12}
            >
              {fmt(d.value)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Stacked column chart — for part-to-whole comparisons across categories. */
export function StackedBarChart({
  data,
  segments,
  height = 240,
}: {
  data: StackedCategory[];
  segments: SegmentDef[];
  height?: number;
}) {
  const width = 480;
  const marginLeft = 48;
  const marginRight = 12;
  const marginTop = 28;
  const marginBottom = 28;
  const plotW = width - marginLeft - marginRight;
  const plotH = height - marginTop - marginBottom;
  const totals = data.map((d) => d.segments.reduce((s, seg) => s + seg.value, 0));
  const maxTotal = Math.max(...totals, 0);
  const { ticks, niceMax } = niceTicks(maxTotal);
  const y = (v: number) => marginTop + plotH - (v / niceMax) * plotH;
  const bandWidth = plotW / data.length;
  const barWidth = Math.min(40, bandWidth * 0.5);

  return (
    <div className="flex flex-col gap-4">
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Diagram batang bertumpuk"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={marginLeft}
              x2={width - marginRight}
              y1={y(t)}
              y2={y(t)}
              className="stroke-border-default"
              strokeWidth={1}
            />
            <text
              x={marginLeft - 8}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-text-muted font-mono"
              fontSize={10}
            >
              {fmt(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = marginLeft + bandWidth * i + bandWidth / 2;
          const total = d.segments.reduce((s, seg) => s + seg.value, 0);
          let cursor = 0;
          const pieces = d.segments.map((seg, si) => {
            const bottomValue = cursor;
            const topValue = cursor + seg.value;
            const isFirst = si === 0;
            const isLast = si === d.segments.length - 1;
            let yTop = y(topValue);
            let yBottom = y(bottomValue);
            if (!isLast) yTop += 1;
            if (!isFirst) yBottom -= 1;
            const segH = Math.max(yBottom - yTop, 0);
            cursor = topValue;
            const def = segments.find((s) => s.key === seg.key)!;
            const d2 = isLast
              ? topRoundedPath(cx - barWidth / 2, yTop, barWidth, segH, 4)
              : `M${cx - barWidth / 2},${yTop} h${barWidth} v${segH} h${-barWidth} Z`;
            return { key: seg.key, value: seg.value, def, d: d2 };
          });
          return (
            <g key={d.label}>
              {pieces.map((p) => (
                <path
                  key={p.key}
                  d={p.d}
                  fill={p.def.color}
                  className="transition-opacity duration-150 hover:opacity-80"
                >
                  <title>{`${d.label} — ${p.def.label}: ${fmt(p.value)}`}</title>
                </path>
              ))}
              <text
                x={cx}
                y={y(total) - 8}
                textAnchor="middle"
                className="fill-text-primary font-mono font-semibold"
                fontSize={11}
              >
                {fmt(total)}
              </text>
              <text
                x={cx}
                y={height - marginBottom + 16}
                textAnchor="middle"
                className="fill-text-secondary"
                fontSize={11}
              >
                {d.label}
              </text>
            </g>
          );
        })}
        <line
          x1={marginLeft}
          x2={width - marginRight}
          y1={marginTop + plotH}
          y2={marginTop + plotH}
          className="stroke-border-default"
          strokeWidth={1.5}
        />
      </svg>
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
        {segments.map((s) => (
          <li key={s.key} className="flex items-center gap-2.5 text-sm">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-text-secondary">{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
