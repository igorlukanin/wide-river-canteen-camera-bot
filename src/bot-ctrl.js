const childProcess = require('child_process');
const config = require('config');

const restartInterval = config.get('bot.restartIntervalMs');


process.on('uncaughtException', err => console.error(err.stack));


var children = [];

var restartChild = () => {
    // Start new child
    children.push(childProcess.fork(__dirname + '/bot'));

    console.log('bot-ctrl: child spawned, now ' + children.length + ' child(ren)');

    // Stop old child
    if (children.length > 1) {
        children.shift().kill();

        console.log('bot-ctrl: child stopped, now ' + children.length + ' child');
    }
};

restartChild();
setInterval(restartChild, restartInterval);