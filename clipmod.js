/**
 * Welcome to the ClipMod source!
 * This is an on-and-off hobby project by mechanikate. Don't expect frequent updates because I get distracted.
 * Your most useful resource, as of now, will be exampleMod.js 
 */
var clipHooks = [];
var moddedPurchased = [];
clipHooks.push(() => {
	console.log("ClipMod enabled.");
});

const clipInit = () => {
    console.log("(ClipMod) Loading hooks...")
    clipHooks.forEach(hook => hook()); // run each hook on init
    console.log("(ClipMod) Hooks done."); // alert the user we're all ready
}
const sufficient = (balance, price) => (typeof price === "number" && typeof balance === "number") ? balance>=price : true; // if any of price or balance aren't a number, return true as they aren't a requirement. otherwise, compare the prices and return if the player has enough
const clampIfNaN = x => typeof x === "number" ? x : 0; // if it is a number, keep. if it isn't a number, set to 0.
class Project {
	constructor(name, description, pid, price, requirement, display, todo, modid) {
		this.name = name;
		this.description = description;
		this.pid = pid;
		this.price = price;
		this.requirement = requirement;
		this.display = display;
		this.uses = 1;
		this.todo = todo;
		this.modid = modid;
		this.obj = {};
		
	}
	priceTag() {
		let result = [];
		if(typeof this.price["operations"] === "number") result.push(`${this.price["operations"]} ops`);
		if(typeof this.price["trust"] === "number") result.push(`${this.price["trust"]} trust`);
		if(typeof this.price["mws"] === "number") result.push(`${this.price["mws"]} MW-seconds`);
		if(typeof this.price["yomi"] === "number") result.push(`${this.price["yomi"]} yomi`);
		if(typeof this.price[""])
		if(!result.length) return "";
		return `(${result.join(", ")})`;
	}
	setup() {
		this.obj.id = this.modid+"Button"+this.pid;
		this.obj.title = this.name+" ";
		this.obj.priceTag = this.priceTag();
		this.obj.description = this.description;
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
		this.obj.trigger = () => {
		    return  sufficient(operations,      localOperations) 
		        &&  sufficient(trust,           localTrust)
		        &&  sufficient(clipmakerLevel,  localClipmakerLevel)
		        &&  sufficient(storedPower,     localMWs)
		        &&  sufficient(yomi,            localYomi);
		};
		this.obj.uses = this.uses;
		this.obj.cost = () => {
	        return  sufficient(operations,      localOperationsPrice    ) 
		        &&  sufficient(trust,           localTrustPrice         )
		        &&  sufficient(clipmakerLevel,  localClipmakerLevelPrice)
		        &&  sufficient(storedPower,     localMWsPrice           )
		        &&  sufficient(yomi,            localYomiPrice          );
		};
		this.obj.flag = +moddedPurchased.includes(this.obj.id);
		this.obj.effect = () => {
			this.obj.flag = 1;
			displayMessage(this.display);
			this.todo();
			standardOps -= clampIfNaN(this.price["operations"]);
			trust -= clampIfNaN(this.price["trust"]);
			yomi -= clampIfNaN(this.price["yomi"]);
			storedPower -= clampIfNaN(this.price["mws"]*1e6); // convert MWs to Ws as the game uses
			var element = document.getElementById(this.obj.id);
			element.parentNode.removeChild(element);
			var index = activeProjects.indexOf(this.obj);
			activeProjects.splice(index, 1);
			moddedPurchased.push(this.obj.id);
		}
		if(!this.obj.flag) projects.push(this.obj);
		return this;
	}	
}
window.onload = () => {
	clipInit();
}
