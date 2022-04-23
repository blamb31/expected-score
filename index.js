
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
require('dotenv')

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
    let actualScore = 0

    allEvents.periods.forEach(period => allEventsList.push(...period.events))

    const eventsWithStats = allEventsList.filter(event => event?.statistics?.length > 0);
    const allStats = []
    eventsWithStats.forEach(e => allStats.push(...e.statistics));

    const filteredStats = allStats.filter(stat => ['fieldgoal', 'freethrow'].includes(stat.type))

    const playerStats = {}
    const shotTypes = {}

    filteredStats.forEach(event => {
        console.log({ player: event.player, event })
        if (!playerStats[event.team.name]) {
            playerStats[event.team.name] = {}
        }
        if (!playerStats[event.team.name][event.player.full_name]) {
            playerStats[event.team.name][event.player.full_name] = [event]
        } else {
            playerStats[event.team.name][event.player.full_name].push(event)
        }
    })


    const calculateOtherTeam = false
    const expectedScore = {}
    const playerScoring = {}
    let twoPointersTaken = 0
    let threePointersTaken = 0
    let freeThrowsTaken = 0
    let totalShotsTaken = 0

    for (let team in playerStats) {
        if (team === 'Jazz' || calculateOtherTeam) {
            expectedScore[team] = 0
            for (let player in playerStats[team]) {
                for (let shot of playerStats[team][player]) {
                    // console.log({ player: shot.player, player, shotMade: shot.shotMade, distance: shot.distance })
                    totalShotsTaken++
                    let shotValue = 0
                    if (shot.three_point_shot) {
                        threePointersTaken++
                        shotValue = 3
                    } else if (shot.type === 'freethrow') {
                        freeThrowsTaken++
                        shotValue = 1
                    } else {
                        twoPointersTaken++
                        shotValue = 2

                    }


                    if (shot.type === 'freethrow') {
                        expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['ft'] / 100) * shotValue

                        expectedScore[team] += expectedPoints
                        if (!playerScoring[shot.player.full_name]) {
                            playerScoring[shot.player.full_name] = {}
                        }
                        if (playerScoring[shot.player.full_name].expected) {
                            playerScoring[shot.player.full_name].expected += expectedPoints
                        } else {
                            playerScoring[shot.player.full_name]['expected'] = expectedPoints
                        }
                        if (shot.made) {
                            actualScore += shotValue
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (!playerScoring[shot.player.full_name].actual) {
                                playerScoring[shot.player.full_name]['actual'] = shotValue
                            } else {
                                playerScoring[shot.player.full_name].actual += shotValue

                            }
                        }
                    } else {
                        if (shot.shot_distance > 0 && shot.shot_distance <= 4) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_0_4'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 4 && shot.shot_distance <= 9) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_5_9'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 9 && shot.shot_distance <= 14) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_10_14'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 14 && shot.shot_distance <= 19) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_15_19'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 19 && shot.shot_distance <= 24) {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_20_24'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        } else {
                            const expectedPoints = (playerShootingPercentages[team][shot.player.full_name]['_25_29'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[shot.player.full_name]) {
                                playerScoring[shot.player.full_name] = {}
                            }
                            if (playerScoring[shot.player.full_name].expected) {
                                playerScoring[shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore += shotValue
                                if (!playerScoring[shot.player.full_name]) {
                                    playerScoring[shot.player.full_name] = {}
                                }
                                if (!playerScoring[shot.player.full_name].actual) {
                                    playerScoring[shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[shot.player.full_name].actual += shotValue

                                }
                            }
                        }

                    }
                    // console.log({
                    //     expectedScore, player: shot.player.full_name, pstats: playerScoring[shot.player.full_name], shotValue, shotmade: shot.made
                    // })

                }
            }
        }
    }

    // console.log({ expectedScore, playerStats, shotTypes, shot: shotTypes['Jazz'].threepointmiss })
    const oponentScore = allEvents.home.name !== "Jazz" ? allEvents.home.points : allEvents.away.points
    // console.log({ expectedScore, playerScoring, actualScore, difference: actualScore - expectedScore.Jazz, twoPointersTaken, threePointersTaken, freeThrowsTaken, totalShotsTaken })

    let writeContent = 'Expected Score: ' + expectedScore.Jazz + '\n'
    writeContent += 'Actual Score: ' + actualScore + '\n'
    writeContent += 'Difference: ' + (actualScore - expectedScore.Jazz) + '\n'
    writeContent += 'Opponent Score: ' + (oponentScore) + '\n'
    writeContent += 'Game Outcome: ' + (oponentScore > actualScore ? 'Loss' : "Win") + '\n'
    writeContent += 'Two Pointers Taken: ' + twoPointersTaken + '\n'
    writeContent += 'Three Pointers Taken: ' + threePointersTaken + '\n'
    writeContent += 'Free Throws Taken: ' + freeThrowsTaken + '\n'
    writeContent += 'Total Shots Taken: ' + totalShotsTaken + '\n'
    let playerScoringContent = ''
    for (let player in playerScoring) {
        playerScoringContent += '\t' + player + ': \n'
        playerScoringContent += '\t\tShots Taken: ' + playerStats.Jazz[player].length + '\n'
        playerScoringContent += '\t\t' + 'Expected: ' + playerScoring[player].expected + '\n'
        playerScoringContent += '\t\t' + 'Actual: ' + playerScoring[player].actual + '\n'
        playerScoringContent += '\t\t' + 'Difference: ' + (playerScoring[player].actual - playerScoring[player].expected) + '\n'
    }
    writeContent += 'Player Scoring: \n' + playerScoringContent + '\n'




    fs.writeFileSync(`./results/${date}-${home}-${away}-${shootingFile}.txt`, writeContent)
}
main()