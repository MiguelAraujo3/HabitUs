// Ajudantes de DOM compartilhados entre as páginas e componentes.
// Nada aqui usa innerHTML com dados do usuário: o texto sempre entra por textContent.

const SVG_NS = 'http://www.w3.org/2000/svg';

// Ícones (paths 24x24, estilo contorno)
export const ICONES: Record<string, string> = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  chama: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  saude: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  esportes: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>',
  estudos: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  leitura: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  alimentacao: '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  sono: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  mental: '<path d="M12 22v-5"/><path d="M9 17h6"/><path d="M12 17c-3 0-5-2-5-5 0-2 1-3 2-4-1-1-1-3 1-4 1.5-1 3-.5 4 .5 1-1 2.5-1.5 4-.5 2 1 2 3 1 4 1 1 2 2 2 4 0 3-2 5-5 5z"/>',
  financas: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  organizacao: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  hobbies: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  lapis: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  lixeira: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  calendario: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  outros: '<circle cx="12" cy="12" r="9"/>',
};

// Ícone SVG. O conteúdo vem da constante ICONES (nunca de dados do usuário).
export function svg(nomeIcone: string, classe = ''): SVGSVGElement {
  const s = document.createElementNS(SVG_NS, 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', nomeIcone === 'check' ? '2.8' : '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.setAttribute('aria-hidden', 'true');
  if (classe) s.setAttribute('class', classe);
  s.innerHTML = ICONES[nomeIcone] ?? ICONES.outros;
  return s;
}

export interface OpcoesElemento {
  classe?: string;
  texto?: string | null;
  attrs?: Record<string, string>;
}

// Cria um elemento: el('h3', { classe, texto, attrs }, [filhos]). O texto entra por textContent.
// O tipo devolvido acompanha a tag (el('button') é um HTMLButtonElement, el('a') um HTMLAnchorElement).
// Filhos vazios (null/undefined/false) são ignorados, o que permite filhos opcionais.
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  opts: OpcoesElemento = {},
  filhos: Array<Node | null | undefined | false> = []
): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (opts.classe) e.className = opts.classe;
  if (opts.texto != null) e.textContent = opts.texto;
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) e.setAttribute(k, v);
  }
  for (const f of filhos) {
    if (f) e.appendChild(f);
  }
  return e;
}

// Busca um elemento da página pelo id. Se ele não existir, o erro diz qual faltou
// (assim o TypeScript não precisa tratar "null" em cada uso).
export function obterPorId<T extends HTMLElement = HTMLElement>(id: string): T {
  const e = document.getElementById(id);
  if (!e) throw new Error(`Elemento #${id} não encontrado na página.`);
  return e as T;
}

// Igual ao querySelector, mas lança erro claro quando o elemento não existe.
export function selecionar<T extends Element = HTMLElement>(raiz: ParentNode, seletor: string): T {
  const e = raiz.querySelector<T>(seletor);
  if (!e) throw new Error(`Elemento "${seletor}" não encontrado.`);
  return e;
}
