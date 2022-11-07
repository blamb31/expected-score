const fs = require('fs')

const fileName = process.argv[2]
const seasonYears = process.argv[3]
const file = fs.readFileSync(`./setupInfo/shootingNumbers/${seasonYears}/${fileName}`, 'utf8');
const fileJSON = JSON.parse(file)
let gameIds = []

fileJSON.games.forEach(game => {
    if (game.home.name === "Utah Jazz" || game.away.name === "Utah Jazz") {
        gameIds.push(game.id)
    }
});

console.log({ gameIds })
