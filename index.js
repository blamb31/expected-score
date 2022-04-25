
// Argv order:
// 0. node
// 1. String, file to run
// 2. String, shootingNumbers file name
// 3. Boolean, true to use a gameStats file that already exists, false to create a new one
// 4. String, filename of gameStats file to use or gameId to fetch
// 5. Boolean, calculate other teams stats
// 6. String, filename of other teams stats file to use or gameId to fetch

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

    const calculateOtherTeam = process.argv[5] === 'true' ? true : false;
    const shootingFile = process.argv[2] || 'jazzShootingNumbers2020-2021'
    const otherShootingFile = process.argv[6] || null
    const otherTeamShootingPercentages = otherShootingFile ? require(`./setupInfo/shootingNumbers/${otherShootingFile}`) : null
    const playerShootingPercentages = require(`./setupInfo/shootingNumbers/${shootingFile}`);
    const home = allEvents.home.name
    const away = allEvents.away.name
    const opponent = allEvents.home.name === "Jazz" ? allEvents.away.name : allEvents.home.name
    const date = allEvents.scheduled.slice(0, 10)
    const allEventsList = []
    let actualScore = {}

    allEvents.periods.forEach(period => allEventsList.push(...period.events))

    const eventsWithStats = allEventsList.filter(event => event?.statistics?.length > 0);
    const allStats = []
    eventsWithStats.forEach(e => allStats.push(...e.statistics));

    const filteredStats = allStats.filter(stat => ['fieldgoal', 'freethrow'].includes(stat.type))

    const playerStats = {}
    const shotTypes = {}

    filteredStats.forEach(event => {
        if (!playerStats[event.team.name]) {
            playerStats[event.team.name] = {}
        }
        if (!playerStats[event.team.name][event.player.full_name]) {
            playerStats[event.team.name][event.player.full_name] = [event]
        } else {
            playerStats[event.team.name][event.player.full_name].push(event)
        }
    })


    const expectedScore = {}
    const playerScoring = {}
    let twoPointersTaken = {}
    let threePointersTaken = {}
    let freeThrowsTaken = {}
    let totalShotsTaken = {}

    for (let team in playerStats) {
        playerScoring[team] = {}
        actualScore[team] = 0
        twoPointersTaken[team] = 0
        threePointersTaken[team] = 0
        freeThrowsTaken[team] = 0
        totalShotsTaken[team] = 0
        if (team === 'Jazz' || calculateOtherTeam) {
            const currentTeamShootingPercentages = team === 'Jazz' ? playerShootingPercentages : otherTeamShootingPercentages
            expectedScore[team] = 0
            for (let player in playerStats[team]) {
                for (let shot of playerStats[team][player]) {
                    // console.log({ player: shot.player, player, shotMade: shot.shotMade, distance: shot.distance })
                    totalShotsTaken[team]++
                    let shotValue = 0
                    if (shot.three_point_shot) {
                        threePointersTaken[team]++
                        shotValue = 3
                    } else if (shot.type === 'freethrow') {
                        freeThrowsTaken[team]++
                        shotValue = 1
                    } else {
                        twoPointersTaken[team]++
                        shotValue = 2

                    }


                    if (shot.type === 'freethrow') {
                        expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['ft'] / 100) * shotValue

                        expectedScore[team] += expectedPoints
                        if (!playerScoring[team][shot.player.full_name]) {
                            playerScoring[team][shot.player.full_name] = {}
                        }
                        if (playerScoring[team][shot.player.full_name].expected) {
                            playerScoring[team][shot.player.full_name].expected += expectedPoints
                        } else {
                            playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                        }
                        if (shot.made) {
                            actualScore[team] += shotValue
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (!playerScoring[team][shot.player.full_name].actual) {
                                playerScoring[team][shot.player.full_name]['actual'] = shotValue
                            } else {
                                playerScoring[team][shot.player.full_name].actual += shotValue

                            }
                        }
                    } else {
                        if (shot.shot_distance > 0 && shot.shot_distance <= 4) {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_0_4'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 4 && shot.shot_distance <= 9) {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_5_9'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 9 && shot.shot_distance <= 14) {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_10_14'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 14 && shot.shot_distance <= 19) {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_15_19'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

                                }
                            }
                        } else if (shot.shot_distance > 19 && shot.shot_distance <= 24) {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_20_24'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

                                }
                            }
                        } else {
                            const expectedPoints = (currentTeamShootingPercentages[team][shot.player.full_name]['_25_29'] / 100) * shotValue
                            expectedScore[team] += expectedPoints
                            if (!playerScoring[team][shot.player.full_name]) {
                                playerScoring[team][shot.player.full_name] = {}
                            }
                            if (playerScoring[team][shot.player.full_name].expected) {
                                playerScoring[team][shot.player.full_name].expected += expectedPoints
                            } else {
                                playerScoring[team][shot.player.full_name]['expected'] = expectedPoints
                            }
                            if (shot.made) {
                                actualScore[team] += shotValue
                                if (!playerScoring[team][shot.player.full_name]) {
                                    playerScoring[team][shot.player.full_name] = {}
                                }
                                if (!playerScoring[team][shot.player.full_name].actual) {
                                    playerScoring[team][shot.player.full_name]['actual'] = shotValue
                                } else {
                                    playerScoring[team][shot.player.full_name].actual += shotValue

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


    let contentByTeam = {}

    for (let team in expectedScore) {
        let writeContent = ''
        const oponentScore = allEvents.home.name !== team ? allEvents.home.points : allEvents.away.points
        writeContent += `Summary for ${team}\n\n`
        writeContent += 'Expected Score: ' + expectedScore[team] + '\n'
        writeContent += 'Actual Score: ' + actualScore[team] + '\n'
        writeContent += 'Difference: ' + (actualScore[team] - expectedScore[team]) + '\n'
        writeContent += 'Opponent Score: ' + (oponentScore) + '\n'
        writeContent += 'Game Outcome: ' + (oponentScore > actualScore[team] ? 'Loss' : "Win") + '\n'
        writeContent += 'Two Pointers Taken: ' + twoPointersTaken[team] + '\n'
        writeContent += 'Three Pointers Taken: ' + threePointersTaken[team] + '\n'
        writeContent += 'Free Throws Taken: ' + freeThrowsTaken[team] + '\n'
        writeContent += 'Total Shots Taken: ' + totalShotsTaken[team] + '\n'
        let playerScoringContent = ''
        for (let player in playerScoring[team]) {
            playerScoringContent += '\t' + player + ': \n'
            playerScoringContent += '\t\tShots Taken: ' + playerStats[team][player].length + '\n'
            playerScoringContent += '\t\t' + 'Expected: ' + playerScoring[team][player].expected + '\n'
            playerScoringContent += '\t\t' + 'Actual: ' + playerScoring[team][player].actual + '\n'
            playerScoringContent += '\t\t' + 'Difference: ' + (playerScoring[team][player].actual - playerScoring[team][player].expected) + '\n'
        }
        writeContent += 'Player Scoring: \n' + playerScoringContent + '\n\n\n'
        contentByTeam[team] = writeContent
    }

    const totalContent = contentByTeam["Jazz"] + contentByTeam[opponent]

    fs.writeFileSync(`./results/${date}-${home}-${away}-${shootingFile}.txt`, totalContent)
}
main()