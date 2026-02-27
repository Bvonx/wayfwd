import React, { useRef, useState, useEffect } from 'react';

/**
 * Two-Factor Authentication code input component
 * Features: auto-focus next, paste support, auto-submit
 */
const TwoFactorInput = ({ length = 6, onComplete, disabled = false, autoFocus = true }) => {
    const [values, setValues] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [autoFocus]);

    // Check if complete and call onComplete
    useEffect(() => {
        const code = values.join('');
        if (code.length === length && !values.includes('')) {
            onComplete?.(code);
        }
    }, [values, length, onComplete]);

    const handleChange = (index, value) => {
        // Only accept digits
        if (value && !/^\d$/.test(value)) return;

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        // Auto-focus next input
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            if (values[index]) {
                // Clear current
                const newValues = [...values];
                newValues[index] = '';
                setValues(newValues);
            } else if (index > 0) {
                // Move to previous and clear
                inputRefs.current[index - 1]?.focus();
                const newValues = [...values];
                newValues[index - 1] = '';
                setValues(newValues);
            }
            e.preventDefault();
        }

        // Handle left/right arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

        if (pastedData) {
            const newValues = [...values];
            for (let i = 0; i < pastedData.length; i++) {
                newValues[i] = pastedData[i];
            }
            setValues(newValues);

            // Focus the next empty input or last input
            const nextEmptyIndex = newValues.findIndex(v => !v);
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleFocus = (e) => {
        e.target.select();
    };



    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 sm:gap-3">
                {values.map((value, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={e => handleChange(index, e.target.value)}
                        onKeyDown={e => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        onFocus={handleFocus}
                        disabled={disabled}
                        className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold 
                            bg-brand-dark border-2 rounded-lg transition-all
                            focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${value ? 'border-brand-primary text-brand-text' : 'border-brand-text/20 text-brand-muted'}`}
                    />
                ))}
            </div>
            <p className="text-xs text-brand-muted">
                Enter the 6-digit code from your authenticator app
            </p>
        </div>
    );
};

export default TwoFactorInput;
