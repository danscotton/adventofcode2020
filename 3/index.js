const fs = require('fs')
const path = require('path')

const readFile = async () =>
    new Promise((resolve) =>
        fs.readFile(
            path.resolve(__dirname, 'data.txt'),
            'utf-8',
            (_error, data) => resolve(data),
        ),
    )

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const log = (m) => console.log(m)
const filter = (fn) => (a) => a.filter(fn)
const get = (prop) => (o) => o[prop]
const isTree = (x) => x === '#'
const count = (a) => a.length
const parseFile = (file) =>
    file
        .split('\n')
        .filter((l) => l)
        .map((l) => l.split(''))

const debug = (i, line, position) =>
    console.log(
        [
            `${i}`.padStart(3).padEnd(5),
            line.join(''),
            '\n',
            '^'.padStart(position + 1 + 5),
        ].join(''),
    )

const reduce = ({ start, slope }) => (data) => {
    const [slopeX, slopeY] = slope
    const move = ([x, y]) => [x + slopeX, y + slopeY]

    return data.reduce(
        ({ locations, next }, line, i) => {
            const [x, y] = next

            if (i !== y) {
                return { locations, next }
            }

            const normalise = (x) => x % line.length

            debug(i, line, normalise(x))

            return {
                locations: [...locations, line[normalise(x)]],
                next: move(next),
            }
        },
        { locations: [], next: move(start) },
    )
}

const run = async ({ start, slope }) =>
    readFile().then(
        pipe(
            parseFile,
            reduce({ start, slope }),
            get('locations'),
            filter(isTree),
            count,
        ),
    )

const multiply = (data) => data.reduce((output, n) => output * n, 1)

Promise.all([
    run({ start: [0, 0], slope: [1, 1] }),
    run({ start: [0, 0], slope: [3, 1] }),
    run({ start: [0, 0], slope: [5, 1] }),
    run({ start: [0, 0], slope: [7, 1] }),
    run({ start: [0, 0], slope: [1, 2] }),
]).then(pipe(multiply, log))
