//setup

const getrandomroom = () => {
	return Math.floor(Math.random() * 3);
}

const game = () => {
	let ret = [{
			room1: 0
		},{
			room2: 0
		},{
			room3: 0
		},{
			pick: {}
		}
	];
	let randindex = getrandomroom();
	ret[randindex][Object.keys(ret[randindex])[0]] = 1;
	return ret
}

const games = args => {
	let ret = [];

	for(let i=0; i<args; i++){
		ret.push({ ['game'+(i+1)]: game()});
	}
	return ret;
}

const pickroom = arg => {
	for (let i = 0; i<arg.length; i++){
		let g = arg[i][Object.keys(arg[i])];
		let rnum = getrandomroom()+1;
		g[3].pick = ('room'+rnum);
	}
	return arg;
}

const eliminate = arg => {
	for (let i = 0; i<arg.length; i++){
		let g = arg[i]['game'+[i+1]];
		for (let j=0; j<g.length-1; j++){
			let room = Object.keys(g[j])[0]
			let val = g[j][Object.keys(g[j])[0]];
			let pick = g[3].pick;
			if ((pick !==room) && (val !== 1)){
				g.splice(j, 1);
				break;
			}
		}
	}
	return arg;	
}

const changeroom = arg => {
	for (let i =0; i<arg.length; i++){
		let g = arg[i]['game'+(i+1)]
		for (let j=0; j<g.length-1; j++){
			let room = Object.keys(g[j])[0];
			let pick = g[2].pick;
			if (pick !== room){
				g[2].pick = room;
				break;
			}
		}
	}
	return arg;
}

const getwinpercentage = arg => {
	let wins = 0;
	for (let i =0; i<arg.length; i++){
		let g = arg[i]['game'+(i+1)];
		for (let j=0; j<g.length-1; j++){
			if (g[j][g[2].pick])
				wins++;
		}
	}
	return wins / arg.length;
}

//rendering

document.addEventListener("DOMContentLoaded", () => loaddom());

const loaddom = () =>{
	document.body.appendChild(document.createElement("div")).innerHTML = `
		<div>Number of Simulations</div>
		<input id="numsimcount"></input>
		<select id="switch">
			<option value="0">Dont Switch</option>
			<option value="1">Switch</option>
		</select>
		<br>
		<button id="run">Run Simulation</button>
		<div>Results: </div>
		<div id="results">TEST</div>
		<div>Show games array
			<input id="showgamesarray" type="checkbox"></input>
		</div>
		<pre id="gamesarray"></code>
	`;
	const ga = document.getElementById("gamesarray");
	document.getElementById("run").addEventListener("click", () => calc(ga));
	document.getElementById("showgamesarray").addEventListener("change", () => togglegamesarray(ga));
}

let simulation;

const calc = ga => {
	let simcount = document.getElementById("numsimcount").value
	let results = document.getElementById("results");
	let change = document.getElementById("switch");
	if ((simcount > 1000000) || (simcount < 1) || (isNaN(simcount))){
		results.innerHTML = "Please input number between 1 and 1 million";
		ga.innerHTML = null;
		return;
	}
	simulation = games(simcount);
	simulation = pickroom(simulation);
	simulation = eliminate(simulation);
	Number(change.value) ? simulation = changeroom(simulation) : null;
	let winpercent;
	winpercent = getwinpercentage(simulation);
	results.innerHTML = `Win%: ${winpercent}`;
	ga.style.display === 'block' ? ga.innerHTML = JSON.stringify(simulation, undefined, 2) : null;
} 

const togglegamesarray = arg => {
	if (arg.style.display === 'block'){
		arg.style.display = 'none'
		return;
	} else {
		arg.style.display = 'block'
		simulation ? arg.innerHTML = JSON.stringify(simulation, undefined, 2) : null;
	}
}