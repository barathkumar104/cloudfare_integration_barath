interface TemperatureChartProps {
  labels: string[];
  maxTemps: number[];
  minTemps: number[];
}

function buildPath(values: number[], width: number, height: number, min: number, max: number): string {
  const xStep = values.length > 1 ? width / (values.length - 1) : width;
  const span = Math.max(1, max - min);

  return values
    .map((value, index) => {
      const x = index * xStep;
      const y = height - ((value - min) / span) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function TemperatureChart({ labels, maxTemps, minTemps }: TemperatureChartProps) {
  const width = 620;
  const height = 180;
  const allTemps = [...maxTemps, ...minTemps];
  const globalMin = Math.min(...allTemps) - 2;
  const globalMax = Math.max(...allTemps) + 2;

  const maxPath = buildPath(maxTemps, width, height, globalMin, globalMax);
  const minPath = buildPath(minTemps, width, height, globalMin, globalMax);

  return (
    <div className="chart-card">
      <h3>7-Day Temperature Trend</h3>
      <svg viewBox={`0 0 ${width} ${height + 40}`} role="img" aria-label="Temperature trend chart">
        <path d={minPath} className="line line-min" />
        <path d={maxPath} className="line line-max" />

        {labels.map((label, index) => {
          const x = labels.length > 1 ? (index * width) / (labels.length - 1) : 0;
          return (
            <text key={label} x={x} y={height + 24} textAnchor="middle" className="tick-label">
              {label.slice(5)}
            </text>
          );
        })}
      </svg>
      <div className="chart-legend">
        <span><i className="dot max" /> Max Temp</span>
        <span><i className="dot min" /> Min Temp</span>
      </div>
    </div>
  );
}
