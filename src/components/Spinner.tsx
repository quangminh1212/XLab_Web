<<<<<<< HEAD
'use client';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export default function Spinner({
    size = 'md',
    color = 'primary-600',
    className = ''
}: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-10 h-10 border-4'
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div
            className={`animate-spin ${sizeClass} border-${color} border-t-transparent rounded-full ${className}`}
            aria-label="Loading"
        ></div>
    );
=======
'use client';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
    className?: string;
}

export default function Spinner({
    size = 'md',
    color = 'primary-600',
    className = ''
}: SpinnerProps) {
    const sizeClasses = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-10 h-10 border-4'
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    return (
        <div
            className={`animate-spin ${sizeClass} border-${color} border-t-transparent rounded-full ${className}`}
            aria-label="Loading"
        ></div>
    );
>>>>>>> 2aea817a
} 