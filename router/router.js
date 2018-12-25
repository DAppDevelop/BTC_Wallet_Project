let router = require("express").Router()
let walletController = require("../controllers/wallet")
let webController = require("../controllers/web")

router.get("/", (req,res)=>{
    res.send("hello!")
})

//页面
router.get("/wallet.html", webController.getWalletHtml)
router.get("/walletinfo.html", webController.getWalletInfoHtml)
router.get("/transaction.html", webController.getTransactionHtml)
router.get("/transactionrecord.html", webController.getTransactionRecordHtml)


router.post("/wallet/create", walletController.walletCreate)

module.exports = router

