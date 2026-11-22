import type { Metadata } from 'next';
import '../styles/grupos.css';
import { ProvedorAutenticacao } from '../contexts/AuthContext';

export const metadata: Metadata = {
  title: 'HabitUs',
  description: 'Acompanhamento de hábitos e grupos — HabitUs',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-brand-ice font-sans">
        <ProvedorAutenticacao>{children}</ProvedorAutenticacao>
      </body>
    </html>
  );
}
