// Ícones SVG embutidos (traço Lucide, licença ISC), sem biblioteca externa.
// icone('Plus', { tamanho: 18 }) devolve um elemento <svg> pronto para appendChild.

const NS = 'http://www.w3.org/2000/svg';

// Cada ícone é uma lista de [tag, atributos] desenhada em uma grade 24x24.
const ICONES = {
  Plus: [['path', {d:'M5 12h14'}], ['path', {d:'M12 5v14'}]],
  Minus: [['path', {d:'M5 12h14'}]],
  Users: [['path', {d:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'}], ['circle', {cx:'9',cy:'7',r:'4'}], ['path', {d:'M22 21v-2a4 4 0 0 0-3-3.87'}], ['path', {d:'M16 3.13a4 4 0 0 1 0 7.75'}]],
  ChevronRight: [['path', {d:'m9 18 6-6-6-6'}]],
  ArrowLeft: [['path', {d:'m12 19-7-7 7-7'}], ['path', {d:'M19 12H5'}]],
  Settings: [['path', {d:'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z'}], ['circle', {cx:'12',cy:'12',r:'3'}]],
  Camera: [['path', {d:'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z'}], ['circle', {cx:'12',cy:'13',r:'3'}]],
  Copy: [['rect', {width:'14',height:'14',x:'8',y:'8',rx:'2',ry:'2'}], ['path', {d:'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2'}]],
  Trash2: [['path', {d:'M3 6h18'}], ['path', {d:'M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'}], ['path', {d:'M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'}], ['line', {}], ['line', {}]],
  Check: [['path', {d:'M20 6 9 17l-5-5'}]],
  Lock: [['rect', {width:'18',height:'11',x:'3',y:'11',rx:'2',ry:'2'}], ['path', {d:'M7 11V7a5 5 0 0 1 10 0v4'}]],
  Info: [['circle', {cx:'12',cy:'12',r:'10'}], ['path', {d:'M12 16v-4'}], ['path', {d:'M12 8h.01'}]],
  Clock: [['circle', {cx:'12',cy:'12',r:'10'}], ['polyline', {points:'12 6 12 12 16 14'}]],
  Crown: [['path', {d:'M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z'}], ['path', {d:'M5 21h14'}]],
  AlertCircle: [['circle', {cx:'12',cy:'12',r:'10'}], ['line', {}], ['line', {}]],
  AlertTriangle: [['path', {d:'m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'}], ['path', {d:'M12 9v4'}], ['path', {d:'M12 17h.01'}]],
  Heart: [['path', {d:'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z'}]],
  Dumbbell: [['path', {d:'M14.4 14.4 9.6 9.6'}], ['path', {d:'M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z'}], ['path', {d:'m21.5 21.5-1.4-1.4'}], ['path', {d:'M3.9 3.9 2.5 2.5'}], ['path', {d:'M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z'}]],
  GraduationCap: [['path', {d:'M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z'}], ['path', {d:'M22 10v6'}], ['path', {d:'M6 12.5V16a6 3 0 0 0 12 0v-3.5'}]],
  BookOpen: [['path', {d:'M12 7v14'}], ['path', {d:'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'}]],
  Apple: [['path', {d:'M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z'}], ['path', {d:'M10 2c1 .5 2 2 2 5'}]],
  Moon: [['path', {d:'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'}]],
  Flower2: [['path', {d:'M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1'}], ['circle', {cx:'12',cy:'8',r:'2'}], ['path', {d:'M12 10v12'}], ['path', {d:'M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z'}], ['path', {d:'M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z'}]],
  Wallet: [['path', {d:'M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1'}], ['path', {d:'M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4'}]],
  ListChecks: [['path', {d:'m3 17 2 2 4-4'}], ['path', {d:'m3 7 2 2 4-4'}], ['path', {d:'M13 6h8'}], ['path', {d:'M13 12h8'}], ['path', {d:'M13 18h8'}]],
  Palette: [['circle', {cx:'13.5',cy:'6.5',r:'.5',fill:'currentColor'}], ['circle', {cx:'17.5',cy:'10.5',r:'.5',fill:'currentColor'}], ['circle', {cx:'8.5',cy:'7.5',r:'.5',fill:'currentColor'}], ['circle', {cx:'6.5',cy:'12.5',r:'.5',fill:'currentColor'}], ['path', {d:'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'}]],
  Shapes: [['path', {d:'M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z'}], ['rect', {x:'3',y:'14',width:'7',height:'7',rx:'1'}], ['circle', {cx:'17.5',cy:'17.5',r:'3.5'}]],
  CircleHelp: [['circle', {cx:'12',cy:'12',r:'10'}], ['path', {d:'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'}], ['path', {d:'M12 17h.01'}]],
  Ban: [['circle', {cx:'12',cy:'12',r:'10'}], ['path', {d:'m4.9 4.9 14.2 14.2'}]],
  UserCheck: [['path', {d:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2'}], ['circle', {cx:'9',cy:'7',r:'4'}], ['polyline', {points:'16 11 18 13 22 9'}]],
  CalendarX2: [['path', {d:'M8 2v4'}], ['path', {d:'M16 2v4'}], ['path', {d:'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8'}], ['path', {d:'M3 10h18'}], ['path', {d:'m17 22 5-5'}], ['path', {d:'m17 17 5 5'}]],
  PartyPopper: [['path', {d:'M5.8 11.3 2 22l10.7-3.79'}], ['path', {d:'M4 3h.01'}], ['path', {d:'M22 8h.01'}], ['path', {d:'M15 2h.01'}], ['path', {d:'M22 20h.01'}], ['path', {d:'m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10'}], ['path', {d:'m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17'}], ['path', {d:'m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7'}], ['path', {d:'M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z'}]],
  RotateCcw: [['path', {d:'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8'}], ['path', {d:'M3 3v5h5'}]],
  X: [['path', {d:'M18 6 6 18'}], ['path', {d:'m6 6 12 12'}]],
  Newspaper: [['path', {d:'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2'}], ['path', {d:'M18 14h-8'}], ['path', {d:'M15 18h-5'}], ['path', {d:'M10 6h8v4h-8V6Z'}]],
  Home: [['path', {d:'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8'}], ['path', {d:'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'}]],
  UserRound: [['circle', {cx:'12',cy:'8',r:'5'}], ['path', {d:'M20 21a8 8 0 0 0-16 0'}]],
  MessageCircle: [['path', {d:'M7.9 20A9 9 0 1 0 4 16.1L2 22Z'}]],
};

export function icone(nome, { tamanho = 24, classe = '', espessura = 2, preencher = false } = {}) {
  const desenho = ICONES[nome];
  if (!desenho) {
    throw new Error(`Ícone desconhecido: ${nome}`);
  }

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('width', String(tamanho));
  svg.setAttribute('height', String(tamanho));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', preencher ? 'currentColor' : 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', String(espessura));
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  if (classe) {
    svg.setAttribute('class', classe);
  }

  // RUBRICA: programação funcional (forEach sobre a lista de formas do ícone)
  desenho.forEach(([tag, atributos]) => {
    const forma = document.createElementNS(NS, tag);
    Object.entries(atributos).forEach(([chave, valor]) => forma.setAttribute(chave, valor));
    svg.appendChild(forma);
  });

  return svg;
}
