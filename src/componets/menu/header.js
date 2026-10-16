import "style"
  
export function showMenu() {
  let name = 'Cadastro/Login';
  let link = '/habit-tracker/login/';
  let usuarioLogado = (JSON.parse(localStorage.getItem('usuarioLogado')));
  if  (usuarioLogado && usuarioLogado !== undefined) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))
    name = `Olá, ${usuarioLogado.username.split(' ')[0]}`
    link = '/habit-tracker/conta/';
  } 
 return `
    <header class="bg-brand-gray text-white fixed top-0 left-0 h-screen w-64 flex flex-col py-8 px-6 shadow-md z-50">
        <div class="text-xl font-bold tracking-widest mb-10">LOGO</div>
            <nav class="flex flex-col gap-6 text-sm font-medium">
            <a href="/habit-tracker/habitos/" class="hover:text-brand-ice transition-colors">Hábitos</a>
            <a href="/habit-tracker/todo/" class="hover:text-brand-ice transition-colors">ToDo</a>
            <a href="/habit-tracker/categorias/" class="hover:text-brand-ice transition-colors">Categorias</a>
        </nav>
        <a href="${link}" class="mt-auto text-sm font-medium hover:text-brand-ice transition-colors">${name}</a>
    </header>
    `
}