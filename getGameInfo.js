const axios = require('axios')

const getGameInfo = async (gameId) => {
    const req = await axios.get(`https://api.sportradar.us/nba/trial/v7/en/games/${gameId}/pbp.json?api_key=kzhs3rtx6vj99sfjhmf5puxs`)
    return req.data
}

module.exports = {
    getGameInfo,
}