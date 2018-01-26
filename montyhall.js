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
		ret.push({ ['game'+i]: new game});
	}
	return ret;
}

let simulation = games(10);
console.log(simulation);







document.addEventListener("DOMContentLoaded", function(e) {
	let p = document.createElement("p");
	document.body.appendChild(p);
	p.innerHTML = `Simulator array: ${JSON.stringify(simulation)}`;
});