import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          fontFamily: 'monospace'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              backgroundColor: '#39ff14',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
            }}
          />
          <h1 style={{ marginLeft: 20, fontSize: 48, color: '#39ff14' }}>
            Alien: 8-bit Escape
          </h1>
        </div>
        <p
          style={{
            fontSize: 24,
            textAlign: 'center',
            maxWidth: '80%',
            color: '#39ff14',
            marginBottom: 40
          }}
        >
          Survive the Space Station Maze
        </p>
        <div style={{ display: 'flex', marginTop: 20 }}>
          <div
            style={{
              backgroundColor: '#39ff14',
              color: '#000',
              padding: '12px 24px',
              marginRight: 20,
              fontFamily: 'monospace',
              fontSize: 18
            }}
          >
            Human
          </div>
          <div
            style={{
              backgroundColor: '#39ff14',
              color: '#000',
              padding: '12px 24px',
              marginRight: 20,
              fontFamily: 'monospace',
              fontSize: 18
            }}
          >
            Android
          </div>
          <div
            style={{
              backgroundColor: '#39ff14',
              color: '#000',
              padding: '12px 24px',
              fontFamily: 'monospace',
              fontSize: 18
            }}
          >
            Alien
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
