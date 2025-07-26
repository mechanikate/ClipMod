const myMod = new Mod("exampleMod", {major: 1, minor: 0, patch: 0});
myMod.addProject(
	"AutoClipper Shenanigans", // project name
	"Adds 500 clippers and gives you 2,000 yomi", // project description
	{operations:1000,trust:1,clipmakerLevel:1,yomi:1000}, // project price (the things you actually have to lose to get the project)
	{operations:500}, // project requirements (the things to show the project in the list of projects, happens usually before price is met)
	"This seems silly", // what to output in the console display thing?
	() => { // what to run when bought
		yomi += 2000;
		clipmakerLevel += 500;
	}
);
myMod.addProject(
	"Temporal Nullification",
	"Bring the universe back to the start of your playthrough",
	{
		operations:10000,
		custom:{
			description: "no available matter left",
			f: () => availableMatter == 0
		}
	},
	{
		custom: {
			f: () => availableMatter <= 1e15
		}
	},
	"Reverting time...",
	reset
);
myMod.addStrategy(
	"ENIGMA", // strat name
	()=>{ // function that determines which option to pick (cooperate or defect)
		const biggestPayoff = findBiggestPayoff(); // base function from GREEDY to find the biggest payoff option
		const greedyFactor = Math.random() >= 0.1; // will we be greedy?
		if(biggestPayoff == 1 || biggestPayoff == 3) return greedyFactor ? 1 : 2; // GENEROUS is the polar oppposite of GREEDY, so we can just use a ternary operator to swap between them, combined with the base logic from the GREEDY strat for the rest of this function
		return greedyFactor ? 2 : 1;
	},
	"Be GREEDY 90% of the time and GENEROUS the other 10%", // description for the project (if you make one, which you should)
	{
		operations: 5000,
		projecta: ["projectButton60"]
	},
	{ // list of dependencies in "projects" ID array that must be bought before this
		operations: 1000,
		projects: ["projectButton60"] // this is the ID for "New Strategy: A100"
	}
);
