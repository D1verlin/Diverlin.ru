
document.addEventListener("DOMContentLoaded", () => {
    localStorage.setItem('snow', '0');
  });
	
	function Snow() {
	document.getElementById("svgedit").classList.toggle('toggle-icon');
	let snowfile = document.querySelector('#snowlink');
	if (localStorage.snow === '1') {
		snowfile.setAttribute("href","https://d1verlin.github.io/diverlin/snow/snow.css");
		localStorage.snow = '0';
	} else if (localStorage.snow === '0') {
		snowfile.setAttribute("href"," ");
		localStorage.snow = '1';
	}
}