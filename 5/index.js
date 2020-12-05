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
const split = (char) => (s) => s.split(char)
const map = (fn) => (a) => a.map(fn)
const filter = (fn) => (a) => a.filter(fn)
const replace = (search, replace) => (s) => s.replaceAll(search, replace)
const parseBinary = (n) => parseInt(n, 2)
const prop = (p) => (o) => o[p]
const max = (a) => Math.max(...a)
const sort = (fn) => (a) => a.sort(fn)
const byNum = (a, b) => a - b

const parseRow = pipe(replace('F', 0), replace('B', 1), parseBinary)
const parseColumn = pipe(replace('L', 0), replace('R', 1), parseBinary)

const parseBoardingPass = (s) => {
    const row = parseRow(s.slice(0, 7))
    const column = parseColumn(s.slice(7))
    const id = row * 8 + column

    return { row, column, id }
}

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseBoardingPass),
)

const findSeat = ([first, ...rest], num) =>
    first === num ? findSeat(rest, num + 1) : num

const findMissingSeat = (seats) => findSeat(seats, seats[0])

const run = () =>
    readFile().then(
        pipe(parseFile, map(prop('id')), sort(byNum), findMissingSeat, log),
    )

run()
