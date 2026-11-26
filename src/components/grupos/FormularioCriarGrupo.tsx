'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CLASSE_INPUT } from '../ui';
import { hoje, paraChave } from '../../utils/datas';
import { GradeCategorias } from './GradeCategorias';
import { Icone } from './Icone';
import { LinhaAtividade, type AtividadeFormulario } from './LinhaAtividade';

const PONTOS_INICIAIS = 3;

export function FormularioCriarGrupo() {
  const proximoIdRef = useRef(2);
  const listaRef = useRef<HTMLUListElement>(null);
  const focarUltimaRef = useRef(false);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [atividades, setAtividades] = useState<AtividadeFormulario[]>([
    { id: 1, nome: '', pontos: PONTOS_INICIAIS },
  ]);

  useEffect(() => {
    setDataInicio(paraChave(hoje()));
  }, []);

  useEffect(() => {
    if (!focarUltimaRef.current) return;
    focarUltimaRef.current = false;
    const campos = listaRef.current?.querySelectorAll<HTMLInputElement>('input[type="text"]');
    if (campos && campos.length > 0) {
      campos[campos.length - 1].focus();
    }
  }, [atividades.length]);

  function adicionarAtividade(): void {
    const id = proximoIdRef.current;
    proximoIdRef.current += 1;
    focarUltimaRef.current = true;
    setAtividades((lista) => [...lista, { id, nome: '', pontos: PONTOS_INICIAIS }]);
  }

  function atualizarNomeAtividade(id: number, novoNome: string): void {
    // RUBRICA: programação funcional (map devolve nova lista com a atividade atualizada)
    setAtividades((lista) =>
      lista.map((atividade) => (atividade.id === id ? { ...atividade, nome: novoNome } : atividade))
    );
  }

  function atualizarPontosAtividade(id: number, novosPontos: number): void {
    // RUBRICA: programação funcional (map devolve nova lista com a atividade atualizada)
    setAtividades((lista) =>
      lista.map((atividade) =>
        atividade.id === id ? { ...atividade, pontos: novosPontos } : atividade
      )
    );
  }

  function removerAtividade(id: number): void {
    // RUBRICA: programação funcional (filter devolve a lista sem a linha removida)
    setAtividades((lista) => lista.filter((atividade) => atividade.id !== id));
  }

  function aoEnviar(evento: FormEvent<HTMLFormElement>): void {
    evento.preventDefault();
    // S1-37: validar os campos e salvar o grupo
  }

  return (
    <form id="form-grupo" className="mt-5 space-y-6" noValidate onSubmit={aoEnviar}>
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
          className={CLASSE_INPUT}
          placeholder="Ex.: Movimento 30 Dias"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-[15px] font-medium">Categoria</legend>
        <div id="grade-categorias">
          <GradeCategorias valor={categoria} aoMudar={setCategoria} />
        </div>
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
            className={CLASSE_INPUT}
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
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
            className={CLASSE_INPUT}
            min={dataInicio}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
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
          className={`${CLASSE_INPUT} py-3 leading-6`}
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-[15px] font-medium">Atividades e pontos</legend>
        <ul id="lista-atividades" ref={listaRef} className="space-y-2">
          {/* RUBRICA: programação funcional (map para renderizar a lista de atividades) */}
          {atividades.map((atividade, indice) => (
            <LinhaAtividade
              key={atividade.id}
              atividade={atividade}
              indice={indice}
              podeRemover={atividades.length > 1}
              aoMudarNome={(novoNome) => atualizarNomeAtividade(atividade.id, novoNome)}
              aoMudarPontos={(novosPontos) => atualizarPontosAtividade(atividade.id, novosPontos)}
              aoRemover={() => removerAtividade(atividade.id)}
            />
          ))}
        </ul>
        <div id="erro-atividades" />
        <button
          id="adicionar-atividade"
          type="button"
          className="press inline-flex items-center justify-center gap-2 rounded-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-45 text-action hover:bg-action-tint mt-2 min-h-11 w-full px-5 text-[16px]"
          onClick={adicionarAtividade}
        >
          <Icone nome="Plus" tamanho={18} />
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
  );
}
