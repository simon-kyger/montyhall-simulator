const renderbrowser = () => {
	document.addEventListener("DOMContentLoaded", function(){
		document.body.appendChild(document.createElement("div")).innerHTML =`
			<input type="number" id="nGames" value="5000000">Number of Simulations</input>
			<br>
			<input type="checkbox" id="switchyn">Switch Choice?</input>
			<br>
			<button id="doit">Play</button>
			<br>
			<div id="intermediate"></div>
			<br>
			<div id="result"></div>
			<br>
			<div id="timing"></div>
		`;
		document.querySelector("#doit").addEventListener("click", simulate().handleRequest);
	});
}

const rendernode = () => {
	let arg = process.argv.slice(2);
	//? rofl
}

typeof window !== 'undefined' ? renderbrowser() : rendernode();

const simulate = () => {
    const result = document.querySelector("#result");
    const timing = document.querySelector("#timing");
    const nOfGames = document.querySelector("#nGames");
    const switchDoors = document.querySelector("#switchyn");
    const intermediate = document.querySelector("#intermediate");
    const worker = getWorker();
    worker.addEventListener("message", workerMessagingHandler);

	const cleanUp = playOut => {
		timing.textContent = "";
		result.textContent = "";
		setTimeout(playOut, 0);
	};

    const clickHandle = () => {
		cleanUp(() => {
			const nGames = nOfGames.value || 5000000;
			const switchAlways = switchDoors.checked;
			worker.postMessage({
				nGames: nGames,
				switchDoors: switchAlways
			});
		});
    }

	return {
  		handleRequest: clickHandle
	};
}

const report = results => {
	intermediate.textContent = "";
	timing.textContent = `Time to parse: ${parseFloat(results.timed/1000).toFixed(4)} seconds (web worker time)`;
	result.innerHTML =
		`<b>${!results.switchDoors ? "Never switching doors" : "Always switching doors"}</b>:
		${results.wins} wins out of ${results.nGames} games
		<br>
		<br>
		<b>Win%: </b>${results.wins/results.nGames}`;
};

const workerMessagingHandler = e => {
	if (e.data.currentlyAt) {
		return intermediate.innerHTML = `Playing: now at game #${
		e.data.currentlyAt}, ${e.data.wins} won`;
	}
	return report(e.data);
}

const code = `
	let data = {};
	let startTime = 0;
	let switchdoor = false;
	
	onmessage = e => {
		data = e.data;
		startTime = performance.now();
		switchdoor = e.data.switchDoors;
		calculateGames(data.nGames);
	};

	// Create a game
	const game = () => {
		const doors = [0, 1, 2];
		const pick = Math.floor(Math.random() * 3);
		const correctPick = Math.floor(Math.random() * 3);
		const eliminated = doors.filter(v => v !== pick && v !== correctPick)[0];

		return {
			correctpick: correctPick,
			pick: switchdoor ? doors.filter(v => v !== pick && v !== eliminated)[0] : pick,
			eliminated: eliminated,
		};
	};

	const getWinner = game => (game.correctpick === game.pick);

	const winningGenerator = function*(n) {
		let wins = 0;
    	while (n--) {
      		wins += getWinner(game());
      		yield wins;
    	}
  	};

  	// calculate the number of succeeded games
  	const calculateGames = (nGames) => {
    	const funNGames = winningGenerator(nGames);
    	let numberOfWins = 0;
    	let iterations = 0;

    	while (nGames--) {
      		data.wins = funNGames.next().value;
      		if (iterations++ % 10000 === 0) {
        		postMessage({
          			currentlyAt: iterations,
          			wins: data.wins
        		});
      		}
    	}
    	data.timed = (performance.now() - startTime).toFixed(3);
    	postMessage(data);
  	}
`

const getWorker = () => {
	let blob = new Blob([code], {
		"type": "application/javascript"
	});
	return new Worker(URL.createObjectURL(blob));
}