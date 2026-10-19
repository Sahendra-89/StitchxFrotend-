import React from 'react';

/**
 * Editorial Section Header
 * Senior design standard: Clear hierarchy, restrained typography, controlled max-width.
 */
export function SectionHeader({
  tag,
  title,
  description,
  align = 'center', // 'left' | 'center'
  children,
  className = ''
}) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-7 md:mb-9 ${isCenter ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'} ${className}`}>
      {tag && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EEF3FF] border border-[#C9D7F5] text-xs font-mono font-bold tracking-wider text-[#0B1220] mb-2.5 ${isCenter ? 'mx-auto' : ''}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#1677FF]"></span>
          <span>{tag}</span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1220] leading-snug">
        {title}
      </h2>

      {description && (
        <p className="mt-2.5 text-sm sm:text-base text-[#2B384E] leading-relaxed">
          {description}
        </p>
      )}

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default SectionHeader;
