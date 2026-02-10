import { ImageResponse } from 'next/og';
import { getMovieById } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'Cartelera foquito.ar';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);

  if (!movie) {
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
        {movie.poster && (
          <img
            src={movie.poster}
            alt=""
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '120%',
              height: '120%',
              objectFit: 'cover',
              opacity: 0.3,
              filter: 'blur(40px)',
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '60px', alignItems: 'center', position: 'relative' }}>
          {movie.poster && (
            <img
              src={movie.poster}
              style={{
                width: '320px',
                height: '480px',
                borderRadius: '4px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                objectFit: 'cover',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '600px' }}>
            <span style={{ color: '#f59e0b', fontSize: '28px', marginBottom: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>
              FOQUITO.AR
            </span>
            <h1 style={{ fontSize: '72px', color: 'white', margin: 0, lineHeight: 1.1, fontWeight: 700 }}>
              {movie.title}
            </h1>
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', color: '#a3a3a3', fontSize: '30px' }}>
              {movie.director && <span>{movie.director}</span>}
              {movie.country && (
                <>
                  <span style={{ color: '#404040' }}>|</span>
                  <span>{movie.country}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}