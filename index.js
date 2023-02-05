// Import the fucking modules
const express = require("express")
const body_parser = require("body-parser")
// Импорт cookie-parser'а для работы с Cookie-файлами
const cookie_parser = require("cookie-parser")
const router = require("./router")

const app = express()  // Initialization the fucking app

const PORT = 3000
app.set("view engine", "ejs")
app.use(cookie_parser("qwerty123"))
app.use(express.static("public"))
app.use(body_parser.urlencoded({'extended': false}))
app.use(router)

// Server polling...
app.listen(PORT, () => {
    console.log(`[i] Server has been started on port ${PORT}`)
})
