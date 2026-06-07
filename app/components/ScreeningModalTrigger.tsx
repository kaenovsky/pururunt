'use client'
import { useState, ReactNode } from 'react'
import dynamic from 'next/dynamic';
import type { Screening } from '@/lib/types'

const AddToCalendarModal = dynamic(() => import('./AddToCalendarModal'), {
    ssr: false
  });

interface ScreeningModalTriggerProps {
    screening: Screening;
    children: ReactNode;
}

export default function ScreeningModalTrigger({ screening, children }: ScreeningModalTriggerProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTriggerClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault(); 
        setIsModalOpen(true);
    };

    return (
        <>
            <div onClick={handleTriggerClick}>
              {children}
            </div>

            <AddToCalendarModal 
                screening={screening}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}