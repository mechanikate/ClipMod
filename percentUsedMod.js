const percentUsedMod = new Mod("percentUsedMod", {major: 0, minor: 1, patch: 0});
let ele = document.createElement("span");
ele.id="percentUsedClips";
ele.innerHTML = "&nbsp;(0% unused)";
percentUsedMod.addHook(() => {
	document.getElementById("unsoldClips").parentNode.insertBefore(ele, document.getElementById("unsoldClips").nextSibling);
});
percentUsedMod.addTickHook(() => {
	var percent = unsoldClips/clips*100;
	var orderOfMagnitude = Math.max(0,Math.floor(Math.abs(Math.log10(percent))));	
	ele.innerHTML = `&nbsp;(${(percent).toFixed(orderOfMagnitude)}% unused)`;
});
