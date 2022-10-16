require("dotenv").config()

const Web3 = require("web3")
const EthereumTransaction = require("ethereumjs-tx").Transaction
const ganacheUrl = "HTTP://127.0.0.1:7545"
const testNetUrl = process.env.GOERLI_INFURA_ENDPOINT
const web3 = new Web3(testNetUrl)
const sendingAddress = "0x2da4393b247B4A33575FacCF6b7614D44b8088Ce"
const receivingAddress = "0x86D516E75bA85bB43e07C9E32c515EB14a7073BB"

const getBalance = async () => {
    const balance1 = await web3.eth.getBalance(sendingAddress)
    console.log("balance sending address in Ether: ", web3.utils.fromWei(balance1, "ether"))
    const balance2 = await web3.eth.getBalance(receivingAddress)
    console.log("balance sending address in Ether: ", web3.utils.fromWei(balance2, "ether"))
}
// send 0.05 ETH
let amount = 50000000000000000
let amountHex = "0x" + amount.toString(16)

// retrieve nonce
const getNonce = async (add) => {
    let nonce = await web3.eth.getTransactionCount(add)
    return nonce
    // console.log(nonce);
}

const app = async () => {
    await getBalance()
    let nonce = await getNonce(sendingAddress)
    console.log("nonce of sending address is: ", nonce);
    let nonceHex = "0x" + nonce.toString(16)
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
    const privateKeySender = process.env.SENDER_ACCOUNT_PRIVATE_KEY
    const privateKeySenderHex = Buffer.from(privateKeySender, "hex")
    const transaction = new EthereumTransaction(rawTransaction)
    transaction.sign(privateKeySenderHex)
    const serializedTransaction = transaction.serialize()
    console.log("serialized transaction", serializedTransaction);
    await web3.eth.sendSignedTransaction(serializedTransaction)
    getBalance()

}

app()
