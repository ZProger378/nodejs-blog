const express = require("express")
const sql = require("./db_config")
const router = express.Router()  // Создание экземпляра роутера

// Перенаправление и рендер страниц
router.get("/", (req, res) => {
    res.render("index")
})
router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login", (req, res) => {
    let login = req.body.login
    let pass = req.body.pass
    let remember_me = req.body.remember_me
    sql.query("SELECT * FROM users WHERE login = ? AND password = ?", [login, pass], (err, result) => {
        console.log(result)
        res.send(result)
    })
})

module.exports = router
