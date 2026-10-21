// Aparência de cada categoria (família de cor e ícone) — copiada de data.ts do design.
// A chave é o mesmo texto de src/data/categorias.js (o grupo guarda o nome da categoria).

export const VISUAL_CATEGORIAS = [
  { rotulo: 'Saúde', familia: 'coral', icone: 'Heart' },
  { rotulo: 'Esportes e exercícios', familia: 'lime', icone: 'Dumbbell' },
  { rotulo: 'Estudos', familia: 'blue', icone: 'GraduationCap' },
  { rotulo: 'Leitura', familia: 'violet', icone: 'BookOpen' },
  { rotulo: 'Alimentação', familia: 'coral', icone: 'Apple' },
  { rotulo: 'Sono', familia: 'blue', icone: 'Moon' },
  { rotulo: 'Bem-estar mental', familia: 'violet', icone: 'Flower2' },
  { rotulo: 'Finanças', familia: 'lime', icone: 'Wallet' },
  { rotulo: 'Organização e produtividade', familia: 'cyan', icone: 'ListChecks' },
  { rotulo: 'Hobbies e criatividade', familia: 'cyan', icone: 'Palette' },
  { rotulo: 'Outros', familia: 'gray', icone: 'Shapes' },
];

// Categoria desconhecida cai em "Outros", como no design.
export function visualDaCategoria(rotulo) {
  const achada = VISUAL_CATEGORIAS.find((c) => c.rotulo === rotulo);
  return achada ?? VISUAL_CATEGORIAS[VISUAL_CATEGORIAS.length - 1];
}
