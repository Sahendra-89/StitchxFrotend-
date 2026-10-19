import React from 'react';
import { Link } from 'react-router-dom';

/**
 * StitchX Global Technology Brand Logo Component
 * Renders the official StitchX Global Technology brand asset.
 */
export function Logo({
  variant = 'full', // 'full' (image), 'emblem' (icon only), 'horizontal' (icon + text)
  size = 'md',      // 'sm', 'md', 'lg'
  linkTo = '/',
  theme = 'light',  // 'light' (default) or 'dark' (for dark surfaces like footer)
  className = '',
  onClick
}) {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-18',
  };

  const iconSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };

  const textClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const hClass = heightClasses[size] || heightClasses.md;
  const iClass = iconSizeClasses[size] || iconSizeClasses.md;
  const tClass = textClasses[size] || textClasses.md;

  let logoContent = null;

  if (variant === 'emblem') {
    logoContent = (
      <div className={`overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-white p-1' : ''}`}>
        <img
          src="/stitchx-logo.png"
          alt="StitchX Global Technology Emblem"
          className={`${iClass} object-cover object-left transition-transform duration-300 group-hover:scale-105`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>
    );
  } else if (variant === 'horizontal') {
    logoContent = (
      <div className="flex items-center gap-2.5">
        <div className={`overflow-hidden rounded-xl ${theme === 'dark' ? 'bg-white p-1 shadow-sm' : ''}`}>
          <img
            src="/stitchx-logo.png"
            alt="StitchX Emblem"
            className={`${iClass} object-cover object-left`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/logo.png';
            }}
          />
        </div>
        <div className="flex flex-col text-left">
          <span className={`${tClass} font-black tracking-tight flex items-center leading-none`}>
            <span className="text-[#1677FF]">Stitch</span>
            <span className={theme === 'dark' ? 'text-white' : 'text-[#0B1220]'}>X</span>
          </span>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#38BDF8] uppercase mt-0.5">
            Global Technology
          </span>
        </div>
      </div>
    );
  } else {
    // Default: Official StitchX Global Technology full logo
    logoContent = (
      <div className={`transition-all duration-300 ${
        theme === 'dark'
          ? 'bg-white/95 hover:bg-white px-3 py-1.5 rounded-xl shadow-[0_4px_20px_rgba(22,119,255,0.18)] border border-white/20'
          : 'p-0.5'
      }`}>
        <img
          src="/stitchx-logo.png"
          alt="StitchX Global Technology"
          className={`${hClass} w-auto max-w-[220px] sm:max-w-[260px] object-contain transition-transform duration-300 group-hover:scale-[1.02]`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>
    );
  }

  const wrapperContent = (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none group cursor-pointer ${className}`}
    >
      {logoContent}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block">
        {wrapperContent}
      </Link>
    );
  }

  return wrapperContent;
}

export default Logo;
