import "style"
export function showMenu() {
 return `
  <header class="bg-brand-gray text-white flex justify-between items-center px-8 py-6 shadow-md">
    <div class="text-xl font-bold tracking-widest">LOGO</div>
    <nav class="flex gap-8 text-sm font-medium">
      <a href="/index.html" class="hover:text-brand-ice transition-colors">Hábitos</a>
      <a href="/habit-tracker/todo/index.html" class="hover:text-brand-ice transition-colors">ToDo</a>
      <a href="/habit-tracker/categorias/index.html" class="hover:text-brand-ice transition-colors">Categorias</a>
      <a href="/habit-tracker/conta/index.html" class="hover:text-brand-ice transition-colors">Minha Conta</a>
    </nav>
  </header>
`
}