let express = require("express")
let app = express()
let path = require("path")
let router = require("./router/router")

app.use(express.urlencoded({extended:false}))
app.engine(".html", require("ejs").__express)
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "static")))

app.use("/", router)

app.listen(3000)
console.log("正在监听3000")