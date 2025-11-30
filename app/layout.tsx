import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cineee.ar | Cartelera de Cine Arte",
  description: "Cartelera unificada del Cine Lorca, Cosmos UBA y más.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎥</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}