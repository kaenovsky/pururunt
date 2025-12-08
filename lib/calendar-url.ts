interface CalendarEventData {
    title: string;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
  }

  export function getGoogleCalendarUrl(event: CalendarEventData): string {
    const formatGoogleDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
  
    const dates = `${formatGoogleDate(event.startTime)}/${formatGoogleDate(event.endTime)}`;
  
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      dates: dates,
      details: event.description,
      location: event.location,
      sf: 'true',
      output: 'xml',
    });
  
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }
  
  export function getOutlookCalendarUrl(event: CalendarEventData): string {
    const formatOutlookDate = (date: Date): string => {
      return date.toISOString().split('.')[0];
    };
  
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: formatOutlookDate(event.startTime),
      enddt: formatOutlookDate(event.endTime),
      subject: event.title,
      body: event.description,
      location: event.location,
    });
  
    return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
  }
  
  
  export function getCalendarUrlsFromScreening(screening: any) {
      const startString = `${screening.date}T${screening.time}:00-03:00`;
      const startTime = new Date(startString);
  
      const durationMinutes = screening.duration || 120; 
      const endTime = new Date(startTime.getTime() + (durationMinutes * 60 * 1000));
  
      const eventData: CalendarEventData = {
          title: `${screening.title} en ${screening.cinema}`,
          description: `Rating: ${screening.rating || 'N/A'}\nFormato: ${screening.format || '2D'}\n\n${screening.overview || 'Función de cine'}`,
          location: screening.cinema,
          startTime: startTime,
          endTime: endTime,
      };
  
      const icsUrl = `/api/ical/${screening.id}`; 
      
      const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://foquito.ar'}/screening/${screening.id}`;
  
      return {
          google: getGoogleCalendarUrl(eventData),
          outlook: getOutlookCalendarUrl(eventData),
          ics: icsUrl,
          share: shareUrl,
      };
  }

export function formatDayInSpanish(dateString: string): string {
    const date = new Date(dateString + 'T00:00:00');

    const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
    };
    
    let formatted = date.toLocaleDateString('es-ES', options);

    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);    
    formatted = formatted.replace(',', '').replace(/(\d+)\s+([a-záéíóúüñ]+)/i, '$1 de $2');
    
    return formatted;
}

export function getLetterboxdUrl(title: string, tmdbId?: number | null): string {
    if (tmdbId) {
        return `https://letterboxd.com/tmdb/${tmdbId}`;
    } else {
        return `https://letterboxd.com/search/${encodeURIComponent(title)}`;
    }
}