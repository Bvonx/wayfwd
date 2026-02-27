import React from 'react';

/**
 * GitHub-style activity/streak calendar
 * Shows learning activity over the past weeks
 */
const StreakCalendar = ({
    data = [], // Array of { date: 'YYYY-MM-DD', minutes: number }
    weeks = 12,
    className = ''
}) => {
    // Generate the grid of days for the past N weeks
    const today = new Date();
    const days = [];

    // Calculate start date (N weeks ago, starting from Sunday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7) + (7 - today.getDay()));

    for (let i = 0; i < weeks * 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        const dateStr = date.toISOString().split('T')[0];
        const dayData = data.find(d => d.date === dateStr);

        if (date <= today) {
            days.push({
                date: dateStr,
                dayOfWeek: date.getDay(),
                minutes: dayData?.minutes || 0
            });
        }
    }

    // Organize into weeks
    const weeksArray = [];
    for (let w = 0; w < weeks; w++) {
        const weekDays = days.slice(w * 7, (w + 1) * 7);
        if (weekDays.length > 0) {
            weeksArray.push(weekDays);
        }
    }

    // Get intensity level (0-4)
    const getIntensity = (minutes) => {
        if (minutes === 0) return 0;
        if (minutes < 15) return 1;
        if (minutes < 30) return 2;
        if (minutes < 60) return 3;
        return 4;
    };

    const intensityColors = [
        'bg-white/5',
        'bg-brand-primary/20',
        'bg-brand-primary/40',
        'bg-brand-primary/60',
        'bg-brand-primary'
    ];

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className={className}>
            <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-2">
                    {dayLabels.map((label, i) => (
                        <div
                            key={label}
                            className="h-3 text-xs text-brand-muted flex items-center"
                            style={{ fontSize: '10px' }}
                        >
                            {i % 2 === 1 ? label : ''}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                {weeksArray.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day) => (
                            <div
                                key={day.date}
                                className={`w-3 h-3 rounded-sm transition-all hover:ring-1 hover:ring-white/30 cursor-pointer ${intensityColors[getIntensity(day.minutes)]
                                    }`}
                                title={`${day.date}: ${day.minutes} minutes`}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 text-xs text-brand-muted">
                <span>Less</span>
                {intensityColors.map((color, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${color}`}
                    />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

export default StreakCalendar;
