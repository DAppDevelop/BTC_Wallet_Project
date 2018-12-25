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

//创建钱包
router.post("/wallet/create", walletController.walletCreate)
//获取钱包列表
router.get("/wallet/list", walletController.walletList)
//导出助记词
router.post("/export/mnemonic", walletController.walletExportMnemonic)
//通过助记词导入钱包
router.post("/import/mnemonic", walletController.walletImportWithMnemonic)



module.exports = router

