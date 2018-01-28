//setup

const getrandomroom = () => {
	return Math.floor(Math.random() * 3);
}

const game = () => {
	let correctpick = getrandomroom();
	let ret = {
		0: null,
		1: null,
		2: null,
		'pick': getrandomroom(),
		'correctpick': correctpick,
	}
	ret[correctpick] = 1;
	ret = eliminate(ret)
	return ret;
}

const games = args => {
	let ret = [];
	for(let i=0; i<args; i++){
		ret.push(game());
	}
	return ret;
}

const eliminate = arg => {
	for (let i=0; i<3; i++){
		if((arg[i] !== 1) && (Number(Object.keys(arg)[i]) !== arg.pick)){
			arg.eliminated = Number(Object.keys(arg)[i]);
			break;
		}
	}
	return arg;	
}

const changeroom = arg => {
	let x = arg.length
	for (let i=0; i<x; i++){ 
		for (let j=0; j<3; j++){
			if ((Number(j) !== arg[i].eliminated) && (Number(j)!== arg[i].pick)){
				arg[i].pick = Number(j);
				break;
			}
		}
	}
	return arg;
}

const getwinpercentage = arg => {
	let wins = 0;
	for (let i in arg){
		arg[i].correctpick == arg[i].pick ? wins++ : null
	}
	return wins / arg.length;
}

//rendering
let simulation;
if (typeof window !== 'undefined'){
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
			<div id="results"></div>
			<div>Show games array
				<input id="showgamesarray" type="checkbox"></input>
			</div>
			<pre id="gamesarray"></code>
		`;
		const ga = document.getElementById("gamesarray");
		document.getElementById("run").addEventListener("click", () => calc(ga));
		document.getElementById("showgamesarray").addEventListener("change", () => togglegamesarray(ga));
	}

	const calc = ga => {
		let simcount = document.getElementById("numsimcount").value
		let results = document.getElementById("results");
		let change = document.getElementById("switch");
		let timestart = Date.now();
		if ((simcount > 5000000) || (simcount < 1) || (isNaN(simcount))){
			results.innerHTML = "Please input number between 1 and 5 million";
			ga.innerHTML = null;
			return;
		}
		simulation = games(simcount);
		Number(change.value) ? simulation = changeroom(simulation) : null;
		results.innerHTML = `
			Win%: ${getwinpercentage(simulation)}
			<br>
			TimeTaken: ${(Date.now() - timestart)/1000} seconds
		`;
		ga.style.display === 'block' ? ga.innerHTML = JSON.stringify(simulation, undefined, 2) : null;
	} 

	const togglegamesarray = ga => {
		if (ga.style.display === 'block'){
			ga.style.display = 'none'
			return;
		} else {
			ga.style.display = 'block'
			simulation ? ga.innerHTML = JSON.stringify(simulation, undefined, 2) : null;
		}
	}
} else {
	let args = process.argv.slice(2);
	const simcount = args[0] || 1000000;
	const change = args[1] || true;
	const timestart = Date.now();
	simulation = games(simcount);
	change ? simulation = changeroom(simulation) : null;
	const strategy = change ? 'Player swapped choices every game.' : 'Player did not swap their choices in any game.'
	console.log(`
		Out of ${simcount} runs:
		Win%: ${getwinpercentage(simulation)}
		Strategy: ${strategy}
		TimeTaken: ${(Date.now() - timestart)/1000} seconds
	`);
}