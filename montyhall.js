//setup
const game = function(){
	this[0] = 0;
	this[1] = 0;
	this[2] = 0;
	this.pick = Math.floor(Math.random() * 3);
	this.correctpick = Math.floor(Math.random() * 3);
	this[this.correctpick] = 1;
	for (let i=0; i<3; i++){
		if ((this[i] !== 1) && (this.pick !== i)){
			this.eliminated = i;
			break;
		}
	}
}

const games = arg => {
	let ret = [];
	for(let i=0; i<arg; i++){
		ret.push(new game);
	}
	return ret;
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
const maxsim = 5000000;

const renderbrowser = () => {
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
		if ((simcount > maxsim) || (simcount < 1) || (isNaN(simcount))){
			results.innerHTML = `Please input number between 1 and ${maxsim}`;
			ga.innerHTML = null;
			return;
		}
		simulation = games(simcount);
		Number(change.value) ? simulation = changeroom(simulation) : null;
		ga.style.display === 'block' ? ga.innerHTML = JSON.stringify(simulation, undefined, 2) : null;
		results.innerHTML = `
			Win%: ${getwinpercentage(simulation)}
			<br>
			TimeTaken: ${(Date.now() - timestart)/1000} seconds
		`;
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
}

const rendernode = () =>{
	let arg = process.argv.slice(2);
	if (!arg[0] || isNaN(arg[0])){
		console.log(`Requires minimum simulation count as first argument`);
		return;
	}
	if (arg[0]>maxsim){
		console.log(`Reduce arg to between 1 and ${maxsim}`);
		return;
	}
	if (!arg[1]){
		console.log(`Strategy unknown. Add second argument to swap strategy`);
		console.log(`ex: 'node montyhall.js 10000 1'`);
		return;
	}
	const timestart = Date.now();
	simulation = games(arg[0]);
	let strategy;
	if (arg[1] == true){
		simulation = changeroom(simulation);
		strategy = 'Player swapped choices every game.';
	} else {
		strategy = 'Player did not swap their choices in any game.'
	}
	console.log(`
		Out of ${arg[0]} runs:
		Win%: ${getwinpercentage(simulation)}
		Strategy: ${strategy}
		TimeTaken: ${(Date.now() - timestart)/1000} seconds
	`);
}

if (typeof window !== 'undefined'){
	renderbrowser();
} else {
	rendernode();
}