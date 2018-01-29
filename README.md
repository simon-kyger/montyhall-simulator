# montyhall-simulator
A simulation for running x amount of 'Lets Make A Deal' games where a bot can switch or not switch their answer

# montyhall.js

## Runs in Node or the browser

If running in Node, requires two arguments to be passed.

1. arg1, or the number of sims, is capped between 0 and 5 million

2. arg2, or strategy is a boolean 0 for off and 1 for on

## Examples:

//runs 1million games where every game the user changed their mind.
1. node montyhall.js 1000000 1

//runs 5 thousand games where the player never changed their answer a single time.
1. node montyhall.js 5000 0

# montyhall_v2.js

## Runs only in the browser

1.  Uses a webworker from the native Worker class 

2.  The worker is implemented via a blob.  

3.  The blob is injected with a template string of code

This version has no limitation on simcount being passed to it.