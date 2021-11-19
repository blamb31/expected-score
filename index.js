
// Argv order:
// 0. node
// 1. String, file to run
// 2. String, shootingNumbers file name
// 3. Boolean, true to use a gameStats file that already exists, false to create a new one
// 4. String, filename of gameStats file to use or gameId to fetch

// Example - using a gameId input from the command line
// node index.js jazzShootingNumbers false none 19646f6e-9812-4218-9289-f0340aab4168 > results/ 2021-11-07-jazz-magic.txt

// Example - using a preloaded gameStats file
// ode index.js jazzShootingNumbers true 2021-11-11-jazz-pacers > results/2021-11-11-jazz-pacers.txt  


const fs = require('fs');

const main = async () => {

    const GetGameInfo = require('./getGameInfo');
    const gameFile = process.argv[4];
    let allEvents
    const getAllEvents = async () => {
        if (process.argv[3] === 'true') {
            allEvents = require(`./setupInfo/gameStats/${gameFile}`)
        }
        else {
            allEvents = await GetGameInfo.getGameInfo(gameFile)
        }
    }
    await getAllEvents()

    const shootingFile = process.argv[2] || 'jazzShootingNumbers2020-2021'
    const playerShootingPercentages = require(`./setupInfo/shootingNumbers/${shootingFile}`);
    const home = allEvents.home.name
    const away = allEvents.away.name
    const date = allEvents.scheduled.slice(0, 10)
    const allEventsList = []
    allEvents.periods.forEach(period => allEventsList.push(...period.events))

    const acceptedTypes = [
        'freethrowmade',
        'freethrowmiss',
        'threepointmade',
        'threepointmiss',
        'twopointmade',
        'twopointmiss',
    ]

    const allStats = allEventsList.filter(event => event.statistics && acceptedTypes.includes(event.event_type));

    allStats.sort((a, b) => a.wall_clock - b.wall_clock)

    const playerStats = {}
    const shotTypes = {}

    allStats.forEach(event => {
        if (!playerStats[event.statistics[0].team.name]) {
            playerStats[event.statistics[0].team.name] = {}
        }
        event.statistics.forEach(stat => {
            if (stat.shot_type || stat.free_throw_type) {
                if (!playerStats[stat.team.name][stat.player.full_name]) {
                    playerStats[stat.team.name][stat.player.full_name] = [event]
                } else {
                    playerStats[stat.team.name][stat.player.full_name].push(event)
                }
            }
        })



        if (!shotTypes[event.statistics[0].team.name]) {
            shotTypes[event.statistics[0].team.name] = {}
        } else {
            if (!shotTypes[event.statistics[0].team.name][event.event_type]) {
                shotTypes[event.statistics[0].team.name][event.event_type] = [{ player: event.statistics[0].player.full_name, distance: event.statistics[0].shot_distance, shotMade: event.statistics[0].made }]
            } else {
                shotTypes[event.statistics[0].team.name][event.event_type].push({ player: event.statistics[0].player.full_name, distance: event.statistics[0].shot_distance, shotMade: event.statistics[0].made })
            }
        }

    })

    const calculateOtherTeam = false
    const expectedScore = {}
    const playerScoring = {}
    let twoPointersTaken = 0
    let threePointersTaken = 0
    let freeThrowsTaken = 0
    let totalShotsTaken = 0

    for (let team in shotTypes) {
        if (team === 'Jazz' || calculateOtherTeam) {
            expectedScore[team] = 0
            for (let shotType in shotTypes[team]) {
                for (let shot of shotTypes[team][shotType]) {
                    totalShotsTaken++
                    let shotValue = 0
                    if (shotType.includes('two')) {
                        twoPointersTaken++
                        shotValue = 2
                    } else if (shotType.includes('three')) {
                        threePointersTaken++
                        shotValue = 3
                    } else {
                        freeThrowsTaken++
                        shotValue = 1
                    }
                    if (!shot.distance) {
                        expectedScore[team] += (playerShootingPercentages[team][shot.player]['ft'] / 100) * shotValue
                    } else {
                        if (shot.distance > 0 && shot.distance <= 5) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_0_4'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        } else if (shot.distance > 5 && shot.distance <= 10) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_5_9'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        } else if (shot.distance > 10 && shot.distance <= 15) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_10_14'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        } else if (shot.distance > 15 && shot.distance <= 20) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_15_19'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        } else if (shot.distance > 20 && shot.distance <= 25) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_20_24'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        } else {
                            const expectedPoints = (playerShootingPercentages[team][shot.player]['_25_29'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (playerScoring[shot.player]) {
                                playerScoring[shot.player].expected += expectedPoints
                            } else {
                                playerScoring[shot.player] = { expected: expectedPoints, actual: 0 }
                            }
                            if (shot.shotMade) {
                                playerScoring[shot.player].actual += shotValue
                            }
                        }

                    }
                }
            }
        }
    }

    // console.log({ expectedScore, playerStats, shotTypes, shot: shotTypes['Jazz'].threepointmiss })
    const actualScore = allEvents.home.name === "Jazz" ? allEvents.home.points : allEvents.away.points
    // console.log({ expectedScore, playerScoring, actualScore, difference: actualScore - expectedScore.Jazz, twoPointersTaken, threePointersTaken, freeThrowsTaken, totalShotsTaken })

    let writeContent = 'Expected Score: ' + expectedScore.Jazz + '\n'
    writeContent += 'Actual Score: ' + actualScore + '\n'
    writeContent += 'Difference: ' + (actualScore - expectedScore.Jazz) + '\n'
    writeContent += 'Two Pointers Taken: ' + twoPointersTaken + '\n'
    writeContent += 'Three Pointers Taken: ' + threePointersTaken + '\n'
    writeContent += 'Free Throws Taken: ' + freeThrowsTaken + '\n'
    writeContent += 'Total Shots Taken: ' + totalShotsTaken + '\n'
    let playerScoringContent = ''
    for (let player in playerScoring) {
        playerScoringContent += '\t' + player + ': \n'
        playerScoringContent += '\t\t' + 'Expected: ' + playerScoring[player].expected + '\n'
        playerScoringContent += '\t\t' + 'Actual: ' + playerScoring[player].actual + '\n'
        playerScoringContent += '\t\t' + 'Difference: ' + (playerScoring[player].actual - playerScoring[player].expected) + '\n'
    }
    writeContent += 'Player Scoring: \n' + playerScoringContent + '\n'




    fs.writeFileSync(`./results/${date}-${home}-${away}-${shootingFile}.txt`, writeContent)
}
main()