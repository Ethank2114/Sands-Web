// Sands-Web
// main.js
// Ethan Kerr

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randColor(base = null, strength = null) {
	if(base !== null && strength !== null) {
		return mixColor(base, strength);
	}

	let r = randInt(0, 255);
	let g = randInt(0, 255);
	let b = randInt(0, 255)
	return "rgb(" + r.toString() + ", "+ g.toString() + ", " + b.toString() + ")"; 
}

function mixColor(oldString, strength) {

	let rgb = oldString.substring(4, oldString.length - 1).replace(/ /g, '').split(',');
	let shift = randInt(-1 * strength, strength);
			
	let part = randInt(0, 2);
	rgb[part] = (parseInt(rgb[part]) + shift).toString();

	// rgb[0] = (parseInt(rgb[0]) + randInt(-1 * strength, strength)).toString();
	// rgb[1] = (parseInt(rgb[1]) + randInt(-1 * strength, strength)).toString();
	// rgb[2] = (parseInt(rgb[2]) + randInt(-1 * strength, strength)).toString();

	return "rgb(" + rgb[0].toString() + ", "+ rgb[1].toString() + ", " + rgb[2].toString() + ")";  
}

function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function getDownVector(angle) {
	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2))),
		y: Math.round(-Math.sin(angle + (Math.PI / 2)))
	}
}
function getDownLeftVector(angle) {
	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2) + Math.PI / 4)),
		y: Math.round(-Math.sin(angle + (Math.PI / 2) + Math.PI / 4))
	}
}
function getDownRightVector(angle) {
	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2) - Math.PI / 4)),
		y: Math.round(-Math.sin(angle + (Math.PI / 2) - Math.PI / 4))
	}
}
function getLeftVector(angle) {
	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2) + Math.PI / 2)),
		y: Math.round(-Math.sin(angle + (Math.PI / 2) + Math.PI / 2))
	}
}
function getRightVector(angle) {
	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2) - Math.PI / 2)),
		y: Math.round(-Math.sin(angle + (Math.PI / 2) - Math.PI / 2))
	}
}

function getDirVector(angle, direction) {

	if(typeof direction === "string") {
		let dict = {
			"right": 0, 
			"upright": 1, 
			"up": 2, 
			"upleft": 3, 
			"left": 4, 
			"downleft": 5, 
			"down": 6, 
			"rightdown": 7
		};

		direction = dict[direction];
	}

	return {
		x: Math.round(Math.cos(angle + (Math.PI / 2) - Math.PI * (direction - 6) / 4)),
		y: Math.round(-Math.sin(angle + (Math.PI / 2) - Math.PI * (direction - 6) / 4))
	}
}

class Map {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.grid = [];

		// initalize map array
		for(let i = 0; i < this.width; i++) {
			let temp = [];
			for(let j = 0; j < this.height; j++) {
				temp.push(undefined);
			}
			this.grid.push(temp);
		}

		// console.log(this.grid);
	}

	get(x, y) {
		let out = this.grid[x + Math.floor(this.width / 2)][y + Math.floor(this.height / 2)];
		// console.log("get", x, y, out);
		return out;
	}

	set(x, y, obj) {
		// console.log("set", x, y, obj);
		this.grid[x  + Math.floor(this.width / 2)][y + Math.floor(this.height / 2)] = obj;
	}

	swap(obj1, obj2) {

		let tempObj = {x:obj1.x, y:obj1.y};

		this.set(obj1.x, obj1.y, obj2);

		obj1.x = obj2.x;
		obj1.y = obj2.y;

		this.set(obj2.x, obj2.y, obj1);

		obj2.x = tempObj.x;
		obj2.y = tempObj.y;
	}
}

// Abstract class
class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	update(map) {
		// pass
	}

	render(context) {
		// pass
	}
}

class Sand extends Particle {
	constructor(x, y) {
		super(x, y);
		this.color = randColor("rbg(0, 100, 200)", 25);
		this.history = {dir:null, count:1};
	}

	update(map) {

		let dirs = [6, 5, 7];

		for(let dir of dirs) {

			let dirVector = getDirVector(currentAngle, dir);

			let targetParticle = map.get(this.x + dirVector.x * this.history.count,
											this.y + dirVector.y * this.history.count);

			if(targetParticle === undefined) {
				map.set(this.x, this.y, undefined);
				this.x += dirVector.x;
				this.y += dirVector.y;
				map.set(this.x, this.y, this);

				// if(this.history.dir === dir) {
				// 	this.history.count++;
				// } else {
				// 	this.history.dir = dir;
				// 	this.history.count = 1;
				// }

				return;
			} else if(targetParticle instanceof Water) {
				map.swap(this, targetParticle);
				return;
			}
		}
	}

	render(context) {
		drawRect({context:context, x:this.x, y:this.y, width:1, height:1});//, color:this.color});
	}
}

