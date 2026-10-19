import{n as e,o as t}from"./auth-CYePSG_H.js";/* empty css             */import{t as n}from"./auth-DaR7_4ld.js";import{r,t as i}from"./habitos-BpAUezHv.js";import{n as a,o,r as s,t as c}from"./sequencia-CDZR462k.js";import{t as l}from"./navbar-Cuu2FhBJ.js";async function u(e){let t=await i(e);if(!t){let e=Error(`Hábito não encontrado`);throw e.code=`NOT_FOUND`,e}let n=(await o(e)).map(e=>e.data),r=s(t.frequencia,n);return{current:r.atual,longest:r.maior,longestAchievedAt:a(t.frequencia,n),unit:t.frequencia.tipo===`vezes-semana`?`week_equivalents`:`days`}}function d(e){return(typeof e==`string`?e:e?.name?.trim()||e?.username||``).trim().split(/\s+/).filter(Boolean).slice(0,2).map(e=>e[0]).join(``).toUpperCase()||`?`}if(await n()){let n=await e(),i=await r(n.id),a=i.filter(e=>e.ativo),o=[];for(let e of i){let t=await u(e.id);o.push({...e,sequencia:t})}let s=await l();s.classList.add(`max-[700px]:w-full`,`max-[700px]:h-auto`,`max-[700px]:px-5`,`max-[700px]:py-[18px]`,`max-[700px]:gap-[18px]`),s.querySelector(`div`).classList.add(`max-[700px]:mb-0`),s.querySelector(`nav`).classList.add(`max-[700px]:flex-row`,`max-[700px]:flex-wrap`,`max-[700px]:gap-[18px]`),document.querySelector(`#menu`).appendChild(s),new URLSearchParams(window.location.search).get(`usuario`);let f=document.querySelector(`#app`);f.innerHTML=`
    <section class="mx-auto max-w-205 overflow-hidden rounded-3xl border border-(--line) bg-white shadow-[0_12px_40px_#00000006] max-[700px]:rounded-[18px]" aria-labelledby="titulo-perfil">
      <div class="min-h-35 bg-(--lima) px-9 py-7 text-[11px] font-extrabold tracking-[.16em] max-[700px]:min-h-30 max-[700px]:px-5 max-[700px]:py-6">
        <span>HABITUS · SEU ESPAÇO</span>
      </div>
      <div class="px-9 pb-9 max-[700px]:px-5 max-[700px]:pb-6">
        <div id="perfil-avatar" class="relative -mt-10.5 mb-6 grid size-22 place-items-center rounded-3xl border-[5px] border-white bg-brand-dark text-[28px] font-extrabold text-(--lima)" aria-hidden="true"></div>
        <p class="mb-2 text-[13px] text-brand-light-gray">Cada hábito conta uma história</p>
        <h1 id="titulo-perfil" class="mb-6 text-[clamp(26px,4vw,34px)] font-extrabold tracking-[-.04em]">Meu perfil</h1>
        <h2 id="perfil-nome" class="text-[22px] font-bold wrap-anywhere"></h2>
        <p id="perfil-username" class="mt-1 text-sm text-brand-blue wrap-anywhere"></p>
        <p id="perfil-descricao" class="mt-4.5 mb-6 leading-[1.7] whitespace-pre-wrap text-brand-light-gray wrap-anywhere"></p>
        <div class="mb-6 grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-(--line) bg-brand-ice p-5">
          <p class="text-sm text-brand-light-gray">Hábitos ativos</p>
          <p id="total-habitos" class="mt-1 text-3xl font-bold"></p>
         </div>

        <div class="rounded-xl border border-(--line) bg-brand-ice p-5">
            <p class="text-sm text-brand-light-gray">Maior sequência</p>
            <p id="maior-sequencia" class="mt-1 text-2xl font-bold"></p>
            <p id="habito-recordista" class="mt-1 text-sm text-brand-light-gray wrap-anywhere"></p>
        </div>
        </div>
        <button id="editar-perfil" type="button" class="cursor-pointer rounded-[10px] border border-(--line) bg-brand-dark px-5 py-2.75 text-sm font-semibold text-white transition-colors hover:bg-[#303030]">Editar perfil</button>
        <form id="form-perfil" class="mt-7 border-t border-(--line) pt-7" hidden>
          <h3 class="text-xl font-bold">Editar meus dados</h3>
          <p class="mt-1.5 mb-6 text-sm text-brand-light-gray">Deixe seu perfil com a sua cara.</p>
          <div class="mb-4.5">
            <label for="editar-nome" class="mb-1.75 block text-sm font-semibold">Nome</label>
            <input id="editar-nome" name="name" maxlength="100" required
              class="block w-full rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white">
          </div>

          <div class="mb-4.5">
            <label for="editar-username" class="mb-1.75 block text-sm font-semibold">Nome de usuário</label>
            <input
              id="editar-username"
              name="username"
              minlength="3"
              maxlength="30"
              pattern="[a-zA-Z0-9_]{3,30}"
              required
              class="block w-full rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white"
            >
          </div>

          <div class="mb-4.5">
            <label for="editar-descricao" class="mb-1.75 block text-sm font-semibold">Descrição</label>
            <textarea
              id="editar-descricao"
              name="profileDescription"
              maxlength="500"
              class="block min-h-30 w-full resize-y rounded-[10px] border border-[#d9d9d4] bg-brand-ice px-3.5 py-3 focus:border-brand-blue focus:bg-white"
            ></textarea>
          </div>

          <p id="mensagem-perfil" role="status" class="mb-4.5 rounded-lg bg-(--chama-bg) p-3 text-sm text-(--chama-ink) empty:hidden"></p>

          <div class="flex flex-wrap gap-2.5">
            <button type="submit" class="cursor-pointer rounded-[10px] border border-brand-blue bg-brand-blue px-5 py-2.75 text-sm font-semibold text-white transition-colors hover:bg-(--azul-escuro) disabled:cursor-wait disabled:opacity-60">Salvar alterações</button>
            <button id="cancelar-edicao" type="button" class="cursor-pointer rounded-[10px] border border-(--line) bg-white px-5 py-2.75 text-sm font-semibold transition-colors hover:bg-brand-ice">Cancelar</button>
          </div>
        </form>
        <section class="mt-8 border-t border-(--line) pt-6" aria-labelledby="titulo-habitos">
          <h3 id="titulo-habitos" class="mb-4 text-xl font-bold">Hábitos</h3>
          <p id="habitos-vazios" class="text-sm text-brand-light-gray" hidden>
            Você ainda não criou hábitos.
          </p>
          <ul id="lista-habitos" class="space-y-3"></ul>
        </section>
      </div>
    </section>
  `,f.querySelector(`#total-habitos`).textContent=a.length;let p=o.reduce((e,t)=>{if(!e)return t;let n=t.sequencia,r=e.sequencia;if(n.longest>r.longest)return t;let i=n.longest===r.longest,a=n.longestAchievedAt||``,o=r.longestAchievedAt||``;return i&&a>o?t:e},null),m=p&&p.sequencia.longest>0;f.querySelector(`#maior-sequencia`).textContent=m?c(p.sequencia.longest,p.frequencia):c(0,{tipo:`diaria`}),f.querySelector(`#habito-recordista`).textContent=m?p.nome:`Conclua um hábito para começar.`;let h=f.querySelector(`#lista-habitos`);f.querySelector(`#habitos-vazios`).hidden=o.length>0;for(let e of o){let t=document.createElement(`li`);t.className=`rounded-xl border border-(--line) bg-brand-ice p-4`;let n=document.createElement(`h4`);n.className=`font-semibold wrap-anywhere`,n.textContent=e.nome;let r=document.createElement(`p`);r.className=`mt-1 text-sm text-brand-light-gray`,r.textContent=`Sequência atual: ${c(e.sequencia.current,e.frequencia)}`,t.append(n,r),h.appendChild(t)}f.querySelector(`#perfil-avatar`).textContent=d(n),f.querySelector(`#perfil-nome`).textContent=n.name,f.querySelector(`#perfil-username`).textContent=`@${n.username}`,f.querySelector(`#perfil-descricao`).textContent=n.profileDescription||`Você ainda não adicionou uma descrição.`;let g=f.querySelector(`#form-perfil`),_=f.querySelector(`#editar-perfil`);_.addEventListener(`click`,()=>{g.elements.name.value=n.name,g.elements.username.value=n.username,g.elements.profileDescription.value=n.profileDescription||``,f.querySelector(`#mensagem-perfil`).textContent=``,g.hidden=!1,_.hidden=!0,g.elements.name.focus()}),f.querySelector(`#cancelar-edicao`).addEventListener(`click`,()=>{g.hidden=!0,_.hidden=!1,_.focus()}),g.addEventListener(`submit`,async r=>{r.preventDefault();let i=f.querySelector(`#mensagem-perfil`),a=g.querySelector(`[type="submit"]`);i.textContent=``,a.disabled=!0;try{await t(n.id,{name:g.elements.name.value,username:g.elements.username.value,profileDescription:g.elements.profileDescription.value}),n=await e(),document.getElementById(`saudacao-usuario`).textContent=`Olá, ${n.name.split(` `)[0]}`,f.querySelector(`#perfil-avatar`).textContent=d(n),f.querySelector(`#perfil-nome`).textContent=n.name,f.querySelector(`#perfil-username`).textContent=`@${n.username}`,f.querySelector(`#perfil-descricao`).textContent=n.profileDescription||`Você ainda não adicionou uma descrição.`,g.hidden=!0,_.hidden=!1,_.focus()}catch(e){i.textContent=e.message}finally{a.disabled=!1}})}