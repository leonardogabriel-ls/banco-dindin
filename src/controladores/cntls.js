const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaJWT = require('./senhaJWT')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '27699',
    database: 'dindin'
})

const Cadusuario = async (req, res) => {
    const { nome, email, senha } = req.body
    try {
        const usuarioProc = await pool.query('select * from usuarios where email = $1;', [email])
        if (usuarioProc.rowCount < 1) {
            return res.status(400).json({ mensagem: "Email  invalido" })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const cadastroUsuario = await pool.query('insert into usuarios(nome,email,senha)values ($1,$2,$3) returning id,nome,email',
            [nome, email, senhaCriptografada])

        return res.json(cadastroUsuario.rows[0])
    } catch (error) {
        console.log(error)
        return res.status(500).json({ mensagem: "Erro interno" })
    }
}

const login = async (req, res) => {
    const { email, senha } = req.body
    if (!email) {
        return res.status(400).json({ mensagem: "Email obrigatorio" })
    }
    if (!senha) {
        return res.status(400).json({ mensagem: "Senha obrigatoria" })
    }
    const usuarioProc = await pool.query('select * from usuarios where email = $1;', [email])

    if (usuarioProc.rowCount < 1) {
        return res.status(404).json({ mensagem: "Email ou senha invalidos" })
    }
    try {
        const senhaCorreta = await bcrypt.compare(senha, usuarioProc.rows[0].senha)

        if (!senhaCorreta) {
            return res.status(404).json({ mensagem: "Email ou senha invalidos" })
        }

        const token = await jwt.sign({ id: usuarioProc.rows[0].id }, senhaJWT, { expiresIn: '2d' })

        return res.json(`Logado. Token do usuario: ${token}(Valido por 2 dias)`)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const DetalharUsuario = async (req, res) => {
    const { id, nome, email } = req.usuario
    const informacoes = { id, nome, email }
    return res.status(200).json(informacoes)
}

const DetalhaCategoria = async (req, res) => {
    const { ID } = req.params
    const { id } = req.usuario
    if (!ID) {
        return res.status(400).json({ Mensagem: `"Parametro "iD" é obrigatório` })
    }
    try {
        const detalharcateg = await pool.query(`select * from categorias where usuario_id = $1 and id = $2`, [id, ID])

        return res.json(detalharcateg.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const cadastrarCateg = async (req, res) => {
    const { descricao } = req.body
    const { id } = req.usuario
    if (!descricao) {
        return res.status(400).json({ mensagem: `O campo "Descricao e obrigatorio"` })
    }
    try {
        const cadastrcateg = await pool.query(`insert into
        categorias (usuario_id, descricao)
      values
      ($1,$2)`, [id, descricao])
        const retorno = await pool.query(`select * from categorias where descricao = $1`, [descricao])

        return res.status(200).json(retorno.rows)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const detalhartransacao = async (req, res) => {
    const { ID } = req.params
    const { id } = req.usuario

    if (!ID) {
        return res.status(400).json({ mensagem: `O paramêtro "ID" é obrigatorio` })
        //falta fazer funcionar
    }
    try {
        const busca = await pool.query(`select * from transacoes where ID = $1 and usuario_id=$2`, [ID, id])
        if (busca.rowCount < 1) {
            return res.status(404).json({ mensagem: `Transacao nao cadastrada` })
        }
        return res.json(busca.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const cadastrarTransacao = async (req, res) => {
    const { id } = req.usuario
    const { tipo, descricao, valor, data, categoria_id } = req.body
    const tipoEntr = req.body.tipo

    if (tipo !== 'entrada' && tipo !== 'saida') {
        return res.status(400).json({ erro: "O campo 'tipo' deve ser 'entrada' ou 'saida'." });
    }

    try {
        const cadastransa = await pool.query(`insert into
         transacoes (descricao, valor,data,categoria_id, usuario_id, tipo)
       values
         ($2, $3,$4,$5,$6,$1)`, [tipo, descricao, valor, data, categoria_id, id])
        if (cadastransa) {
            const retorno = await pool.query(`SELECT
             t.id,
             t.descricao,
             t.valor,
             t.data,
             t.categoria_id,
             t.usuario_id,
             t.tipo,
             c.descricao AS categoria_nome
           FROM
             transacoes t
           JOIN
             categorias c ON c.id = t.categoria_id
           ORDER BY
             t.id DESC
           LIMIT
             1;
           `)
            return res.json(retorno.rows)
        }
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const obterextrato = async (req, res) => {
    const { id } = req.usuario
    try {
        const extra = await pool.query(`SELECT
        COALESCE(SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END), 0) AS entrada,
        COALESCE(SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END), 0) AS saida
      FROM
        transacoes where usuario_id = $1;
      `, [id])

        return res.json(extra.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const Categoria = async (req, res) => {
    const { id } = req.usuario
    try {
        const detalharcateg = await pool.query(`select * from categorias where usuario_id = $1 and id`, [id])

        return res.json(detalharcateg.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const transacao = async (req, res) => {
    const { id } = req.usuario
    try {
        const detalharcateg = await pool.query(`select * from transacao where usuario_id = $1 and id`, [id])

        return res.json(detalharcateg.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const deletarCategoria = async (req, res) => {
    const { ID } = req.params
    const { id } = req.usuario
    if (!ID) {
        return res.status(400).json({ Mensagem: `"Parametro "iD" é obrigatório` })
    }
    try {
        const detalharcateg = await pool.query(`delete from categorias where usuario_id = $1 and id = $2`, [id, ID])

        return res.json(detalharcateg.rows)
    } catch (error) {
        console.log(error.mensagem);
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

const deletartransacao = async (req, res) => {
    const { ID } = req.params
    const { id } = req.usuario

    if (!ID) {
        return res.status(400).json({ mensagem: `O paramêtro "ID" é obrigatorio` })
    }
    try {
        const busca = await pool.query(`delete from transacoes where ID = $1 and usuario_id=$2`, [ID, id])
        if (busca.rowCount < 1) {
            return res.status(404).json({ mensagem: `Transacao nao cadastrada` })
        }
        return res.json(busca.rows)
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro Interno" })
    }
}

module.exports = {
    Cadusuario,
    login,
    DetalharUsuario,
    DetalhaCategoria,
    cadastrarCateg,
    detalhartransacao,
    cadastrarTransacao,
    obterextrato,
    Categoria,
    transacao,
    deletarCategoria,
    deletartransacao
}


