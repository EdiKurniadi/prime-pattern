
class Vector2{
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	add(otherVector) {
		this.x = this.x + otherVector.x;
		this.y = this.y + otherVector.y;
	}
}

const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth*84/100;
const ctx = canvas.getContext('2d');

let blockPos = new Vector2(canvas.width/2,canvas.height/2);
let numPrime = 0;

let state, 
	frame, 
	blockSize, 
	numBegin, 
	numStop, 
	scale, 
	primePos, 
	color, 
	typeDraw, 
	isAnimate,
	direction,
	modeDirection,
	lastDirection,
	transfrom_x,
	transfrom_y;

let maxX = 0;
let minX = 10000;
let maxY = 0;
let minY = 10000;

window.onkeypress = function(e){
	if(e.keyCode === 32 && state !== 0) {
		state = 0;
	}

	else if(e.keyCode === 32 && state === 0) {
		state = 1;
		animate();
	}
}

function getDirection(num_prime, modeDirection){
		let index = num_prime % parseInt(modeDirection);
		return direction[index];
	}

function randomColor() {
	let hex1 = Math.floor(Math.random()*256);
	let hex2 = Math.floor(Math.random()*256);
	let hex3 = Math.floor(Math.random()*256);
	return `rgba(${hex1},${hex2},${hex3},1.0)`;
}

function isPrime(num) {
	if(num === 1){return false};
	let limit = Math.round(Math.sqrt(num));
	i = 0;
	while(num % (limit-i) !== 0 && num % (i+2) !== 0) {i++};
	if(limit-i === 1){return true};
	return false;
}

function update() {

	blockPos = new Vector2(canvas.width/2,canvas.height/2);
	numPrime = 1;
	primePos = [];

	blockSize = parseInt(document.getElementById('size').value);
	numBegin = parseInt(document.getElementById('beginNumber').value);
	numStop = parseInt(document.getElementById('stopNumber').value);
	scale = document.getElementById('scale').value;
	color = document.getElementById('color').value;
	modeDirection = document.querySelector('input[name="info-direction"]:checked').value;
	if(color === 'random') {color = randomColor()};

	maxX = 0;
	minX = 10000;
	maxY = 0;
	minY = 10000;

	if(modeDirection == 4) {
		direction = [new Vector2(-scale/10, 0), 
					 new Vector2(0, -scale/10), 
					 new Vector2(scale/10, 0), 
					 new Vector2(0, scale/10)
					 ];
	} else if(modeDirection == 8) {
		direction = [new Vector2(0, -scale/10), 
					 new Vector2(scale/10, -scale/10), 
					 new Vector2(scale/10, 0),
					 new Vector2(scale/10, scale/10),  
					 new Vector2(0, scale/10), 
					 new Vector2(-scale/10, scale/10),
					 new Vector2(-scale/10, 0),
					 new Vector2(-scale/10, -scale/10)
					 ];
		
	}
	lastDirection = direction[0];

	typeDraw = document.querySelector('input[name="info-type-draw"]:checked').value;
	isAnimate = document.querySelector('input[type="checkbox"]').checked;
}


function primeConfiguration() {
	modeDirection = document.querySelector('input[name="info-direction"]:checked').value;
	for(let n = numBegin ; n < numStop ; n++){
		if(isPrime(n)){

			blockPos.add(lastDirection);
			primePos.push(new Vector2(parseInt(blockPos.x), parseInt(blockPos.y)));

			if(blockPos.x > maxX) {
				maxX = blockPos.x;
			} else if(blockPos.x < minX) {
				minX = blockPos.x;
			};

			if(blockPos.y > maxY) {
				maxY = blockPos.y;
			} else if(blockPos.y < minY) {
				minY = blockPos.y;
			};

			numPrime++;
			lastDirection = getDirection(numPrime, modeDirection);

		} else {
			blockPos.add(lastDirection);
		}
	}

	transfrom_x = (canvas.width - maxX - minX)/2;
	transfrom_y = (canvas.height - maxY - minY)/2;
	
	for(let i = 0 ; i < primePos.length ; i++) {
		primePos[i].x += transfrom_x;
		primePos[i].y += transfrom_y;
	}
}

function drawSinglePrimeToCanvas(i) {
	ctx.beginPath();

	if(typeDraw === 'circle') {
		ctx.arc(primePos[i].x, primePos[i].y, blockSize, 0, Math.PI * 2);
		ctx.fillStyle = color;
		if(color === 'randomAll') {ctx.fillStyle = randomColor()};
		ctx.fill();
	}

	else if(typeDraw === 'square') {
		ctx.rect(primePos[i].x, primePos[i].y, blockSize, blockSize);
		ctx.fillStyle = color;
		if(color === 'randomAll') {ctx.fillStyle = randomColor()};
		ctx.fill();
	} 

	else if(typeDraw === 'line') {
		ctx.lineWidth = blockSize;
		ctx.moveTo(primePos[i].x, primePos[i].y);
		ctx.lineTo(primePos[i+1].x, primePos[i+1].y);
		ctx.strokeStyle = color;
		if(color === 'randomAll') {ctx.strokeStyle = randomColor()};
		ctx.stroke();
	};
}

function drawAllPrimeToCanvas() {
	ctx.clearRect(0, 0, canvas.width , canvas.height);
	for(let i = 0 ; i < primePos.length ; i++) {
		drawSinglePrimeToCanvas(i);
	}
}


function animate() {
	if(state === 0) {return};
	if(frame === primePos.length) {frame = 0; return}
	drawSinglePrimeToCanvas(frame);
	frame++;	
	requestAnimationFrame(animate);
}


function draw() {
	update();
	primeConfiguration();
	if(!isAnimate) {drawAllPrimeToCanvas();}
	else {
		frame = 0;
		state = 1;
		ctx.clearRect(0, 0, canvas.width , canvas.height); 
		animate();
	}
}

function rotateCanvas() {
	isAnimate = document.querySelector('input[type="checkbox"]').checked;
	ctx.clearRect(0, 0, canvas.width , canvas.height);
	ctx.translate((canvas.width + canvas.height)/2, (canvas.height - canvas.width)/2);
	ctx.rotate(90*Math.PI/180);

	if(!isAnimate) {drawAllPrimeToCanvas();}
	else {
		if(frame !== 0) {
			for(let i = 0 ; i < frame ; i++) {
				drawSinglePrimeToCanvas(i);
			}
		}
		animate();
	}
}