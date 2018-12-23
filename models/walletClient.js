let config = require("../config/config")
let Client = require("bitcore-wallet-client")

module.exports = {
    getWalletClient: ()=>{
        let client = new Client({
            baseUrl: config.BWS_URL,
            verbose: false,
        })

        return client
    }
    
}