class Water extends Particle {
	constructor(x, y) {
		super(x, y);
	}

	update(map) {
		let dirs = [6, 5, 7, 4, 0];

		for(let i of dirs) {

			let dirVector = getDirVector(currentAngle, i);

			if(map.get(this.x + dirVector.x, this.y + dirVector.y) === undefined) {
				map.set(this.x, this.y, undefined);
				this.x += dirVector.x;
				this.y += dirVector.y;
				map.set(this.x, this.y, this);
				return;
			}
		}
	}

	render(context) {
		drawRect({context:context, x:this.x, y:this.y, width:1, height:1, color:"Blue"})
	}
}

class Wall extends Particle {
	constructor(x, y) {
		super(x, y);
	}

	update(map) {

	}
	render(context) {
		drawRect({context:context, x:this.x, y:this.y, width:1, height:1, color:"rgb(50, 50, 30)"})
	}
}

class World {
	constructor(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");
		this.particles = [];
		this.particlesMap = new Map(this.canvas.width, this.canvas.height);

		// // initalize map array
		// for(let i = 0; i < canvas.width; i++) {
		// 	let temp = [];
		// 	for(let j = 0; j < canvas.height; j++) {
		// 		temp.push(undefined);
		// 	}
		// 	this.particlesMap.push(temp);
		// }
	}

	addParticle(particle) {
		this.particles.push(particle);
		this.particlesMap.set(particle.x, particle.y, particle);
	}

	update() {
		this.particles.forEach(function(particle) {
			particle.update(this.particlesMap);
		}, this);
	}

	render() {
		let halfWidth = Math.floor(canvas.width / 2);
		let halfHeight = Math.floor(canvas.height / 2);

		drawRect({context:this.context, x:-halfWidth, y:-halfHeight, width:canvas.width, height:canvas.height, color:"rgb(30, 30, 25)"});
		this.particles.forEach(function(particle) {
			particle.render(this.context);
		}, this);
	}

}

function setUpCanvas(canvasName) {
	// canvas
	let c = document.getElementById("canvas");

	// context
	let ctx = c.getContext("2d");
	
	ctx.translate(Math.floor(c.width / 2), Math.floor(c.height / 2));
	ctx.scale(1, -1);
	// ctx.rotate(45 * Math.PI / 180);

	return c;
}

let canvas = setUpCanvas("canvas");

let rate = 1000 / 144;
let theWorld = new World(canvas);
let intervalPtr = setInterval(function() {
	theWorld.update();
	theWorld.render();
}, rate);

/* // top bottom edges
for(let i = -1 * Math.floor(canvas.width / 2); i < Math.floor(canvas.width / 2); i++) {
	theWorld.addParticle(new Wall(i, -1 * Math.floor(canvas.height / 2)));
	theWorld.addParticle(new Wall(i, Math.floor(canvas.height / 2) - 1));
}

// side edges
for(let i = -1 * Math.floor(canvas.height / 2); i < Math.floor(canvas.height / 2); i++) {
	theWorld.addParticle(new Wall(-1 * Math.floor(canvas.width / 2), i));
	theWorld.addParticle(new Wall(Math.floor(canvas.height / 2) - 1, i));
}

// theWorld.addParticle(new Sand(100, 100));

for(let i = 0; i < 10000; i++) {
	theWorld.addParticle(new Sand(randInt(-198, 198), randInt(-198, 198)));
}*/

const width = 140;

// top bottom edges
for(let i = -1 * width; i < width; i++) {
	theWorld.addParticle(new Wall(i, -1 * width));
	theWorld.addParticle(new Wall(i, width - 1));
}

// side edges
for(let i = -1 * width; i < width; i++) {
	theWorld.addParticle(new Wall(-1 * width, i));
	theWorld.addParticle(new Wall(width - 1, i));
}

// theWorld.addParticle(new Sand(100, 100));

for(let i = 0; i < 5000; i++) {
	theWorld.addParticle(new Sand(randInt(-(width - 2), width - 2), randInt(-(width - 2), width - 2)));
}

for(let i = 0; i < 10000; i++) {
	theWorld.addParticle(new Water(randInt(-(width - 2), width - 2), randInt(-(width - 2), width - 2)));
}

// for(let i = 0; i < 10000; i++) {
// 	theWorld.addParticle(new Sand(100, randInt(1, canvas.height - 1)));
// }

let currentAngle = 0;
let deltaAngle = (Math.PI / 180) * 0.1


let rotatePtr = setInterval(function() {
	let ctx = canvas.getContext("2d");
	currentAngle += deltaAngle;
	if(currentAngle > 2 * Math.PI) {
		currentAngle -= 2 * Math.PI;
	}
	ctx.rotate(deltaAngle);
	// console.log(currentAngle, currentAngle * 180 / Math.PI)
	// console.log(getDownVector(currentAngle))
}, 1);