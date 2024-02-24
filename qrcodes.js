document.addEventListener('DOMContentLoaded', function () {
  var checkbox = document.querySelectorAll('input[type="checkbox"]');
  checkbox[1].addEventListener('change', function () {
    if (checkbox[1].checked) {
      // do this
      console.log('QR mode');
      QrMode();
    } else {
      // do that
      console.log('Link mode');
      LinkMode();
    }
  });
});

function QrMode() {
	let groups = document.querySelectorAll(".groups > a");
	for (var i = groups.length - 1; i >= 0; i--) {
			groups[i].setAttribute("href","#");
	}
			groups[0].setAttribute("onclick","QrMail()");
			groups[1].setAttribute("onclick","QrTg()");
			groups[2].setAttribute("onclick","QrDs()");
			groups[3].setAttribute("onclick","QrGh()");
}	

function LinkMode() {
	let groups = document.querySelectorAll(".groups > a");
			QrMailDel();QrTgDel();QrDsDel();QrGhDel();
			groups[0].setAttribute("href","mailto:dodobrest006@gmail.com");	
			groups[1].setAttribute("href","https://t.me/diverlin");
			groups[3].setAttribute("href","https://github.com/D1verlin");
			groups[0].removeAttribute("onclick","QrMail()");
			groups[1].removeAttribute("onclick","QrTg()");
			groups[3].removeAttribute("onclick","QrGh()");
			groups[2].removeAttribute("onclick","QrDs()");
			groups[2].setAttribute("onclick","CopyText()");
}

let qrlib = ["qrcodes/mail.png","qrcodes/tg.png","qrcodes/ds.png","qrcodes/gh.png"]


function QrMail() {
	document.querySelector("#email > svg").remove();
	let img = document.createElement("img");
	img.setAttribute("src",qrlib[0]);
	document.querySelector("#email").append(img);
	document.querySelector("#email").setAttribute("onclick","QrMailDel()");
	document.querySelector("#email").setAttribute("data-qr","yes");
}
function QrTg() {
	document.querySelector("#tg > svg").remove();
	let img = document.createElement("img");
	img.setAttribute("src",qrlib[1]);
	document.querySelector("#tg").append(img);
	document.querySelector("#tg").setAttribute("onclick","QrTgDel()");
	document.querySelector("#tg").setAttribute("data-qr","yes");
}
function QrDs() {
	document.querySelector("#boxcopy > svg").remove();
	let img = document.createElement("img");
	img.setAttribute("src",qrlib[2]);
	document.querySelector("#boxcopy").append(img);
	document.querySelector("#boxcopy").setAttribute("onclick","QrDsDel()");
	document.querySelector("#boxcopy").setAttribute("data-qr","yes");	
}
function QrGh() {
	document.querySelector("#gh > svg").remove();
	let img = document.createElement("img");
	img.setAttribute("src",qrlib[3]);
	document.querySelector("#gh").append(img);
	document.querySelector("#gh").setAttribute("onclick","QrGhDel()");
	document.querySelector("#gh").setAttribute("data-qr","yes");
}

///



function QrMailDel() {
	if (document.querySelector("#email").dataset.qr == "yes") {
	document.querySelector("#email > img").remove();
	let span = document.createElement("span");
	span.setAttribute("class","iconify");
	span.setAttribute("data-icon","dashicons:email");
	span.setAttribute("data-inline","false");
	document.querySelector("#email").append(span);
	document.querySelector("#email").setAttribute("onclick","QrMail()");
	document.querySelector("#email").setAttribute("data-qr","no");}}

function QrTgDel() {
	if (document.querySelector("#tg").dataset.qr == "yes") {
	document.querySelector("#tg > img").remove();
	let span = document.createElement("span");
	span.setAttribute("class","iconify");
	span.setAttribute("data-icon","akar-icons:telegram-fill");
	span.setAttribute("data-inline","false");
	document.querySelector("#tg").append(span);
	document.querySelector("#tg").setAttribute("onclick","QrTg()");
	document.querySelector("#tg").setAttribute("data-qr","no");}}

function QrDsDel() {
	if (document.querySelector("#boxcopy").dataset.qr == "yes") {
	document.querySelector("#boxcopy > img").remove();
	let span = document.createElement("span");
	span.setAttribute("id","copylink");
	span.setAttribute("class","iconify");
	span.setAttribute("data-icon","simple-icons:discord");
	span.setAttribute("data-inline","false");
	document.querySelector("#boxcopy").append(span);
	document.querySelector("#boxcopy").setAttribute("onclick","QrDs()");
	document.querySelector("#boxcopy").setAttribute("data-qr","no");}}

function QrGhDel() {
	if (document.querySelector("#gh").dataset.qr == "yes") {
	document.querySelector("#gh > img").remove();
	let span = document.createElement("span");
	span.setAttribute("id","copylink");
	span.setAttribute("class","iconify");
	span.setAttribute("data-icon","akar-icons:github-fill");
	span.setAttribute("data-inline","false");
	document.querySelector("#gh").append(span);
	document.querySelector("#gh").setAttribute("onclick","QrGh()");	
	document.querySelector("#gh").setAttribute("data-qr","no");}}
