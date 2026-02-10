import { ImageResponse } from 'next/og';
import { getScreeningById } from '@/lib/db';

export const runtime = 'nodejs'; 
export const alt = 'Función en foquito.ar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const screening = await getScreeningById(id);

  if (!screening) {
    return new Response('Not Found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Fondo con blur */}
        {screening.poster && (
          <img
            src={screening.poster}
            alt=""
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '120%',
              height: '120%',
              objectFit: 'cover',
              opacity: 0.25,
              filter: 'blur(40px)',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', position: 'relative' }}>
          {/* Poster */}
          {screening.poster && (
            <img
              src={screening.poster}
              style={{
                width: '300px',
                height: '450px',
                borderRadius: '4px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          )}

          {/* Info de la Función */}
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 600, letterSpacing: '0.1em' }}>
                FOQUITO.AR
              </span>
              <span style={{ color: '#404040', fontSize: '24px' }}>|</span>
              <span style={{ color: 'white', fontSize: '24px', fontWeight: 500 }}>
                {screening.cinema}
              </span>
            </div>

            <h1 style={{ fontSize: '64px', color: 'white', margin: 0, lineHeight: 1.1, fontWeight: 700 }}>
              {screening.title}
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '24px', gap: '8px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#f59e0b', fontSize: '36px', fontWeight: 600 }}>
                <span>{screening.time} HS</span>
                <span style={{ color: '#404040', fontSize: '24px' }}>•</span>
                <span style={{ color: '#e5e5e5' }}>{screening.date.split('-').reverse().join('/')}</span>
              </div>
              <span style={{ fontSize: '24px', color: '#a3a3a3', marginTop: '8px' }}>
              {screening.director && (
              <span style={{ fontSize: '24px', color: '#a3a3a3', marginTop: '8px' }}>
                  Dir. {screening.director}
              </span>
              )}
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}