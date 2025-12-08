'use client'
import { useState, ReactNode } from 'react'
import dynamic from 'next/dynamic';

const AddToCalendarModal = dynamic(() => import('./AddToCalendarModal'), { 
    ssr: false 
  });

interface ScreeningData {
    id: number;
    title: string;
    date: string;
    time: string;
    duration?: number | null;
    cinema: string;
    room?: string | null;
    rating?: string | null;
    format?: string | null;
    overview?: string | null;
    tmdb_id?: number | null;
    poster?: string | null;
    vote_average?: number | null;
    movie_id?: number;
}

interface ScreeningModalTriggerProps {
    screening: ScreeningData;
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