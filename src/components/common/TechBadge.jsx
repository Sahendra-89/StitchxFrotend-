import React from 'react';
import { TechLogo } from './TechLogo';

/**
 * UI Design Spec:
 * - Background: white (#FFFFFF) or light gray (#F8FAFC)
 * - Text: dark slate (#334155)
 * - Border: light gray (#E2E8F0)
 * - Border radius: 8–12px (rounded-[10px] / rounded-lg)
 * - Original brand colors for technology logos
 * - On hover: subtle blue border (#2563EB), light shadow, smooth transition
 */
export function TechBadge({ 
  name, 
  size = 'md', 
  className = '',
  bg = 'white' // 'white' (#FFFFFF) or 'light' (#F8FAFC)
}) {
  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    md: 'px-3 py-1.5 text-[13px] gap-2 rounded-[10px]',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2.5 rounded-xl'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const bgClass = bg === 'light' ? 'bg-[#F8FAFC]' : 'bg-[#FFFFFF]';

  return (
    <span
      className={`inline-flex items-center font-medium text-[#334155] border border-[#E2E8F0] shadow-2xs hover:border-[#2563EB] hover:shadow-xs transition-all duration-200 cursor-default select-none ${bgClass} ${sizeStyles[size] || sizeStyles.md} ${className}`}
      title={name}
    >
      <TechLogo name={name} className={`${iconSizes[size] || iconSizes.md} shrink-0`} />
      <span className="whitespace-nowrap tracking-tight">{name}</span>
    </span>
  );
}

export default TechBadge;
