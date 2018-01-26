//setup
let game = function(){
	let ret = [{
			room1: 0
		},{
			room2: 0
		},{
			room3: 0
		}
	];
	let randindex = Math.floor(Math.random()*(ret.length));
	ret[randindex][Object.keys(ret[randindex])[0]] = 1;
	return ret
}
let games = function(args){
	let ret = [];

	for(let i=0; i<args; i++){
		ret.push({ ['game'+(i+1)]: new game});
	}
	return ret;
}

//implementation




//rendering

document.addEventListener("DOMContentLoaded", function(e) {
	document.body.appendChild(document.createElement("div")).innerHTML = `
		<div>Number of Simulations</div>
		<input id="numsimcount"></input>
		<input type="radio" id="switch"></input>
		<label for="switch">Switch</label>
		<input type="radio" id="dontswitch"></input>
		<label for="dontswitch">Dont Switch</label>
		<br>
		<button id="run">Run Simulation</button>
		<div>Results: </div>
		<div id="results">TEST</div>
		<div>Games array: </div>
		<div id="gamesarray"></div>
	`;
	document.getElementById("run").addEventListener("click", function(){
		let simcount = document.getElementById("numsimcount").value
		let simulation = games(simcount);
		document.getElementById("results").innerHTML = 'asdf';
		document.getElementById("gamesarray").innerHTML = JSON.stringify(simulation);
	});
});
