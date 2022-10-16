require("dotenv").config()
console.log(process.env);

const Web3 = require("web3")
const EthereumTransaction = require("ethereumjs-tx").Transaction
const ganacheUrl = "HTTP://127.0.0.1:7545"
const web3 = new Web3(ganacheUrl)
const sendingAddress = process.env.GANACHE_ADDRESS_1
const receivingAddress = process.env.GANACHE_ADDRESS_2




const getBalance = async () => {
    const balance1 = await web3.eth.getBalance(sendingAddress)
    console.log("balance sending address", balance1);
    const balance2 = await web3.eth.getBalance(receivingAddress)
    console.log("balance receiving address", balance2);
}
// send 0.5 ETH
let amount = 500000000000000000
let amountHex = "0x" + amount.toString(16)

// retrieve nonce
const getNonce = async (add) => {
    let nonce = await web3.eth.getTransactionCount(add)
    return nonce
    // console.log(nonce);
}




// const rawTransaction = {
//     nonce: "0x04",
//     to: receivingAddress,
//     gasPrice: "0x20000000",
//     gasLimit: "0x30000",
//     value: amountHex,
//     data: "0x000"
// }





const app = async () => {
    await getBalance()
    let nonce = await getNonce(sendingAddress)
    console.log(nonce);
    let nonceHex = "0x" + nonce.toString(16)
    console.log(nonceHex);
    let gasPrice = await web3.eth.getGasPrice()
    let gasPriceHex = "0x" + gasPrice.toString(16)
    console.log("gas price - decimal: ", gasPrice);
    console.log("gas price - hex: ", gasPriceHex);

    const rawTransaction = {
        nonce: nonceHex,
        to: receivingAddress,
        gasPrice: gasPriceHex,
        gasLimit: "0x30000",
        value: amountHex,
        data: "0x0"
    }
    const privateKeySender = "b7045830126ae87dbb0ef8dcbef46468afb3b8fd58629b281f0f929b96a66c2a"
    const privateKeySenderHex = Buffer.from(privateKeySender, "hex")
    console.log(privateKeySenderHex);
    const transaction = new EthereumTransaction(rawTransaction)
    transaction.sign(privateKeySenderHex)
    const serializedTransaction = transaction.serialize()
    await web3.eth.sendSignedTransaction(serializedTransaction)
    getBalance()

}

app()
