"use strict";
let game = new Game();
let startBtn = $("#stopwatchStart");
let stopBtn = $("#stopwatchStop");
startBtn.on("click", event => {
    game.init();
});
stopBtn.on("click", event => {
    game.stop();
});
