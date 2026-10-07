const form = document.getElementById('cadastro-form')
const statusCadastro = document.getElementById('cadastro-status')

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  statusCadastro.textContent = 'Criando conta...'

  try {
    const resposta = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    })
    const resultado = await resposta.json()

    if (!resposta.ok) {
      throw new Error(resultado.erro || 'Erro ao criar conta.')
    }

    sessionStorage.setItem('usuarioLogadoNome', resultado.nome)
    window.location.assign('/html/principalADM.html')
  } catch (erro) {
    statusCadastro.textContent = erro.message || 'Não foi possível conectar ao servidor.'
  }
})