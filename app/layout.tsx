import type { Metadata } from "next";
import { Montserrat, Marck_Script } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-montserrat",
});

const logoFont = Marck_Script({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-logo",
})

export const metadata: Metadata = {
  
  title: "foquito.ar | Cines chiquitos de CABA",
  description: "Cartelera de cines alternativos en la Ciudad de Buenos Aires. Pelis de autor, cine nacional, ciclos y festivales.",
  
  
  metadataBase: new URL('https://foquito.ar'),
  alternates: {
    canonical: '/',
  },

  
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>",
  },

  
  openGraph: {
    title: 'foquito.ar | Cines chiquitos de CABA',
    description: 'Cartelera de cines alternativos en la Ciudad de Buenos Aires. Pelis de autor, cine nacional, ciclos y festivales.',
    url: 'https://foquito.ar',
    siteName: 'foquito.ar',
    type: 'website',
    locale: 'es_AR',
  
    images: [
      {
        url: '/og-image.png',
        width: 1000,
        height: 630,
        alt: 'brand design logo with cinema room in the background',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'foquito.ar | Cines chiquitos de CABA',
    description: 'Cartelera de cines alternativos en la Ciudad de Buenos Aires. Pelis de autor, cine nacional, ciclos y festivales.',
    images: ['/og-image.png'], 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} ${logoFont.variable} font-sans bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}