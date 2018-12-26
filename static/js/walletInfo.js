let currentwallet = localStorage.getItem("currentwallet")

$(document).ready(function(){
    if(!currentwallet) {
        return
    }

    $("h1").text(currentwallet+" 钱包")

    //查询余额
    let params = {"walletname":currentwallet}
    $.post("/wallet/balance", params, function(res, state){
        console.log(res, state);
        $("#balance").text(res.data.totalAmount/100000000)
        $("#unc_balance").text(res.data.lockedAmount/100000000)
    })

    updateWalletAddressList()

})

function updateWalletAddressList() {
    let params = {"walletname":currentwallet}
    $.post("/wallet/address", params, function(res, state) {
        console.log("updateWalletAddressList:")
        console.log(res, state);
        if(res.data.length>0){
            let mainAddress = res.data[0].address
            $("#main-address").text(mainAddress)
        } else {
            $("#main-address").text("Error：未建账号地址")
        }

        let addressTable = $("#address-list-table")
        addressTable.empty()
        res.data.forEach(element => {
            let account = element
            let accountTr = `<tr>
                    <td>${account.path.slice(2)}</td>
                    <td>${account.address}</td>
                    <td><button onclick="exportPrivatekey('${currentwallet}','${account.path}')">导出私钥</button></td>
                    </tr>`
            addressTable.append(accountTr)
        });
    })
}

function createSubAddress() {
    let params = {"walletname":currentwallet}
    $.post("/wallet/newsubaddress", params, function(res, state){
        console.log("newsubaddress:")
        console.log(res, state)
        if(res.code == 0) {
            updateWalletAddressList()
        }
    })
}

function exportPrivatekey(walletname, path) {
    let password = prompt("请输入该钱包的密码")
    if (password) {
        let params = {
            "walletname": walletname,
            "password": password, //这个其实不需要！
            "childpath":path
        }

        $.post("/export/privatekey", params, function(res, state){
            console.log("exportPrivatekey:")
            console.log(res, state)
            if(res.code == 0) {
                alert(res.data)
            }
        })
    }
}