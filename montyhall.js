//setup

const getrandomroom = () => {
	return Math.floor(Math.random() * 3);
}

const game = function(){
	let correctpick = getrandomroom();
	this[0] = null;
	this[1] = null;
	this[2] = null;
	this.pick = getrandomroom();
	this.correctpick = correctpick;
	this[correctpick] = 1;
	for (let i=0; i<3; i++){
		if ((this[i] !== 1) && (Number(Object.keys(this)[i]) !== this.pick)){
			this.eliminated = Number(Object.keys(this)[i]);
			break;
		}
	}
}

const games = args => {
	let ret = [];
	for(let i=0; i<args; i++){
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
const maxsim = 4000000;

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
}

const rendernode = () =>{
	let args = process.argv.slice(2);
	if (!args[0] || isNaN(args[0])){
		console.log(`Requires minimum simulation count as first argument`);
		return;
	}
	if (args[0]>maxsim){
		console.log(`Reduce args to between 1 and ${maxsim}`);
		return;
	}
	if (!args[1]){
		console.log(`Strategy unknown. Add second argument to swap strategy`);
		console.log(`ex: 'node montyhall.js 10000 1'`);
		return;
	}
	const timestart = Date.now();
	simulation = games(args[0]);
	let strategy;
	if (args[1] == true){
		simulation = changeroom(simulation);
		strategy = 'Player swapped choices every game.';
	} else {
		strategy = 'Player did not swap their choices in any game.'
	}
	console.log(`
		Out of ${args[0]} runs:
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