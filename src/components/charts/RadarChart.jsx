import React from 'react';

/**
 * SVG-based radar chart for skill visualization
 * No external dependencies required
 */
const RadarChart = ({
    data = [], // Array of { label: string, value: number (0-100) }
    size = 200,
    className = ''
}) => {
    if (!data.length) {
        return (
            <div className={`flex items-center justify-center text-brand-muted`} style={{ width: size, height: size }}>
                No data available
            </div>
        );
    }

    const center = size / 2;
    const radius = (size / 2) - 30; // Leave room for labels
    const angleStep = (2 * Math.PI) / data.length;

    // Generate points for each data value
    const getPoint = (index, value) => {
        const angle = (index * angleStep) - (Math.PI / 2); // Start from top
        const distance = (value / 100) * radius;
        return {
            x: center + Math.cos(angle) * distance,
            y: center + Math.sin(angle) * distance
        };
    };

    // Generate polygon points
    const polygonPoints = data
        .map((d, i) => {
            const point = getPoint(i, d.value);
            return `${point.x},${point.y}`;
        })
        .join(' ');

    // Generate grid circles
    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className={`relative ${className}`} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="overflow-visible">
                {/* Background circles */}
                {gridLevels.map((level) => (
                    <circle
                        key={level}
                        cx={center}
                        cy={center}
                        r={(level / 100) * radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                    />
                ))}

                {/* Axis lines */}
                {data.map((_, i) => {
                    const point = getPoint(i, 100);
                    return (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={point.x}
                            y2={point.y}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data polygon */}
                <polygon
                    points={polygonPoints}
                    fill="rgba(0, 180, 216, 0.3)"
                    stroke="#00b4d8"
                    strokeWidth="2"
                />

                {/* Data points */}
                {data.map((d, i) => {
                    const point = getPoint(i, d.value);
                    return (
                        <circle
                            key={i}
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill="#00b4d8"
                            className="transition-all hover:r-6"
                        />
                    );
                })}

                {/* Labels */}
                {data.map((d, i) => {
                    const point = getPoint(i, 120); // Place labels outside
                    return (
                        <text
                            key={i}
                            x={point.x}
                            y={point.y}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-brand-muted text-xs"
                        >
                            {d.label}
                        </text>
                    );
                })}
            </svg>

            {/* Center value */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <div className="text-2xl font-bold text-brand-text">
                        {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)}%
                    </div>
                    <div className="text-xs text-brand-muted">Overall</div>
                </div>
            </div>
        </div>
    );
};

export default RadarChart;
