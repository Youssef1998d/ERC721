const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var erc = artifacts.require('IExerciceSolution.sol');


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        // await deployTDToken(deployer, network, accounts); 
        // await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts); 
        // await deployRecap(deployer, network, accounts); 
		// await test(deployer, network, accounts);
		await interact(deployer, network, accounts);
		await test(deployer, network, accounts);  
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*1000000000))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function test(deployer, network, accounts){
		// EX7a
		await Evaluator.ex6a_auctionAnimal_offer();
		getBalance = await TDToken.balanceOf(accounts[0]);
		console.log("Ex5 Balance " + getBalance.toString());
	
		// EX7b
		await Evaluator.ex6a_auctionAnimal_offer();
		getBalance = await TDToken.balanceOf(accounts[0]);
		console.log("Ex5 Balance " + getBalance.toString());
	
		// EX7c
		await Evaluator.ex6a_auctionAnimal_offer();
		getBalance = await TDToken.balanceOf(accounts[0]);
		console.log("Ex5 Balance " + getBalance.toString());
}

async function interact(deployer, network, accounts){
	TDToken = await TDErc20.at("0xa741a92358D2A5b7E42A8dd644b38f7F97c3C98E")
	Evaluator = await evaluator.at("0xf64F129dD07ED2360e30B657D2916947E8C7273B")
}
