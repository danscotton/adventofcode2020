const fs = require('fs')
const path = require('path')

const readFile = async (file) =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, file), 'utf-8', (_error, data) =>
            resolve(data),
        ),
    )

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const log = (m) => console.log(m)
const split = (char) => (s) => s.split(char)
const filter = (fn) => (a) => a.filter(fn)
const map = (fn) => (a) => a.map(fn)
const sort = (fn) => (a) => a.sort(fn)
const parseNum = (n) => Number.parseInt(n, 10)
const byNum = (a, b) => a - b

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseNum),
)

const process = (numbers) => {
    return [0, ...numbers].reduce(
        (output, number, index, numbers) => {
            const x = numbers[index + 1] ? numbers[index + 1] - number : 3

            return {
                ...output,
                [x]: output[x] + 1,
            }
        },
        { 1: 0, 2: 0, 3: 0 },
    )
}

const multiply = (jolts) => jolts[1] * jolts[3]

const run = () =>
    readFile('data.txt').then(
        pipe(parseFile, sort(byNum), process, multiply, log),
    )

run()
