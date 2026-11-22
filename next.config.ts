import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/habitos.html', destination: '/habitos' },
      { source: '/feed.html', destination: '/feed' },
      { source: '/perfil.html', destination: '/perfil' },
      { source: '/grupos.html', destination: '/grupos' },
      { source: '/criar-grupo.html', destination: '/criar-grupo' },
      { source: '/grupo.html', destination: '/grupo' },
      { source: '/convite.html', destination: '/convite' },
    ];
  },
};

export default nextConfig;
