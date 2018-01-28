# montyhall-simulator
A simulation for running x amount of 'Lets Make A Deal' games where a bot can switch or not switch their answer

This script has been refurbished to run in both node and the browser.

To run in node requires 2 arguments:  simcount and strategy
simcount is capped between 0 and 4 million
strategy is a boolean 0 for off and 1 for on

example:

//runs 1 million games where the player has swapped their answer everytime

node montyhall.js 1000000 1

//runs 5 thousand games where the player never changed their answer a single time.

node montyhall.js 5000 0
