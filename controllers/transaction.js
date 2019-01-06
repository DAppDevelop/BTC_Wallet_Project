let { success, fail } = require("../utils/myUtils")
let client = require("../models/walletClient").getWalletClient()
var path = require('path');
var fs = require('fs');
var config = require("../config/config")
let btcUtils = require("bitcore-lib").Unit


module.exports = {
    transactionSend: (req, res) => {
        let { walletname, password, to, amount } = req.body
        console.log(req.body);

        let filePath = path.join(config.walletFilePath, walletname + ".dat")
        client.import(fs.readFileSync(filePath));

        let transactionAmount = btcUtils.fromBTC(parseFloat(amount)).toSatoshis()
        let opts = {
            'outputs': [
                {
                    'toAddress': to,
                    'amount':  transactionAmount,
                    'message': 'cys'
                }
            ],
            message: "yanceyTransfer"
        }

        client.createTxProposal(opts, function (err, txp) {
            if (err) {
                console.log(err);
                res.send(fail(err.message))
                return
            }
            console.log("\n createTxProposal:\n", txp)

            client.publishTxProposal({ txp: txp }, function (err, txp) {
                if (err) {
                    console.log(err);
                    res.send(fail(err.message))
                    return
                }
                console.log("\n publishTxProposal:\n", txp)

                client.signTxProposal(txp, function (err, txp) {
                    if (err) {
                        console.log(err);
                        res.send(fail(err.message))
                        return
                    }
                    console.log("\n signTxProposal:\n", txp)

                    client.broadcastTxProposal(txp, function (err, txp, memo) {
                        if (err) {
                            console.log(err);
                            res.send(fail(err.message))
                            return
                        }
                        if (memo) {
                            console.log(memo);
                        }
                        console.log("\n broadcastTxProposal:\n", txp)
                        res.send(success("转账成功"))
                    })
                })
            })
        })
    },

    transactionRecord: (req, res) => {
        let {walletname} = req.body
        console.log(walletname);

        let filePath = path.join(config.walletFilePath, walletname + ".dat")
        client.import(fs.readFileSync(filePath));

        client.getTxHistory({includeExtendedInfo:true}, (err, data) => {
            console.log(err, data);
            if (err) {
                res.send(fail(err.message))
                return
            }
            res.send(success(data))
        });
    },
}