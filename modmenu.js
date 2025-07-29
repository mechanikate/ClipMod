(() => {
	const modMenu = new Mod("modmenu", {major: 1, minor: 0, patch: 0});
	const statuses = {
		"true": "&nbsp;&check;",
		"false": "&nbsp;&cross;"
	};
	modMenu.addHook(
		() => {
			modMenu.log("Creating mod interface (toggle with `toggleModMenu();`)");
	
			const statusParam = new URLSearchParams(window.location.search).get("success");
			const leftCol = document.getElementById("leftColumn");
			const parentDiv = document.createElement("div");
			const areaLabel = document.createElement("b");
			const modUrlInput = document.createElement("input");
			const modUrlConfirm = document.createElement("button");
			const removeModDropdown = document.createElement("select");
			const modRemoveConfirm = document.createElement("button");
			const modUrlStatus = document.createElement("span");
			areaLabel.innerHTML = "ClipMod";
			modUrlStatus.innerHTML = statusParam ? statuses[statusParam] : "";
			modRemoveConfirm.innerHTML = "Disable Mod & Reload";
			modUrlConfirm.innerHTML = "Add Mod & Reload";
			modUrlInput.setAttribute("type", "text");
			modUrlInput.setAttribute("placeholder", "Mod URL");
			modUrlConfirm.setAttribute("onclick", `loadMod(document.getElementById('modUrlInput').value);`);
			modRemoveConfirm.setAttribute("onclick", `removeMod(document.getElementById('removeModDropdown').value);`);
			modUrlInput.id = "modUrlInput";
			modUrlConfirm.classList = "button2";
			removeModDropdown.id = "removeModDropdown";
			modRemoveConfirm.classList = "button2";
			parentDiv.id = "modManagerDiv";
			
			installedModUrls.forEach((e,i) => { // add all mod urls to dropdown for disabling
				const selectDropdown = document.createElement("option");
				selectDropdown.setAttribute("value", i);
				selectDropdown.innerHTML=e;
				removeModDropdown.appendChild(selectDropdown);
			});
			
			parentDiv.appendChild(areaLabel);
			parentDiv.appendChild(document.createElement("hr"));
			parentDiv.appendChild(modUrlInput);
			parentDiv.appendChild(document.createElement("br"));
			parentDiv.appendChild(modUrlConfirm);
			parentDiv.appendChild(modUrlStatus);
			parentDiv.appendChild(document.createElement("br"));
			parentDiv.appendChild(document.createElement("br"));
			parentDiv.appendChild(removeModDropdown);
			parentDiv.appendChild(document.createElement("br"));
			parentDiv.appendChild(modRemoveConfirm);

			leftCol.appendChild(parentDiv);

			modMenu.log("Mod interface created.");
		}
	);
})();
