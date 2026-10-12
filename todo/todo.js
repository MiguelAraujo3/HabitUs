// import "style"
import { showMenu } from "header"

// function takeAndGuardName() {
//   alert('botao funcionando')
//   const name = document.getElementById('textid').value
//   localStorage.setItem('name', name)
// }
document.querySelector('#menu').innerHTML = showMenu();
// document.querySelector('#app').innerHTML = `
// <form class="relative z-50 flex items-center gap-3 p-4">
//   <input type="text" id="textid" name="texto" placeholder="Escreva aqui..." />
//   <button type="button" id="btnName">Enviar Nome</button>
// </form>
// `
// document.getElementById('btnName').addEventListener('click', takeAndGuardName)