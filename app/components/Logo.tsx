import React from 'react';

export default function Logo({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className='flex flex-row'>        
        <h1 
        className={`text-2xl font-logo tracking-normal text-foreground pt-1 ${className}`}
        {...props}
        >
        Foquito
        </h1>
        <span className='text-base text-shadow-2xs not-italic mr-2 pb-1'>💡</span>
    </div>
  );
}