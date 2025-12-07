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
  
  title: "foquito.ar | Cartelera de Cine Arte",
  description: "Cartelera unificada de cine arte, ciclos especiales y películas independientes en Buenos Aires. Tu foco en el cine de calidad.",
  
  
  metadataBase: new URL('https://foquito.ar'),
  alternates: {
    canonical: '/',
  },

  
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>",
  },

  
  openGraph: {
    title: 'foquito.ar | Cine Arte en Buenos Aires',
    description: 'Cartelera unificada de cine arte, ciclos especiales y películas independientes en Buenos Aires.',
    url: 'https://foquito.ar',
    siteName: 'foquito.ar',
    type: 'website',
    locale: 'es_AR',
  
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cinema room with vintage film projectors',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'foquito.ar | Cartelera de Cine Arte',
    description: 'foco en el cine de Buenos Aires.',
    images: ['/og-image.jpg'], 
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