import React from 'react';

/**
 * Simple bar/line chart using CSS
 * No external dependencies required
 */
const ProgressChart = ({
    data = [],
    type = 'bar', // 'bar' or 'line'
    height = 200,
    showLabels = true,
    showValues = true,
    color = 'brand-primary',
    className = ''
}) => {
    if (!data.length) {
        return (
            <div className={`h-[${height}px] flex items-center justify-center text-brand-muted`}>
                No data available
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value), 1);


    return (
        <div className={`${className}`}>
            <div
                className="flex items-end justify-between gap-1"
                style={{ height: `${height}px` }}
            >
                {data.map((item, index) => {
                    const heightPercent = (item.value / maxValue) * 100;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                            {/* Value tooltip */}
                            {showValues && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-xs text-brand-muted">
                                    {item.value}
                                </div>
                            )}

                            {/* Bar */}
                            <div
                                className="w-full relative group"
                                style={{ height: `${height - 30}px` }}
                            >
                                {type === 'bar' ? (
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 rounded-t transition-all duration-300 hover:opacity-80 ${color === 'brand-primary' ? 'bg-brand-primary' :
                                            color === 'brand-secondary' ? 'bg-brand-secondary' :
                                                color === 'green' ? 'bg-green-500' : 'bg-brand-primary'
                                            }`}
                                        style={{
                                            height: `${heightPercent}%`,
                                            minHeight: item.value > 0 ? '4px' : '0'
                                        }}
                                    />
                                ) : (
                                    <div
                                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${color === 'brand-primary' ? 'bg-brand-primary' :
                                            color === 'brand-secondary' ? 'bg-brand-secondary' :
                                                color === 'green' ? 'bg-green-500' : 'bg-brand-primary'
                                            }`}
                                        style={{ bottom: `${heightPercent}%` }}
                                    />
                                )}
                            </div>

                            {/* Label */}
                            {showLabels && (
                                <div className="text-xs text-brand-muted mt-2 truncate w-full text-center">
                                    {item.label}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressChart;
