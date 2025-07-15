const express = require('express')
const { Cadusuario, login, DetalharUsuario, DetalhaCategoria, cadastrarCateg,
    detalhartransacao, cadastrarTransacao, obterextrato, Categoria, transacao, deletarCategoria
    , deletartransacao } = require('./controladores/cntls')
const { verificar } = require('./intermediarios/intermediarios')

const rotas = express()

rotas.post('/usuario', Cadusuario)
rotas.post('/login', login)
rotas.use(verificar)
rotas.get('/usuario', DetalharUsuario)
rotas.post('/categoria', cadastrarCateg)
rotas.get('/categoria/:ID', DetalhaCategoria)
rotas.get('/transacao/extrato', obterextrato)
rotas.get('/transacao/:ID', detalhartransacao)
rotas.post('/transacao', cadastrarTransacao)

rotas.get("/categoria", Categoria)
rotas.get("/transacao", transacao)
rotas.delete("/categoria/:id", deletarCategoria)
rotas.delete("/transacao/:id", deletartransacao)


rotas.put("/categoria/:id")
rotas.put("/transacao/:id")






module.exports = {
    rotas
}