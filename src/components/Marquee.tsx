import React from 'react';

interface MarqueeProps {
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  speed?: number; // Duration in seconds: lower = faster, higher = slower
}

export const Marquee: React.FC<MarqueeProps> = ({
  text,
  bgColor = '#B0E0E6',
  textColor = '#111827',
  className = '',
  speed = 22,
}) => {
  const duration = Math.max(3, speed || 22);

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className={`relative w-full h-8 overflow-hidden flex items-center select-none text-xs sm:text-sm font-semibold tracking-wide ${className}`}
    >
      <div className="flex w-full overflow-hidden">
        <div
          className="animate-marquee-smooth flex items-center gap-8 pl-full"
          style={{ animationDuration: `${duration}s` }}
        >
          <span>{text}</span>
          <span className="opacity-60">•</span>
          <span>{text}</span>
        </div>
      </div>
    </div>
  );
};
