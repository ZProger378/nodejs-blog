// Импорт express
const express = require("express")
// Импорт crypto
const crypto = require('crypto')

// Импорт БД
const sql = require("./db_config")
const router = express.Router()  // Создание экземпляра роутера

let create_hash = (name) => {
    let hash = crypto.createHash('md5').update(name).digest('hex')
    return hash
}

// Перенаправление и рендер страниц

// Обработка GET запросов
router.get("/", (req, res) => {
    let token = req.cookies.token
    if (token) {
        sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
            res.render("index", {is_auth: true, username: result[0].user_id})
        })
    } else {
        res.render("index", {is_auth: false, username: undefined})
    }
})
router.get("/login", (req, res) => {
    res.render("login")
})
router.get("/reg", (req, res) => {
    res.render("reg")
})

// Обработка POST запросов
router.post("/login", (req, res) => {
    let login = req.body.login
    let pass = req.body.pass
    let remember_me = req.body.remember_me
    let pass_hash = create_hash(pass)
    sql.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, pass_hash], (err, result) => {
        if (result[0] != undefined) {
            let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789'
            let len = 16
            let token = ''
            for (let i = 0; i < len; i++) {
                let pos = Math.floor(Math.random() * chrs.length)
                token += chrs.substring(pos,pos+1)
            }
            sql.query("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [result[0].login, token])
            res.cookie("token", token)
            res.send("success")
        } else
            res.send("invalid credit data")
    })
})
router.post("/reg", (req, res) => {
    let login = req.body.login
    let pass = req.body.pass
    let auto_auth = req.body.auto_auth
    let pass_hash = create_hash(pass)
    sql.query("INSERT INTO users (login, password) VALUES (?, ?)", [login, pass_hash])
    if (auto_auth) {
        let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789'
            let len = 16
            let token = ''
            for (let i = 0; i < len; i++) {
                let pos = Math.floor(Math.random() * chrs.length)
                token += chrs.substring(pos,pos+1)
            }
            sql.query("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [login, token])
            res.cookie("token", token)
    }
})

module.exports = router
