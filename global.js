// Colors
const color = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[36m',
    reset: '\x1b[0m'
}





// Console functions
function getTimestamp() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function info(message) {
    console.log(`${color.yellow}[${getTimestamp()}]${color.reset} ${message}`);
}

function warn(message) {
    console.log(`${color.orange}[${getTimestamp()}]${color.reset} ${message}`);
}

function error(message) {
    console.log(`${color.red}[${getTimestamp()}] ${message}${color.reset}`);
}

function success(message) {
    console.log(`${color.green}[${getTimestamp()}]${color.reset} ${message}`);
}

function debug(message) {
    console.log(`${color.blue}[${getTimestamp()}]${color.reset} ${message}`);
}





module.exports = { getTimestamp, info, warn, error, success, debug, color};