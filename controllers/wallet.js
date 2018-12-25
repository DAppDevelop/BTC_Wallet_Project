let path = require("path")
let fs = require("fs")
let client = require("../models/walletClient").getWalletClient()
let config = require("../config/config")
let {success, fail} = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")

module.exports = {
    walletCreate: (req, res) => {
        let { walletname, password } = req.body

        client.seedFromRandomWithMnemonic({
            network: config.networkType,
            passphrase: password,
            coin: config.coinType,
        })

        client.createWallet(walletname, config.copayerName, 1, 1, {
            network: "testnet",
        }, function (err, ret) {
            console.log(err, ret)
            // console.log(client)
            
            if (err) {
                res.send(fail("createWallet失败"))
                return
            }

            //导出钱包
            let filePath = path.join(config.walletFilePath, walletname + ".dat")
            fs.writeFileSync(filePath, client.export())

            //创建账号
            client.createAddress({}, function (err, address) {
                console.log("address: ", address)
                if (err) {
                    res.send(fail("createAddress失败"))
                    return
                }

                res.send(success("创建成功"))
            })

        })
    },

    walletList: (req, res) => {
        console.log("walletList")
        let wallets = []
        var files = fs.readdirSync(config.walletFilePath)
        files.forEach(element => {
            if(myUtils.stringWithSubstrEnd(element, ".dat")) {
                wallets.push(element.slice(0,-4))
            }
        })
        res.send(success(wallets))
    },

    walletExportMnemonic: (req, res) => {
        let {walletname, password} = req.body
        let filePath = path.join(config.walletFilePath, walletname+".dat")
        client.import(fs.readFileSync(filePath))
        res.send(success(client.credentials.mnemonic))
    }
}