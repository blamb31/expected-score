import * as fs from "fs"

interface HighLow {
    val: number,
    game: any
}

const median = (arr: number[]): number => {
    const mid: number = Math.floor(arr.length / 2),
        nums = [ ...arr ].sort((a, b) => Number(a) - Number(b));
    return arr.length % 2 !== 0 ? nums[ mid ] : (nums[ mid - 1 ] + nums[ mid ]) / 2;
};


const main = async () => {
    let startDate: Date = new Date('2021-20-20')
    let gameCount: number = 0;

    if (process.argv[ 2 ]) {
        startDate = new Date(process.argv[ 2 ]);
    }

    const files = fs.readdirSync('./results');

    let totalExpected: number = 0;
    let totalActual: number = 0;

    let totalOver: number = 0;
    let totalUnder: number = 0;

    let totalPointsOver: number = 0;
    let totalPointsUnder: number = 0;

    let pointsDiffInWins: number = 0;
    let pointsDiffInLosses: number = 0;

    let totalWins: number = 0;
    let totalLosses: number = 0;

    let highestOver: HighLow = {val: 0, game: null};
    let lowestUnder: HighLow = {val: 0, game: null};

    let allDiffs: number[] = [];

    //read file
    files.forEach((file: string) => {
        const fileParts: string[] = file.split('-');
        const gameDate: Date = new Date(`${fileParts[ 0 ]}-${fileParts[ 1 ]}-${fileParts[ 2 ]}`);

        if (gameDate.getTime() < startDate.getTime()) {
            return
        }

        gameCount++;

        const data: string = fs.readFileSync(`./results/${file}`, 'utf8');
        const dataArr: string[] = data.split('\n');

        const expected: number = parseFloat(dataArr[ 2 ].split(':')[ 1 ].trim());
        const actual: number = parseInt(dataArr[ 3 ].split(':')[ 1 ].trim());
        const outcome: string = dataArr[ 6 ].split(':')[ 1 ].trim();
        const diff: number = actual - expected;

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