import { criarNavbar } from '../components/navbar';
import { exigirLogin } from '../components/auth';
import { criarCabecalhoPagina } from '../components/ui';

export async function iniciarPaginaCriarGrupo(): Promise<void> {
  const autorizado = await exigirLogin();

  if (autorizado) {
    const menu = await criarNavbar();
    if (menu) {
      document.querySelector('#menu')?.appendChild(menu);
    }

    document
      .querySelector('#cabecalho')
      ?.replaceChildren(
        criarCabecalhoPagina({ titulo: 'Criar grupo', voltarPara: 'grupos.html' })
      );
  }
}
