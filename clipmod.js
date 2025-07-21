/**
 * Welcome to the ClipMod source!
 * This is an on-and-off hobby project by mechanikate. Don't expect frequent updates because I get distracted.
 * Your most useful resource, as of now, will be exampleMod.js 
 */

const clipmodVersion = "v1.1.0"; // version of ClipMod!
const setIfBlank = (val, defaulting) => (val == undefined || (Array.isArray(val) && val.length == 0) || (typeof val === "number" && isNaN(val)) || val == null) ? defaulting : val;
let clipHooks = [ // functions to run on window load
	() => { // Log that ClipMod is done loading here
		console.log("(ClipMod) Disabling cheats by default (toggle with `toggleCheats();`)");
		toggleCheats(false);
		console.log("(ClipMod) Cheats disabled.");
	} 
];
let moddedPurchased = []; // all purchased project *ids* go here!
let moddedProjects = {}; // stores all of the projects made by ClipMod mods
let installedModids = ["clipmod"]; // base library is all it starts with
let boughtStrats = [];
let installedModUrls = [
	...new Set(JSON.parse(setIfBlank(localStorage.getItem("installedModUrls"), `["./modmenu.js"]`)))
];
let resetHooks = [
	() => localStorage.removeItem("installedModUrls")
];
let [cheatClips, cheatMoney, cheatTrust, cheatOps, cheatCreat, cheatYomi, cheatHypno, zeroMatter] = [ // All of the cheating functions implemented from base game but with variable amounts to cheat in as parameters. Defaults are set to base game defaults
	(amt = 1e8) => {clips 		+= 	amt;																				},
	(amt = 1e7) => {funds 		+= 	amt;																				},
	(amt = 1  ) => {trust 	   	+= 	amt;																				},
	(amt = 1e4) => {standardOps += 	amt;					  															},
	(amt = 1e3) => {creativity 	+= 	amt; 	creativityOn = 1;															},
	(amt = 1e6) => {yomi 		+=	amt;  	document.getElementById("yomiDisplay").innerHTML = yomi.toLocaleString();	},
	(		  ) => {						hypnoDroneEvent();															},
	(		  ) => {availableMatter = 0;																				}

];
const clipInit = () => {
    console.log("(ClipMod) Loading hooks...");
    clipHooks.forEach(hook => hook()); // run each hook on init
    console.log("(ClipMod) Hooks done."); // alert the user we're all ready
};
const addCommas = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // formats numbers (e.g. from 2500000.32 --> 2,500,000.32)from https://stackoverflow.com/a/2901298
const isPurchased = (modid, pid) => !!moddedProjects[modid][pid].obj.flag; // is this project purchased? we have to use !! here because the flag value is 0 or 1, not false or true
const isPurchasedVanilla = id => !!(setIfBlank(projects.filter(idToCompare => id == idToCompare.id), [{flag: 0}])[0].flag);
const sufficient = (balance, price) => (typeof price === "number" && typeof balance === "number") ? balance>=price : true; // if any of price or balance aren't a number, return true as they aren't a requirement. otherwise, compare the prices and return if the player has enough
const clampIfNaN = x => typeof x === "number" ? x : 0; // if it is a number, keep. if it isn't a number, set to 0.
const toggleCheats = (toggle=true) => [...document.getElementsByClassName("cheatButtons")].forEach(e => e.style.display=toggle ? "inline-block" : "none");
const toggleModMenu = (toggle=false) => document.getElementById("modManagerDiv").style.display=toggle ? "inline-block" : "none";
const loadMod = (url="./exampleMod.js") => {
	installedModUrls.push(url);
	installedModUrls = [...new Set(installedModUrls)];
	localStorage.setItem("installedModUrls", JSON.stringify(installedModUrls));
	window.location.reload();
};
const removeMod = (index=0) => {
	installedModUrls.splice(index, 1);
	localStorage.setItem("installedModUrls", JSON.stringify(installedModUrls));
	window.location.reload();
};
class Mod {
	constructor(modid) {
		this.modid = modid;
		this.basePid = 1;
		this.hooks = [];
		this.projects = [];
		this.strats = [];
	}
	addProject(name, description, price, requirement, display, todo) {
		let ourProject = new Project(name, description, this.basePid, price, requirement, display, todo, this.modid);
		this.projects.push(ourProject);
		clipHooks.push(() => ourProject.setup());
		this.basePid++;
		return this;
	}
	addStrategy(name, moveFunction, moveDescription, price, requirement) {
		let ourStrat = new Strategy(name, moveFunction, moveDescription, this.basePid, this.modid);
		let ourProject = ourStrat.toProject(requirement, price);
		this.strats.push(ourStrat);
		this.projects.push(ourProject);
		clipHooks.push(() => ourProject.setup());
		this.basePid++;
		return this;
	}
	addHook(func) { // runs on load
		clipHooks.push(func);
		return this;
	}
	addResetHook(func) { // runs on reset
		resetHooks.push(func);
		return this;
	}
}
class Project {
	constructor(name, description, pid, price, requirement, display, todo, modid, isStrat=false, stratOnlyParams=null) {
		this.name = name;
		this.description = description;
		this.pid = pid;
		this.price = price;
		this.requirement = requirement;
		this.display = display;
		this.uses = 1;
		this.todo = todo;
		this.modid = modid;
		this.isStrat = isStrat;
		this.obj = {};
		if(!installedModids.includes(this.modid)) installedModids.push(this.modid);
		if(this.isStrat) this.stratOnlyParams = stratOnlyParams;
	}
	priceTag() { // add all the price strings to a list, then join with commas and surround with parantheses
		let result = [];
		if(typeof this.price["operations"] === "number") result.push(`${addCommas(this.price["operations"])} ops`);
		if(typeof this.price["trust"] === "number") result.push(`${addCommas(this.price["trust"])} trust`);
		if(typeof this.price["mws"] === "number") result.push(`${addCommas(this.price["mws"])} MW-seconds`);
		if(typeof this.price["yomi"] === "number") result.push(`${addCommas(this.price["yomi"])} yomi`);
		if(typeof this.price["honor"] === "number") result.push(`${addCommas(this.price["honor"])} honor`);
		if(typeof setIfBlank(this.price["custom"], {description: null}).description === "string") result.push(this.price["custom"].description);
		if(!result.length) return "";
		return `(${result.join(", ")})`;
	}
	setup() {
		this.obj.id = this.modid+"Button"+this.pid; // somewhat similar to base game naming scheme, what is the element ID for the project? in the base game, this is projectButton___, where the underscores are just an integer
		this.obj.title = this.name+" "; // all of the base game titles have a space at the end, so why not keep the consistency and do it here? 
		this.obj.priceTag = this.priceTag(); // price tag next to the title (e.g. "(10,000 ops, 10 trust, 5,000 MW-seconds)", etc.)
		this.obj.description = this.description; // text below the title and price tag to describe what this does
 		// self-explanatory, eventually all of these shouldn't need variable names for things starting local but I don't feel like changing this for now
		var localOperations = this.requirement["operations"];
		var localOperationsPrice = this.price["operations"];
		var localTrust = this.requirement["trust"];
		var localTrustPrice = this.price["trust"];
		var localClipmakerLevel = this.requirement["clipmaker_level"];
		var localClipmakerLevelPrice = this.price["clipmaker_level"];
		var localMWs = this.price["mws"];
		var localMWsPrice = this.requirement["mws"];
		var localYomi = this.requirement["yomi"];
		var localYomiPrice = this.price["yomi"];
		var localHonor = this.requirement["honor"];
		var localHonorPrice = this.price["honor"];
		var localProjects = this.requirement["projects"];
		var localCustom = this.requirement["custom"];
		var localCustomPrice = this.price["custom"];
		this.obj.trigger = () => { // if this returns true, show the project in the purchasables list. different from "cost" which is what you actually need to buy it, this is just when to show it
			if(this.obj.flag) false;
		    return  sufficient(operations,      localOperations			) 
		        &&  sufficient(trust,           localTrust				)
		        &&  sufficient(clipmakerLevel,  localClipmakerLevel		)
		        &&  sufficient(storedPower,     localMWs				)
		        &&  sufficient(yomi,            localYomi				)
				&& 	sufficient(honor,			localHonor				)
				&& 	(Array.isArray(localProjects) ? !localProjects.filter(e => !isPurchasedVanilla(e)).length : true)
				&&  setIfBlank(localCustom,		{f:()=>true}			).f();
		};
		this.obj.uses = this.uses;
		this.obj.cost = () => { // can we buy this thing?
	        return  sufficient(operations,      localOperationsPrice    ) 
		        &&  sufficient(trust,           localTrustPrice         )
		        &&  sufficient(clipmakerLevel,  localClipmakerLevelPrice)
		        &&  sufficient(storedPower,     localMWsPrice           )
		        &&  sufficient(yomi,            localYomiPrice          )
				&& 	sufficient(honor,			localHonorPrice			)
				&& 	setIfBlank(localCustomPrice,{f:()=>true}			).f();
		};
		this.obj.flag = +moddedPurchased.includes(this.obj.id); // unary plus (+moddedPurch...) converts true/false to 1/0 respectively. otherwise, this just gets if we've already bought this and returns 1 if so to make sure we don't show it for purchase multiple times
		this.obj.effect = () => { // on purchase events
			this.obj.flag = 1;
			displayMessage(this.display);
			this.todo(this.isStrat ? this.stratOnlyParams : this);
			standardOps -= clampIfNaN(this.price["operations"]); // spend ops
			trust -= clampIfNaN(this.price["trust"]); // spend trust
			yomi -= clampIfNaN(this.price["yomi"]); // spend yomi
			storedPower -= clampIfNaN(this.price["mws"]*1e6); // spend MWs, convert MWs to Ws as the game uses
			var element = document.getElementById(this.obj.id); // shenanigans from base game, basically just removes the project from the project list
			element.parentNode.removeChild(element);
			var index = activeProjects.indexOf(this.obj);
			activeProjects.splice(index, 1);
			moddedPurchased.push(this.obj.id); // locally add our project's id to the moddedPurchased list to make sure it doesn't accidentally show up in available projects again
		};
		if(!this.obj.flag) projects.push(this.obj); // add our project to the master list of projects if it hasn't already been bought
		moddedProjects[this.modid] = moddedProjects[this.modid] == undefined ? {} : moddedProjects[this.modid]; // validation to make sure moddedProjects[this.modid] isn't blank, this just fixes that case
		moddedProjects[this.modid][this.pid] = { // add to our list of moddedProjects for referencing for debugging and other shenanigans
			"class": this, // actual reference to class
			"obj": this.obj // internal format of projects (dictionary)
		};
		return this; // return back this class for further work/chaining
	}	
}
class Strategy { // implementing custom Strategic Modeling strats
	constructor(name, // name of the strategy, usually all caps (e.g. TIT FOR TAT)
				moveFunction, // should only ever return 1 (for left/top) or 2 (for bottom/right)
				moveDescription, // how does this strat work in layman's terms? it's okay to simplify as per the base game's descriptions
				pid, // same rules as Project pid and shares the need for separate pids with Project
				modid) { // the name of the mod adding this strat
		this.name = name;
		this.moveFunction = moveFunction; 
		this.desc = moveDescription;
		this.pid = pid;
		this.modid = modid;
	}
	setup() {
		let _this = this;
		let len = strats.length;
		allStrats.push({
			active: 0,
			currentPos: 1,
			currentScore: 0,
			name: _this.name,
			pickMove: () => _this.moveFunction(strats[len].currentPos),
			modid: _this.modid,
			pid: _this.pid
		});
		if(boughtStrats.filter(e => e.modid == _this.modid && e.pid == _this.pid).length > 0) this.addStrat(); // add the strat if it's already bought
	}
	addStrat(_this=this) {
		let len = strats.length;
		strats.push({
			active: 1, // add the strat as active to the list of strats
			currentPos: 1, // default in vanilla
			currentScore: 0, // default in vanilla
			name: _this.name,
			pickMove: () => _this.moveFunction(strats[len].currentPos), // usually currentPos is under this (e.g. this.currentPos in the move functions in base game) but this doesn't work in our case so we pass it via a parameter
			modid: _this.modid,
			pid: _this.pid
		});
		var stratList = document.getElementById("stratPicker"); // add the strat to the pick strat dropdown
		var el = document.createElement("option");
		el.textContent = _this.name;
		el.value = len;
		stratList.appendChild(el);
		if(boughtStrats.filter(e => e.modid == _this.modid && e.pid == _this.pid).length == 0) boughtStrats.push({
			modid: _this.modid,
			pid: _this.pid
		});
	}
	toProject(price, requirements) {
		let _this = this; // "this" breaks here so we make a different variable equal to the class' this attribute named _this
		this.setup();
		return new Project(
			"New Strategy: "+_this.name, // base format by vanilla game
			this.desc,
			this.pid,
			requirements,
			price,
			this.name+" added to strategy pool",
			this.addStrat,
			this.modid,
			true,
			_this
		);
	}
};
installedModUrls.forEach(url => {
	let script = document.createElement("script");
	script.src = url;
	script.onload = () => displayMessage(`Loaded mod @ ${url}`);
	document.head.appendChild(script);
});
window.onload = () => {
	clipInit(); // Run all the hooks
	displayMessage(`ClipMod enabled (${clipmodVersion})`) // Display a message in the game "console" that ClipMod is all ready
	displayMessage(`Installed mods: ${installedModids.join(", ")}`);
};
