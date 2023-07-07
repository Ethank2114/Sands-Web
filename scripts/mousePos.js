// mousePos.js
// Ethan Kerr

// let canvas = document.getElementById("canvas");

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}

canvas.addEventListener("mousemove", function(evt) {
	let pos = getMousePos(canvas, evt);
	console.log(pos);
});