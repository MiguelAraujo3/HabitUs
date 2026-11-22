'use client';

import { useEffect } from 'react';
import { iniciarPaginaCriarGrupo } from '../../views/criar-grupo';
import { iniciarPainelHabitos } from '../../views/painel-habitos';

export default function PaginaCriarGrupo() {
  useEffect(() => {
    iniciarPaginaCriarGrupo();
    iniciarPainelHabitos();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-bg font-sans">
      <div id="menu" className="hidden shrink-0 md:block" />
      <main id="app" className="no-scrollbar min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1060px] justify-center gap-8 px-4 md:px-6 lg:px-8">
          <div id="conteudo" className="min-w-0 max-w-[680px] flex-1 pb-28 md:pb-16">
            <div id="cabecalho" />

            <form id="form-grupo" className="mt-5 space-y-6" noValidate>
              <div id="resumo-erros" />

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="nome-grupo" className="text-[15px] font-medium">
                    Nome do grupo
                  </label>
                </div>
                <input
                  id="nome-grupo"
                  type="text"
                  className="w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30"
                  placeholder="Ex.: Movimento 30 Dias"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-[15px] font-medium">Categoria</legend>
                <div id="grade-categorias" />
              </fieldset>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="inicio" className="text-[15px] font-medium">
                      Início
                    </label>
                  </div>
                  <input
                    id="inicio"
                    type="date"
                    className="w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="fim" className="text-[15px] font-medium">
                      Fim
                    </label>
                  </div>
                  <input
                    id="fim"
                    type="date"
                    className="w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <label htmlFor="descricao" className="text-[15px] font-medium">
                    Descrição (opcional)
                  </label>
                </div>
                <textarea
                  id="descricao"
                  rows={3}
                  className="w-full min-h-[48px] rounded-[10px] border border-line bg-surface px-3.5 text-[17px] text-ink placeholder:text-[#8a8a86] focus:border-action focus:outline-2 focus:outline-offset-0 focus:outline-action/30 py-3 leading-6"
                />
              </div>

              <fieldset>
                <legend className="mb-2 text-[15px] font-medium">Atividades e pontos</legend>
                <ul id="lista-atividades" className="space-y-2" />
                <div id="erro-atividades" />
                <button
                  id="adicionar-atividade"
                  type="button"
                  className="press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-45 text-action hover:bg-action-tint mt-2 min-h-11 w-full px-5 text-[16px]"
                >
                  Adicionar atividade
                </button>
              </fieldset>

              <button
                type="submit"
                className="press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-45 bg-action text-white hover:bg-action-press min-h-[50px] w-full px-5 text-[16px]"
              >
                Criar grupo
              </button>
            </form>
          </div>
          <aside id="painel-habitos" className="hidden w-72 shrink-0 self-start pt-6 lg:sticky lg:top-0 lg:block" />
        </div>
      </main>
    </div>
  );
}
