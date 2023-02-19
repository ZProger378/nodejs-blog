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
    sql.query("SELECT * FROM articles", (err, ress) => {
        let articles = ress.reverse()
        let token = req.cookies.token
        if (token) {
            sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
                res.render("index", {is_auth: true, username: result[0].user_id, articles: articles})
            })
        } else {
            res.render("index", {is_auth: false, username: undefined, articles: articles})
        }
    })
})
router.get("/article/id-:article_id", (req, res) => {
    sql.query("SELECT * FROM articles", (err, resls) => {
        let articles = resls.reverse()
        let article_id = req.params.article_id
        sql.query("SELECT * FROM articles WHERE id = ?", [article_id], (err, result) => {
            if (result[0]) {
                sql.query("UPDATE articles SET views = views + 1 WHERE id = ?", [article_id])
                let token = req.cookies.token
                if (token) {
                    sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, ress) => {
                        res.render("article_page", {is_auth: true, username: ress[0].user_id, article_content: result[0], articles: articles})
                    })
                } else {
                    res.render("article_page", {is_auth: false, username: undefined, article_content: result[0], articles: articles})
                }
            } else {
                res.send("Извините, статья не найдена!")
            }
        })
    })
})
router.get("/login", (req, res) => {
    let token = req.cookies.token
    if (token) {
        sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
            res.render("login", {is_auth: true, username: result[0].user_id})
        })
    } else {
        res.render("login", {is_auth: false, username: undefined})
    }
})
router.get("/reg", (req, res) => {
    let token = req.cookies.token
    if (token) {
        sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
            res.render("reg", {is_auth: true, username: result[0].user_id})
        })
    } else {
        res.render("reg", {is_auth: false, username: undefined})
    }
})
router.get("/logout", (req, res) => {
    res.clearCookie("token")
    res.redirect("/")
})
router.get("/my_articles", (req, res) => {
    let token = req.cookies.token
    if (token) {
        sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
            let username = result[0].user_id
            sql.query("SELECT * FROM articles WHERE user = ?", [username], (err, ress) => {
                let articles = ress
                res.render("my_articles", {is_auth: true, username: username, articles: articles})
            })
        })
    } else {
        res.redirect("/login")
    }
})
router.get("/create_article", (req, res) => {
    let token = req.cookies.token
    if (token) {
        sql.query("SELECT * FROM sessions WHERE token = ?", [token], (err, result) => {
            res.render("create_article", {is_auth: true, username: result[0].user_id})
        })
    } else {
        res.redirect("/login")
    }
})

// Обработка POST запросов
router.post("/login", (req, res) => {
    let login = req.body.login
    let pass = req.body.pass
    let remember_me = req.body.remember_me
    let pass_hash = create_hash(pass)
    sql.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, pass_hash], (err, result) => {
        if (result[0] != undefined) {
            let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ1234567890'
            let len = 16
            let token = ''
            for (let i = 0; i < len; i++) {
                let pos = Math.floor(Math.random() * chrs.length)
                token += chrs.substring(pos,pos+1)
            }
            sql.query("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [result[0].login, token])
            res.cookie("token", token, {maxAge: 30 * 24 * 60 * 60})
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
        let chrs = 'abdehkmnpswxzABDEFGHKMNPQRSTWXZ1234567890'
            let len = 16
            let token = ''
            for (let i = 0; i < len; i++) {
                let pos = Math.floor(Math.random() * chrs.length)
                token += chrs.substring(pos,pos+1)
            }
            sql.query("INSERT INTO sessions (user_id, token) VALUES (?, ?)", [login, token])
            res.cookie("token", token, {maxAge: 30 * 24 * 60 * 60})
    }
    res.send("success")
})
router.post("/create_article", (req, res) => {
    let title = req.body.title
    let text = req.body.text
    let login = req.body.user
    sql.query("INSERT INTO articles (title, article_text, user) VALUES (?, ?, ?)", [title, text, login])
    res.send("success")
})

module.exports = router
