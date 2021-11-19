# expected-score

## Description

This is a basketball stat that I've come up with to show the expected score of a game based on the shooting percentages from certain distances of each shot for the player shooting. 

Basic calculation:

singleShotExpectedScore = playerShootingPercentageFromDistanceOfShot * ShotPointValue
gameExpectedScore = sum of all singleShotExpectedScore for a team

## Use

Argv order:

0. node
1. String, file to run
2. String, shootingNumbers file name
3. Boolean, true to use a gameStats file that already exists, false to create a new one
4. String, filename of gameStats file to use or gameId to fetch

Example - using a gameId input from the command line
- node index.js jazzShootingNumbers2020-2021 false {{gameId}}

Example - using a preloaded gameStats file

- node index.js jazzShootingNumbers2020-2021 true 2021-11-11-jazz-pacers
