const fs = require('fs')
const path = require('path')

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const log = (m) => console.log(m)
const split = (char) => (s) => s.split(char)
const join = (char = '') => (a) => a.join(char)
const filter = (fn) => (a) => a.filter(fn)
const map = (fn) => (a) => a.map(fn)

const id = pipe(map(join()), join())

const readFile = async (file) =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, file), 'utf-8', (_error, data) =>
            resolve(data),
        ),
    )

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(split('')),
)

const positions = {
    EMPTY: 'L',
    OCCUPIED: '#',
    FLOOR: '.',
}

const isEmpty = (value) => value === positions.EMPTY
const isOccupied = (value) => value === positions.OCCUPIED

const applyPosition = ([x, y]) => ([i, j]) => [x + i, y + j]
const getValue = (layout) => ([x, y]) => layout?.[y]?.[x]

const adjacentSeatsOccupied = (position, layout) =>
    [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
    ]
        .map(applyPosition(position))
        .map(getValue(layout))
        .filter(isOccupied)

const debugPosition = ([x, y], value, layout) => {
    console.log(
        `[${x} ${y}] ${value} (${adjacentSeatsOccupied([x, y], layout)})`,
    )
}

const apply = (position, value, layout) => {
    // debugPosition(position, value, layout)

    if (
        isEmpty(value) &&
        adjacentSeatsOccupied(position, layout).length === 0
    ) {
        return positions.OCCUPIED
    }

    if (
        isOccupied(value) &&
        adjacentSeatsOccupied(position, layout).length >= 4
    ) {
        return positions.EMPTY
    }

    return value
}

const debug = pipe(map(join()), join('\n'), log)

const applyRules = (layout) =>
    layout.map((line, y) =>
        line.map((value, x) => apply([x, y], value, layout)),
    )

const process = (layout) => {
    const applied = applyRules(layout)

    if (id(applied) === id(layout)) {
        return id(layout).split('').filter(isOccupied).length
    }

    // console.log('-----------------------------------')
    // debug(applied)
    // console.log('-----------------------------------')
    return process(applied)
}

const run = () => readFile('data.txt').then(pipe(parseFile, process, log))

run()
