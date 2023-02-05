// Импорт express
const express = require("express")

// Импорт БД
const sql = require("./db_config")
const router = express.Router()  // Создание экземпляра роутера

// Перенаправление и рендер страниц

// Обработка GET запросов
router.get("/", (req, res) => {
    res.render("index")
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
    sql.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, pass], (err, result) => {
        if (result[0] != undefined) {
            let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789'
            let len = 16
            let token = ''
            for (let i = 0; i < len; i++) {
                let pos = Math.floor(Math.random() * chrs.length)
                token += chrs.substring(pos,pos+1)
            }
            sql.query("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [result[0].id, token])
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
})

module.exports = router
