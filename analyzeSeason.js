const fs = require('fs');

const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => parseInt(a) - parseInt(b));
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};


const main = async () => {
    let startDate = new Date('2021-20-20')
    let gameCount = 0;

    if (process.argv[3]) {
        startDate = new Date(process.argv[3]);
    }
    const seasonYears = process.argv[2] || "2022-2023"

    const files = fs.readdirSync(`./results/${seasonYears}`);

    let totalExpected = 0;
    let totalActual = 0;

    let totalOver = 0;
    let totalUnder = 0;

    let totalPointsOver = 0;
    let totalPointsUnder = 0;

    let pointsDiffInWins = 0;
    let pointsDiffInLosses = 0;

    let totalWins = 0;
    let totalLosses = 0;

    let highestOver = { val: 0, game: null };
    let lowestUnder = { val: 0, game: null };

    let allDiffs = [];

    //read file
    files.forEach(file => {
        const fileparts = file.split('-');
        const gameDate = new Date(`${fileparts[0]}-${fileparts[1]}-${fileparts[2]}`);

        if (gameDate.getTime() < startDate.getTime()) {
            return
        }

        gameCount++;

        const data = fs.readFileSync(`./results/${seasonYears}/${file}`, 'utf8');
        const dataArr = data.split('\n');

        const expected = parseFloat(dataArr[2].split(':')[1].trim());
        const actual = parseInt(dataArr[3].split(':')[1].trim());
        const outcome = dataArr[6].split(':')[1].trim();
        const diff = actual - expected;

        allDiffs.push(diff);

        totalExpected += expected;
        totalActual += actual;

        if (actual >= expected) {
            totalOver += 1;
            totalPointsOver += diff;
        } else {
            totalUnder += 1;
            totalPointsUnder += expected - actual;
        }

        if (outcome === "Win") {
            totalWins += 1;
            pointsDiffInWins += (diff)
        } else {
            totalLosses += 1;
            pointsDiffInLosses += (diff)
        }

        if (diff > highestOver.val) {
            highestOver.val = diff;
            highestOver.game = file;
        }
        if (diff < lowestUnder.val) {
            lowestUnder.val = diff;
            lowestUnder.game = file;
        }

    });
    console.log({
        totalActual,
        totalExpected,
        diff: totalActual - totalExpected,
        avgDif: (totalActual - totalExpected) / gameCount,
        totalOver, totalUnder,
        avgOver: totalPointsOver / gameCount,
        avgUnder: totalPointsUnder / gameCount * -1,
        pointDiffInWins: pointsDiffInWins / totalWins,
        pointDiffInLosses: pointsDiffInLosses / totalLosses,
        highestOverValue: highestOver.val,
        highestOverGame: highestOver.game,
        lowestUnderValue: lowestUnder.val,
        lowestUnderGame: lowestUnder.game,
        medianDiff: median(allDiffs),
    });
}

main()