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
		.setup() // add this project to the list contenders
	); // push this to a local variable for debugging
}); // push into the hooks

// Cheating functions for testing from base game, ignore:
function cheatClips() {
    clips = clips + 100000000;
    unusedClips = unusedClips + 100000000;
    displayMessage("you just cheated");
}

function cheatMoney() {
    funds = funds + 10000000;
    document.getElementById("funds").innerHTML = funds.toFixed(2);
    displayMessage("LIZA just cheated");
}

function cheatTrust() {
    trust = trust+1;
    displayMessage("Hilary is nice. Also, Liza just cheated");
}

function cheatOps() {
    standardOps = standardOps + 10000;
    displayMessage("you just cheated, Liza");
}

function cheatCreat() {
    creativityOn = 1;
    creativity = creativity + 1000;
    displayMessage("Liza just cheated. Very creative!");
}

function cheatYomi() {
    yomi = yomi + 1000000;
    document.getElementById("yomiDisplay").innerHTML = yomi.toLocaleString();
    displayMessage("you just cheated");
    }

function cheatHypno() {
    hypnoDroneEvent();
}

function zeroMatter() {
    availableMatter = 0;
    displayMessage("you just cheated");
}