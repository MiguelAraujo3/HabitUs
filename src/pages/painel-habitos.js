// Entrada do painel lateral "Hábitos de hoje". Cada página que tem o <aside id="painel-habitos">
// carrega este script: <script type="module" src="/src/pages/painel-habitos.js"></script>
import { montarPainelHabitos } from '../components/painelHabitos.js';

montarPainelHabitos().catch((erro) => {
  console.error('Não foi possível montar o painel de hábitos:', erro);
});
