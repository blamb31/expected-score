const axios = require('axios')
const API_KEY = process.env.API_KEY

const getGameInfo = async (gameId) => {
    const req = await axios.get(`https://api.sportradar.us/nba/trial/v7/en/games/${gameId}/pbp.json?api_key=${API_KEY}`)
    return req.data
}

module.exports = {
    getGameInfo,
}