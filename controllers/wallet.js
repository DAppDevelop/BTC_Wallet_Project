let path = require("path")
let fs = require("fs")
let client = require("../models/walletClient").getWalletClient()
let config = require("../config/config")
let {success, fail} = require("../utils/myUtils")
let myUtils = require("../utils/myUtils")
let btcUtils = require("bitcore-lib").Unit

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
                console.log("\n创建账号");
                console.log("\naddress: ", address)
                if (err) {
                    res.send(fail("createAddress失败"))
                    return
                }
                res.send(success("创建成功"))
            })

        })
    },

    walletList: (req, res) => {
        // console.log("walletList")
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
    },

    walletImportWithMnemonic: (req, res) => {
        let {walletname, password, mnemonic} = req.body

        client.importFromMnemonic(mnemonic, {
            network: config.networkType,
            passphrase: password,
        }, function(err, ret){
            if (err) {
                res.send(fail(err.message))
                return
            }
            // console.log(client)
            let filePath = path.join(config.walletFilePath, walletname+".dat")
            fs.writeFileSync(filePath, client.export())
            res.send(success("导入成功"))
        })
    },

    walletBalance: (req, res)=>{
        let {walletname} = req.body
        // console.log(walletname)
        let filePath = path.join(config.walletFilePath, walletname+".dat")
        console.log(filePath)
        client.import(fs.readFileSync(filePath))
        // console.log(client)
        client.getBalance({}, (err, balanceData)=>{
            console.log("\nwalletBalance");
            console.log(err, balanceData)
            if (err) {
                res.send(fail(err.message))
                return
            }
            
            let totalAmount = btcUtils.fromSatoshis(balanceData.totalAmount).toBTC()
            let lockedAmount = btcUtils.fromSatoshis(balanceData.lockedAmount).toBTC()
            let availableAmount = btcUtils.fromSatoshis(balanceData.availableAmount).toBTC()
            let balanceDataDic = {"totalAmount":totalAmount, "lockedAmount":lockedAmount, "availableAmount":availableAmount}
            res.send(success(balanceDataDic))

        })
    },

    walletAddress: (req, res)=>{
        let {walletname} = req.body
        let filePath = path.join(config.walletFilePath, walletname+".dat")
        client.import(fs.readFileSync(filePath))

        client.getMainAddresses({}, (err, addressData)=>{
            console.log("\nwalletAddress");
            console.log(err, addressData)
            if (err) {
                res.send(fail(err.message))
                return
            }
            
            res.send(success(addressData))
        })
    },

    walletNewSubAddress: (req, res)=>{
        let {walletname} = req.body
        let filePath = path.join(config.walletFilePath, walletname+".dat")
        client.import(fs.readFileSync(filePath))
        client.createAddress({}, function (err, addr) {
            console.log("\nwalletNewSubAddress");
            console.log(err, addr)
            if (err) {
                res.send(fail(err.message))
                return
            }
            res.send(success(addr))
        });

    },

    walletExportPrivateKey: (req, res)=>{
        let {walletname, password, childpath} = req.body
        let filePath = path.join(config.walletFilePath, walletname+".dat")
        client.import(fs.readFileSync(filePath))

        let derivedXPrivKey = client.credentials.getDerivedXPrivKey(null);
        let privateKey = derivedXPrivKey.deriveChild(childpath).privateKey
        res.send(success(privateKey.toWIF()))

    },


}