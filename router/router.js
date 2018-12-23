let router = require("express").Router()
let walletController = require("../controllers/wallet")

router.get("/", (req,res)=>{
    res.send("hello!")
})

router.get("/wallet.html", (req,res)=>{
    res.render("wallet.html")
})

router.post("/wallet/create", walletController.walletCreate)

module.exports = router

