// Entrada do painel lateral "Hábitos de hoje".
import { montarPainelHabitos } from '../components/painelHabitos';

export function iniciarPainelHabitos(): void {
  montarPainelHabitos().catch((erro: unknown) => {
    console.error('Não foi possível montar o painel de hábitos:', erro);
  });
}
