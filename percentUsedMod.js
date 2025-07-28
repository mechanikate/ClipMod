const percentUsedMod = new Mod("percentUsedMod", {major: 0, minor: 1, patch: 1});
let ele = document.createElement("span");
ele.id="percentUsedClips";
ele.innerHTML = "&nbsp;(0% unused)";
percentUsedMod.addHook(() => {
	document.getElementById("unsoldClips").parentNode.insertBefore(ele, document.getElementById("unsoldClips").nextSibling);
});
percentUsedMod.addTickHook(() => {
	var percent = unsoldClips/clips*100;
	if(isNaN(percent)) percent = 0;
	var orderOfMagnitude = Math.max(0,Math.floor(Math.abs(Math.log10(percent))));
	if(!isFinite(orderOfMagnitude)) orderOfMagnitude = 0;
	ele.innerHTML = `&nbsp;(${(percent).toFixed(orderOfMagnitude)}% unused)`;
});
