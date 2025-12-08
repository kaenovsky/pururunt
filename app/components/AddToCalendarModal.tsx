'use client'
import { useState } from 'react'
import { getCalendarUrlsFromScreening, getLetterboxdUrl, formatDayInSpanish } from '@/lib/calendar-url'
import { Calendar, Mail, Link as LinkIcon, Download, Check, ExternalLink, Clock, Film } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScreeningData {
    id: number;
    title: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    duration?: number | null;
    cinema: string;
    room?: string | null;
    rating?: string | null;
    format?: string | null;
    overview?: string | null;
    director?: string | null;
    country?: string | null;
    tmdb_id?: number | null;
}

interface AddToCalendarModalProps {
    screening: ScreeningData;
    isOpen: boolean;
    onClose: () => void;
}

export default function AddToCalendarModal({ screening, isOpen, onClose }: AddToCalendarModalProps) {
    const [copied, setCopied] = useState(false);
    
    const urls = getCalendarUrlsFromScreening(screening);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(urls.share).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const btnClass = "flex items-center gap-3 p-3 w-full text-left rounded-lg transition-colors";

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div 
                className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="bg-white text-gray-900 rounded-xl shadow-[0_0_40px_rgba(251,191,36,0.5)] w-full max-w-sm"
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-2xl font-bold leading-tight">{screening.title}</h3>
                        
                        <div className="flex items-center gap-4 text-sm mt-2 text-gray-500 font-medium">

                            <span className="flex items-center gap-1.5 text-black font-semibold">
                                {formatDayInSpanish(screening.date)}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm mt-1 text-gray-500 font-medium">
                            <span className="flex items-center gap-1.5 text-black">
                                <Film size={14} className="text-neutral-500" /> 
                                {screening.cinema}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} /> 
                                {screening.time} hs
                            </span>
                            {screening.duration && (
                                <span>| {screening.duration} min</span>
                            )}
                        </div>
                    </div>

                <div className="p-4 space-y-2">
                    <p className="text-sm font-semibold text-neutral-600 mb-1">Guardar en mi agenda</p>

                    <a 
                        href={urls.google} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`btn-action-minimal`}
                    >
                        <Calendar size={20} className="text-rose-300" />
                        <span>Google Calendar</span>
                        <ExternalLink size={14} className="ml-auto text-neutral-400" />
                    </a>
                    
                    <a 
                        href={urls.outlook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`btn-action-minimal`}
                    >
                        <Mail size={20} className="text-blue-300" />
                        <span>Outlook / Office 365</span>
                        <ExternalLink size={14} className="ml-auto text-neutral-400" />
                    </a>

                    <a 
                        href={urls.ics} 
                        download 
                        className={`btn-action-minimal`}
                    >
                        <Download size={20} />
                        <span>Descargar archivo .ics (Otros)</span>
                    </a>
                </div>
                
                <div className="p-4 border-t border-gray-100 mt-2 space-y-2">
                     <p className="text-sm font-semibold text-neutral-600 mb-1">Compartir y referencias</p>

                    <a 
                        href={getLetterboxdUrl(screening.title, screening.tmdb_id)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`btn-action-minimal`}
                    >
                        <Film size={20} className="text-neutral-600" />
                        <span>Ver ficha en Letterboxd</span>
                        <ExternalLink size={14} className="ml-auto text-neutral-400" />
                    </a>

                    <button 
                        onClick={handleCopy} 
                        className={`btn-action-minimal`}
                    >

                        {copied 
                            ? <Check size={20} className="text-green-500" /> 
                            : <LinkIcon size={20} />
                        }
                        <span className="truncate">
                            {copied ? 'Copiado' : 'Copiar link para compartir'}
                        </span>
                    </button>
                </div>

                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}