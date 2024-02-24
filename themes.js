const themes = ["Default","Red","Green","Yellow","Emeraild","Purple","Orange"];

if (window.localStorage.getItem("theme") != null) {
	window.addEventListener('load', (event) => {
	var checkbox = document.querySelectorAll('input[type="checkbox"]');
	checkbox[0].setAttribute('checked', 'true');
	AnimLock(1);
	let theme = localStorage.getItem("theme");
	if (theme == "TRed") {document.body.setAttribute("id","TRed"); } 
	else if (theme == "TGreen") {document.body.setAttribute("id","TGreen");} 
	else if (theme == "TYellow") {document.body.setAttribute("id","TYellow");} 
	else if (theme == "TEmeraild") {document.body.setAttribute("id","TEmeraild");} 
	else if (theme == "TPurple") {document.body.setAttribute("id", "TPurple");} 
	else if (theme == "TOrange") {document.body.setAttribute("id","TOrange");} 
	else if (theme == "TDefault") {document.body.setAttribute("id","TDefault")}	
	});
} else {
	window.addEventListener('load', (event) => {
		var rand = Math.floor(Math.random() * themes.length);
		var randM = themes[rand];
		if (themes[rand] === "Red") {document.body.setAttribute("id","TRed"); } 
		else if (themes[rand] === "Green") {document.body.setAttribute("id","TGreen");} 
		else if (themes[rand] === "Yellow") {document.body.setAttribute("id","TYellow");} 
		else if (themes[rand] === "Emeraild") {document.body.setAttribute("id","TEmeraild");} 
		else if (themes[rand] === "Purple") {document.body.setAttribute("id", "TPurple");} 
		else if (themes[rand] === "Orange") {document.body.setAttribute("id","TOrange");} 
		else if (themes[rand] === "Default") {document.body.setAttribute("id","TDefault")}	
	});	
}






function ChangeTheme(theme) {
	if (theme === "Default") {document.body.setAttribute("id","TDefault");UnlockTheme();}
	if (theme === "Red") {document.body.setAttribute("id","TRed");UnlockTheme();}
	if (theme === "Green") {document.body.setAttribute("id","TGreen");UnlockTheme();}
	if (theme === "Yellow") {document.body.setAttribute("id","TYellow");UnlockTheme();}
	if (theme === "Emeraild") {document.body.setAttribute("id","TEmeraild");UnlockTheme();}
	if (theme === "Purple") {document.body.setAttribute("id","TPurple");UnlockTheme();}
	if (theme === "Orange") {document.body.setAttribute("id","TOrange");UnlockTheme();}
}

document.addEventListener('DOMContentLoaded', function () {
	var checkbox = document.querySelectorAll('input[type="checkbox"]');
	checkbox[0].addEventListener('change', function () {
	  if (checkbox[0].checked) {
		LockTheme();
	  } else {
	  	AnimLock(0);console.log("worked!");
		localStorage.removeItem("theme");
	  }
	});
  });

function LockTheme() {
	AnimLock(1);
	let curTheme = document.querySelector("body").id;console.log(curTheme);
	localStorage.setItem("theme",curTheme);
}

function UnlockTheme() {
	AnimLock(0);
	localStorage.removeItem("theme");
	var checkbox = document.querySelectorAll('input[type="checkbox"]');
	checkbox[0].removeAttribute('checked');
}

function AnimLock(i) { // 1 - checked; 0 - unchecked
	document.querySelector(".theme_lock_btn .iconify").remove();
	let box = document.querySelector(".theme_lock_btn");
	let span = document.createElement("span");
	span.className = "iconify";
	if (i == 1) {
		span.setAttribute("data-icon","bxs:lock-alt");
	} else if (i == 0) {
		span.setAttribute("data-icon","bxs:lock-open-alt");
	}
	box.prepend(span);
}

