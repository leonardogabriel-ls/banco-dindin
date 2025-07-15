const jwt = require('jsonwebtoken')
const senhaJWT = require('../controladores/senhaJWT')
const { Pool } = require('pg')
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '27699',
    database: 'dindin'
})
const verificar = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Nao autorizado" })
    }

    const token = authorization.split(' ')[1]

    try {
        const { id } = jwt.verify(token, senhaJWT)

        const { rows, rowCount } = await pool.query(`select * from usuarios where id = $1`, [id])

        if (rowCount < 1) {
            return res.status(401).json({ mensagem: "Não autorizado" })
        }

        req.usuario = rows[0]
        next()
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno" })
    }

}

module.exports = {
    verificar
}