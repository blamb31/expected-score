const axios = require('axios')
const { API_KEY } = process.env
const fs = require('fs');


const getGameInfo = async (gameId) => {
    const req = await axios.get(`https://api.sportradar.us/nba/trial/v7/en/games/${gameId}/pbp.json?api_key=${'dh6s4jzduj3g5db668mt2u8r'}`)

    fs.writeFileSync(`./setupInfo/gameStats/2022-2023/${req.data.scheduled.split('T')[0]}-${req.data.home.name}-${req.data.away.name}.json`, JSON.stringify(req.data))

    return req.data
}

module.exports = {
    getGameInfo,
}