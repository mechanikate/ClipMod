const projectListLocal = []; // debugging var to make sure the generated obj object is correct
clipHooks.push(() => {
	projectListLocal.push(
		new Project(
			"Example AutoClipper Project", // project display name in listing (bolded) 
			"Foos and bars and the clippers", // project description in listing (not bolded)
			1, // what # id should this be? all you have to make sure is that this id is different than all your other project ids 
			{operations:1000,trust:1,clipmakerLevel:1,yomi:1000}, // when can you buy this project? first the amount, then the unit
			{operations:500}, // when can you see this in your project list? first the amount, then the unit
			"This seems silly", // text to send in "console" when bought
			() => { // what to change, this can be literally any JS function
				yomi += 1000; // this gives you 1000 yomi
				clipmakerLevel += 500; // this makes you have 500 more autoclippers
			},
			"obsceneMod" // what mod does this project belong to?
		)
		.setup(), // add this project to the list contenders
		new Project( // this project resets the game if your available matter is at 0 and if you have 10k ops
			"Temporal Nullification", 
			"Bring the universe back to the start of your playthrough",
			3,
			{
				operations:10000,
				custom:{
					description:"no available matter left", // label to add to the price tag, so the title will appear as: "Temporal Nullification (10,000 ops, no available matter left)"
					f:() => availableMatter == 0 // is the available matter at exactly 0? if so, allow them to buy (if they also have 10k ops)
				}
			},
			{
				custom:{
					f:() => availableMatter <= 1e15 // is the available matter less than 1 quintillion grams (1e+15 g)? return true if so, adding it to the list. otherwise, return false and don't show to the player yet
				}
			},
			"Resetting...", // display "Resetting..." in the display terminal
			reset, // this is the base game function to reset your save 
			"obsceneMod" // mod ID
		)
		.setup()
	); // push this to a local variable for debugging
	new Strategy(
		"ENIGMA", // name of the strategy
		(a)=>{ // function that determines which option to pick (cooperate or defect)
			const biggestPayoff = findBiggestPayoff(); // base function from GREEDY to find the biggest payoff option
			const greedyFactor = Math.random() >= 0.1; // will we be greedy?
			if(biggestPayoff == 1 || biggestPayoff == 3) return greedyFactor ? 1 : 2; // GENEROUS is the polar oppposite of GREEDY, so we can just use a ternary operator to swap between them, combined with the base logic from the GREEDY strat for the rest of this function
			return greedyFactor ? 2 : 1;
		}, 
		"Be GREEDY 90% of the time and GENEROUS the other 10%", // description for the project (if you make one, which you should)
		2, // project ID, SHARED WITH PROJECTS! thus you can't have a project with pid=2 and a strat with pid=2. this will cause issues
		"obsceneMod" // mod ID
	)
	.toProject( // convert this to a project to enable buying the strat
		5000, // ops required to buy
		[ // list of dependencies in "projects" ID array that must be bought before this
			"projectButton60" // this is the ID for "New Strategy: A100"
		]
	)
	.setup(); // add the project and set up the strategy in the allStrats array
}); // push into the hooks

