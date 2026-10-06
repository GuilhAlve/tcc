import Database from 'better-sqlite3'
import bcrypt from 'bcryptjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const diretorioAtual = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(diretorioAtual, 'banco.db'))
const colunas = db.pragma('table_info(usuarios)')

const criarTabelaUsuarios = () => db.exec(`
  CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    cargo TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))
  )
`)

if (colunas.length === 0) {
  criarTabelaUsuarios()
} else if (colunas.some((coluna) => coluna.name === 'senha')) {
  db.transaction(() => {
    db.exec('ALTER TABLE usuarios RENAME TO usuarios_legado')
    criarTabelaUsuarios()

    const usuariosAntigos = db.prepare(
      'SELECT Id AS id, nome, email, senha, cargo FROM usuarios_legado'
    ).all()
    const inserirUsuario = db.prepare(`
      INSERT INTO usuarios (id, nome, email, senha_hash, cargo)
      VALUES (?, ?, ?, ?, ?)
    `)

    for (const usuario of usuariosAntigos) {
      inserirUsuario.run(
        usuario.id,
        usuario.nome,
        usuario.email,
        bcrypt.hashSync(usuario.senha, 10),
        usuario.cargo || 'usuarios'
      )
    }

    db.exec('DROP TABLE usuarios_legado')
  })()
} else if (!colunas.some((coluna) => coluna.name === 'ativo')) {
  db.exec('ALTER TABLE usuarios ADD COLUMN ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))')
}

export default db