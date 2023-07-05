// Sands-Web
// main.js
// Ethan Kerr

function drawRect({context, x, y, width, height, color="white"}) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

let canvas = document.getElementById("canvas");

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
	}

	update(map) {
		if(map[this.x][this.y + 1] === undefined) {
			map[this.x][this.y] = undefined;
			this.y += 1;
			map[this.x][this.y] = this;
			return;
		}

		if(map[this.x + 1][this.y + 1] === undefined) {
			map[this.x][this.y] = undefined;
			this.x += 1;
			this.y += 1;
			map[this.x][this.y] = this;
			return;
		}

		if(map[this.x - 1][this.y + 1] === undefined) {
			map[this.x][this.y] = undefined;
			this.x -= 1;
			this.y += 1;
			map[this.x][this.y] = this;
			return;
		}
	}

	render(context) {
		drawRect({context:context, x:this.x, y:this.y, width:1, height:1});
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
		this.particlesMap = [];

		for(let i = 0; i < canvas.width; i++) {
			let temp = [];
			for(let j = 0; j < canvas.height; j++) {
				temp.push(undefined);
			}
			this.particlesMap.push(temp);
		}
	}

	addParticle(particle) {
		this.particles.push(particle);
		// console.log(particle)
		this.particlesMap[particle.x][particle.y] = particle;
	}

	update() {
		// console.log(this.particles)
		// console.log(this.particlesMap)
		this.particles.forEach(function(particle) {
			particle.update(this.particlesMap);
		}, this);
	}

	render() {
		drawRect({context:this.context, x:0, y:0, width:canvas.width, height:canvas.height, color:"rgb(30, 30, 25)"})
		this.particles.forEach(function(particle) {
			particle.render(this.context);
		}, this);
	}

}

let rate = 1000 / 144;
let theWorld = new World(canvas);
let intervalPtr = setInterval(function() {
	theWorld.update();
	theWorld.render();
}, rate);

for(let i = 0; i < canvas.width; i++) {
	theWorld.addParticle(new Wall(i, 0));
	theWorld.addParticle(new Wall(i, canvas.height - 1));
}

for(let i = 1; i < canvas.height - 1; i++) {
	theWorld.addParticle(new Wall(1, i));
	theWorld.addParticle(new Wall(canvas.width - 1, i));
}

for(let i = 0; i < 100; i++) {
	theWorld.addParticle(new Sand(randInt(1, canvas.width - 1), randInt(1, canvas.height - 1)));
}

// for(let i = 0; i < 100; i++) {
// 	theWorld.addParticle(new Sand(100, randInt(1, canvas.height - 1)));
// }

