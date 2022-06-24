//imports
const {ethers,run, network} = require("hardhat");

//async main function
async function main() {

//=========> Deploying the contract
  const SimpleStorageFactory = await ethers.getContractFactory(
    "SimpleStorage"
  )
  console.log("Deploying contract ...");

  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to: ${simpleStorage.address}`);
  
  //==============>Verifying the contract
    //check if network is testnet and API key exists
  if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    //Wait for the contract to get confirmed, wait 6 blocks
    await simpleStorage.deployTransaction.wait(6);

    //==============>verify contract
    await verify(simpleStorage.address,[]);
  }


  //===============>Interacting with the smart contract

  //get the current value
  const currentValue = await simpleStorage.retrieve();
  console.log(`Current value is: ${currentValue}`);

  //update the current value
  const transactionResponse = await simpleStorage.store(7)
  await transactionResponse.wait(1)
  const updatedValue = await simpleStorage.retrieve();
  console.log(`Updated Value is: ${updatedValue}`);
}

async function verify(contractAddress, args){
  console.log("Verifying Contract...");
  try{
  await run("verify:verify", {
    address: contractAddress,
    constructor: args,
  });
} catch(e){
  if(e.message.toLowerCase().includes("already verified")){
    consle.log("Already verified")
  }else{
    console.log(e);
  }
}
}

//main
main().then(() => process.exit(0)).catch((error)=>{
  console.error(error);
  process.exit(1);
})