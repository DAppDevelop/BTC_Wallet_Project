let router = require("express").Router()
let walletController = require("../controllers/wallet")
let webController = require("../controllers/web")
let transactionController = require("../controllers/transaction")

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
//导出私钥
router.post("/export/privatekey", walletController.walletExportPrivateKey)
//查询余额
router.post("/wallet/balance", walletController.walletBalance)
//获取地址
router.post("/wallet/address", walletController.walletAddress)
//获取子账号地址
router.post("/wallet/newsubaddress", walletController.walletNewSubAddress)
//发送交易
router.post("/transaction/send", transactionController.transactionSend)

module.exports = router

