const nomeUsuario = sessionStorage.getItem('usuarioLogadoNome')

if (!nomeUsuario) {
  window.location.replace('/html/login.html')
} else {
  document.getElementById('nome-usuario').textContent = nomeUsuario
  document.getElementById('nome-sidebar').textContent = nomeUsuario
  document.getElementById('avatar-usuario').textContent = nomeUsuario.trim().charAt(0).toUpperCase()
}

document.getElementById('sair').addEventListener('click', () => {
  sessionStorage.removeItem('usuarioLogadoNome')
  window.location.assign('/html/login.html')
})