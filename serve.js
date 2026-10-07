import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import usuariosRouter from './backend/routes/usuarios.js'

const site = express()
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url))

site.use(express.json())
site.use(express.static(path.join(diretorioAtual, 'Front')))
site.get('/', (_req, res) => res.redirect('/html/user.html'))
site.use('/api/usuarios', usuariosRouter)

const porta = process.env.PORT || 3000
site.listen(porta, () => {
    console.log(`Servidor disponível em http://localhost:3000`)
})