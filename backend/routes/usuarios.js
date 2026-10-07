import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../../banco/database.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const usuarios = db.prepare(`
      SELECT id, nome, email, cargo, ativo FROM usuarios ORDER BY nome COLLATE NOCASE
    `).all()

    return res.json(usuarios)
  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Não foi possível carregar os usuários.' })
  }
})

router.post('/login', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const senha = req.body.senha

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha.' })
  }

  try {
    const usuario = db.prepare(`
      SELECT nome, senha_hash, ativo FROM usuarios WHERE email = ?
    `).get(email)

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }
    if (!usuario.ativo) {
      return res.status(403).json({ erro: 'Esta conta está desativada.' })
    }

    return res.json({ nome: usuario.nome })
  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Não foi possível entrar na conta.' })
  }
})

router.post('/', async (req, res) => {
  const nome = req.body.nome?.trim()
  const email = req.body.email?.trim().toLowerCase()
  const senha = req.body.senha
  const cargo = req.body.cargo?.trim()

  if (!nome || !email || !senha || !cargo) {
    return res.status(400).json({ erro: 'Preencha todos os campos.' })
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10)
    db.prepare(`
      INSERT INTO usuarios (nome, email, senha_hash, cargo)
      VALUES (?, ?, ?, ?)
    `).run(nome, email, senhaHash, cargo)

    return res.status(201).json({ mensagem: 'Conta criada com sucesso.', nome })
  } catch (erro) {
    if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ erro: 'Este email já está cadastrado.' })
    }

    console.error(erro)
    return res.status(500).json({ erro: 'Não foi possível criar a conta.' })
  }
})

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : undefined
  const senha = typeof req.body.senha === 'string' ? req.body.senha : undefined
  const ativo = req.body.ativo

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'Identificador de usuário inválido.' })
  }
  if (req.body.nome !== undefined && !nome) {
    return res.status(400).json({ erro: 'O nome não pode ficar vazio.' })
  }
  if (req.body.senha !== undefined && typeof req.body.senha !== 'string') {
    return res.status(400).json({ erro: 'A senha informada é inválida.' })
  }
  if (ativo !== undefined && typeof ativo !== 'boolean') {
    return res.status(400).json({ erro: 'O status da conta é inválido.' })
  }
  if (!nome && !senha && ativo === undefined) {
    return res.status(400).json({ erro: 'Informe alguma alteração para o usuário.' })
  }

  try {
    const usuario = db.prepare('SELECT id FROM usuarios WHERE id = ?').get(id)
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' })
    }

    const senhaHash = senha ? await bcrypt.hash(senha, 10) : undefined
    const atualizarUsuario = db.transaction(() => {
      if (nome) {
        db.prepare('UPDATE usuarios SET nome = ? WHERE id = ?').run(nome, id)
      }
      if (senhaHash) {
        db.prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?').run(senhaHash, id)
      }
      if (ativo !== undefined) {
        db.prepare('UPDATE usuarios SET ativo = ? WHERE id = ?').run(Number(ativo), id)
      }
    })
    atualizarUsuario()

    return res.json({ mensagem: 'Usuário atualizado com sucesso.' })
  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Não foi possível atualizar o usuário.' })
  }
})

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'Identificador de usuário inválido.' })
  }

  try {
    const resultado = db.prepare('DELETE FROM usuarios WHERE id = ?').run(id)
    if (resultado.changes === 0) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' })
    }

    return res.json({ mensagem: 'Usuário removido com sucesso.' })
  } catch (erro) {
    console.error(erro)
    return res.status(500).json({ erro: 'Não foi possível remover o usuário.' })
  }
})

export default router