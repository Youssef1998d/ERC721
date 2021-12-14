const Str = require('@supercharge/strings')

var TDErc20 = artifacts.require("ERC20TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");
var IExerciceSolution = artifacts.require("IExerciceSolution.sol");

const account = "0xe635ea4e9a4b3f6819e28948efc4ad70b302095a"
const erc20Address = "0x8B7441Cb0449c71B09B96199cCE660635dE49A1D"
const eval1Address = "0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E"
const eval2Address = "0x4f82f7A130821F61931C7675A40fab723b70d1B8"

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts);
		await work(deployer, network, accounts);
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.at(erc20Address)
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.at(eval1Address)
	Evaluator2 = await evaluator2.at(eval2Address)
}

async function deploySolution(deployer, network, accounts, name, symbol) {
	Solution = await IExerciceSolution.new(name, symbol, web3.utils.toBN(web3.utils.toWei('0.001', "ether")), {from: account})
}

async function work(deployer, network, accounts) {
	const startBalance = await TDToken.balanceOf(account)
	console.log("initBalance " + startBalance)


	// Submit Exercise
	await deploySolution(deployer, network, accounts, "Youssef", "Drira")
	await Evaluator.submitExercice(Solution.address , {from:account})
	const submit_balance = await TDToken.balanceOf(account)
	console.log("balance " + submit_balance)

	// 1
	await Solution.mint(Evaluator.address, {from:account})
	await Evaluator.ex1_testERC721({from:account})
	const ex1_balance = await TDToken.balanceOf(account)
	console.log("ex1_balance " + ex1_balance)

	// 2
	await Evaluator.ex2a_getAnimalToCreateAttributes({from:account})
	const name = await Evaluator.readName(account, {from:account})
	const legs = await Evaluator.readLegs(account, {from:account})
	const sex = await Evaluator.readSex(account, {from: account})
	const wings = await Evaluator.readWings(account, {from: account})
	const nft2 = await createAnNft(Evaluator.address, sex, legs, wings, name);
	await Evaluator.ex2b_testDeclaredAnimal(nft2, {from: account})
	const ex2_balance = await TDToken.balanceOf(account)
	console.log("ex2_balance " + ex2_balance)

	// 3
	await web3.eth.sendTransaction({from:account,to:Evaluator.address, value:web3.utils.toBN(web3.utils.toWei('0.01', "ether"))});
	await Evaluator.ex3_testRegisterBreeder({from:account})
	const ex3_balance = await TDToken.balanceOf(account)
	console.log("ex3_balance " + ex3_balance) 

	// 4
	await Evaluator.ex4_testDeclareAnimal({from:account});
	const ex4_balance = await TDToken.balanceOf(account)
	console.log("ex4_balance " + ex4_balance)

	// 5
	await Solution.mint(account, {from:account})
	await Evaluator.ex5_declareDeadAnimal({from: account});
	const ex5_balance = await TDToken.balanceOf(account)
	console.log("ex5_balance " + ex5_balance)

	// 6
	await createAnNft(Evaluator.address);
	await Evaluator.ex6a_auctionAnimal_offer({from: account})
	const nft3 = await createAnNft();
	await Solution.offerForSale(nft3, web3.utils.toBN(web3.utils.toWei('0.0001', "ether")), {from: account})
	await Evaluator.ex6b_auctionAnimal_buy(nft3, {from: account})
	const ex6_balance = await TDToken.balanceOf(account)
	console.log("ex6_balance " + ex6_balance)

	//2nd section
	await Evaluator2.submitExercice(Solution.address , {from:account})
	await web3.eth.sendTransaction({from:account,to:Evaluator2.address, value:web3.utils.toBN(web3.utils.toWei('0.005', "ether"))});

	// 7
	await Evaluator2.ex2a_getAnimalToCreateAttributes({from: account})
	await Solution.declareAsBreeder(Evaluator2.address, {from: account})
	const parent1 = await createAnNft(Evaluator2.address);
	const parent2 = await createAnNft(Evaluator2.address);
	await Evaluator2.ex7a_breedAnimalWithParents(parent1, parent2, {from: account})
	const ex7a_balance = await TDToken.balanceOf(account)
	console.log("7a_balance " + ex7a_balance)

	await Evaluator2.ex7b_offerAnimalForReproduction()
	const ex7b_balance = await TDToken.balanceOf(account)
	console.log("7b_balance " + ex7b_balance)

	const animalForReproduction = await createAnNft();
	await Solution.offerForReproduction(animalForReproduction, web3.utils.toBN(web3.utils.toWei('0.0001', "ether")));
	await Evaluator2.ex7c_payForReproduction(animalForReproduction);
	const ex7c_balance = await TDToken.balanceOf(account);
	console.log("7c_balance " + ex7c_balance);
}


const createAnNft = async (to = account, sex = 1, legs = 4, wings = false, name = "mokrez") => {
	await Solution.declareAnimalToSomeone(sex, legs, wings, name, to, {from: account})
	return await Solution.getCurrentId();
}