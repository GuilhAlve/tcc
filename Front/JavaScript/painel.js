const nomeUsuario = sessionStorage.getItem('usuarioLogadoNome')
if (!nomeUsuario) {
  window.location.replace('/html/login.html')
}

const elementoNome = document.getElementById('nome-sidebar')
const elementoAvatar = document.getElementById('avatar-usuario')
if (elementoNome && nomeUsuario) elementoNome.textContent = nomeUsuario
if (elementoAvatar && nomeUsuario) {
  elementoAvatar.textContent = nomeUsuario.trim().charAt(0).toUpperCase()
}

document.getElementById('sair')?.addEventListener('click', () => {
  sessionStorage.removeItem('usuarioLogadoNome')
  window.location.assign('/html/login.html')
})

const abasConfiguracoes = document.querySelectorAll('.settings-tab')
abasConfiguracoes.forEach((aba) => {
  aba.addEventListener('click', () => {
    const painelAtivo = aba.dataset.settings
    for (const item of abasConfiguracoes) {
      const ativo = item === aba
      item.classList.toggle('active', ativo)
      item.setAttribute('aria-selected', String(ativo))
    }

    for (const painel of document.querySelectorAll('.settings-panel')) {
      const ativo = painel.id === painelAtivo
      painel.classList.toggle('active', ativo)
      painel.hidden = !ativo
    }
  })
})

const nomeConfig = document.getElementById('nome-config')
const avatarConfig = document.getElementById('avatar-config')
if (nomeConfig && nomeUsuario) nomeConfig.textContent = nomeUsuario
if (avatarConfig && nomeUsuario) {
  avatarConfig.textContent = nomeUsuario.trim().charAt(0).toUpperCase()
}
