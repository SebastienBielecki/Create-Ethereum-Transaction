// THIS IS THE LEGACY FORM TO SEND TRANSACTIONS
// Loading dependencies
require("dotenv").config()
const fs = require( 'fs' ).promises;
const Web3 = require( 'web3' );
const HDWalletProvider = require( '@truffle/hdwallet-provider' );
const Transaction = require('ethereumjs-tx').Transaction;
const Common = require('ethereumjs-common').default;
async function main () {  
    // Infura rinkeby's url
    const infuraGoerliUrl = process.env.GOERLI_INFURA_ENDPOINT;
    // Generating bip39 mnemonic
    // const mnemonic = mnemonicGenerate();
    // save the mnemonic in a JSON file in your project directory
    // console.log(mnemonic);
    // Loading previously generated mnemonic
    const mnemonicPhrase = process.env.MNEMONIC
    // Generating provider
    
    const provider = new HDWalletProvider( {
        mnemonic: {
            phrase: mnemonicPhrase
        }, 
        providerOrUrl: infuraGoerliUrl} );
   
    const web3 = new Web3( provider );
    // Declaring rinkeby testnet
    const chain = new Common( 'goerli', 'byzantium');
    // Getting sending and receiving addresses
    //YOU CAN CHANGE 0 TO SELECT OTHER ADDRESSES
    const sendingAddress = ( await web3.eth.getAccounts() )[0]; 
    const receivingAddress = ( await web3.eth.getAccounts() )[1]; 
    // Getting the private key for the account
    const preKey = process.env.SENDER_ACCOUNT_PRIVATE_KEY;
    const privateKey = Buffer.from( preKey , 'hex' );
    // Constructing the raw transaction
    let gasPrice = await web3.eth.getGasPrice()
    let gasPriceHex = "0x" + gasPrice.toString(16)
    console.log(gasPrice);
    console.log(gasPriceHex);
    const rawTx = {
        from        :   web3.utils.toHex( sendingAddress ),
        to          :   web3.utils.toHex( receivingAddress ),
        gasPrice    :   web3.utils.toHex( gasPrice ),
        gasLimit    :   web3.utils.toHex( 200000 ),
        value       :   web3.utils.toHex( web3.utils.toWei( '0.005' , 'ether' ) ),
        data        :   web3.utils.toHex( 'Hello World!' ),
        nonce       :   web3.utils.toHex( await web3.eth.getTransactionCount( 
                                          sendingAddress ,
                                          'pending'
                                         ) ),
    };
    // Creating a new transaction
    const tx = new Transaction( rawTx , { common : chain } );
    // Signing the transaction
    tx.sign( privateKey );
    // Sending transaction
    await web3.eth.sendSignedTransaction( '0x' + tx.serialize().toString( 'hex' ) )
    .on('receipt', console.log)
    .on('transactionHash', console.log);
}
main().catch((error) => {
  console.error(error);
});