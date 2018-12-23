var path = require('path');

module.exports = {
    BWS_URL: 'https://bws.bitpay.com/bws/api',
    networkType: "testnet",//livenet,testnet
    coinType: "btc",
    copayerName: "yancey",
    walletFilePath: path.join(__dirname, "../static/wallet_file"),
}
