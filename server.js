import Fastify from 'fastify'
import { Pool } from 'pg'
const servidor = Fastify()
const sql = new Pool({
 user: 'postgres',
 password: 'senai',
 host: 'localhost',
 port: 5432,
 database: 'produtos_db'
})
servidor.get('/', () => {
 return 'Olá! A API de produtos está funcionando corretamente.'
})
// Listar todas as categorias
servidor.get('/categorias', async (request, reply) => {
 const resultado = await sql.query('SELECT * FROM categorias ORDER BY id')
 return resultado.rows
})
// Cadastrar nova categoria
servidor.post('/categorias', async (request, reply) => {
 const { nome, descricao } = request.body
 if (!nome) {
 return reply.status(400).send({
 error: 'O nome da categoria é obrigatório!'
 })
 }
 await sql.query(
 'INSERT INTO categorias (nome, descricao) VALUES ($1, $2)',
 [nome, descricao]
 )
 return reply.status(201).send({
 mensagem: 'Categoria cadastrada com sucesso!'
 })
})
// Editar uma categoria
servidor.put('/categorias/:id', async (request, reply) => {
 const { id } = request.params
 const { nome, descricao } = request.body

 if (!nome) {
 return reply.status(400).send({
 error: 'O nome da categoria é obrigatório!'
 })
 }
 const busca = await sql.query(
 'SELECT * FROM categorias WHERE id = $1',
 [id]
 )
 if (busca.rows.length === 0) {
 return reply.status(404).send({
 error: 'Categoria não encontrada!'
 })
 }
 await sql.query(
 'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3',
 [nome, descricao, id]
 )
 return {
 mensagem: 'Categoria alterada com sucesso!'
 }
})
// Deletar uma categoria
servidor.delete('/categorias/:id', async (request, reply) => {
 const { id } = request.params
 const busca = await sql.query(
 'SELECT * FROM categorias WHERE id = $1',
 [id]
 )
 if (busca.rows.length === 0) {
 return reply.status(404).send({
 error: 'Categoria não encontrada!'
 })
 }
 await sql.query(
 'DELETE FROM categorias WHERE id = $1',
 [id]
 )
 return reply.status(204).send()
})
// O aluno deverá criar as rotas de produtos abaixo
servidor.listen({
 port: 3000
})
