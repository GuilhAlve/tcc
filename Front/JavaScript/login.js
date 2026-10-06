const formLogin = document.getElementById('login-form')
const statusLogin = document.getElementById('login-status')
const botaoLogin = formLogin.querySelector('button[type="submit"]')

formLogin.addEventListener('submit', async (event) => {
  event.preventDefault()
  statusLogin.textContent = 'Verificando seus dados...'
  botaoLogin.disabled = true

  try {
    const resposta = await fetch('/api/usuarios/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(formLogin)))
    })
    const resultado = await resposta.json()

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Não foi possível entrar.')
    }

    sessionStorage.setItem('usuarioLogadoNome', resultado.nome)
    window.location.assign('/html/principalADM.html')
  } catch (erro) {
    statusLogin.textContent = erro.message || 'Não foi possível conectar ao servidor.'
  } finally {
    botaoLogin.disabled = false
  }
})