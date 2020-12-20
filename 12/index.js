const fs = require('fs')
const path = require('path')

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const log = (m) => console.log(m)
const split = (char) => (s) => s.split(char)
const filter = (fn) => (a) => a.filter(fn)
const map = (fn) => (a) => a.map(fn)

const readFile = (file) =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, file), 'utf-8', (_error, data) =>
            resolve(data),
        ),
    )

const parseInstruction = (instruction) => {
    const type = instruction.slice(0, 1)
    const value = Number.parseInt(instruction.slice(1), 10)

    return { type, value }
}

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseInstruction),
)

const north = ({ position: [x, y], direction }, value) => ({
    position: [x, y - value],
    direction,
})

const east = ({ position: [x, y], direction }, value) => ({
    position: [x + value, y],
    direction,
})

const south = ({ position: [x, y], direction }, value) => ({
    position: [x, y + value],
    direction,
})

const west = ({ position: [x, y], direction }, value) => ({
    position: [x - value, y],
    direction,
})

const left = ({ position, direction }, value) => {
    const out = (direction) => ({ position, direction })

    switch (value) {
        case 90: {
            switch (direction) {
                case 'N':
                    return out('W')
                case 'E':
                    return out('N')
                case 'S':
                    return out('E')
                case 'W':
                    return out('S')
            }
        }

        case 180: {
            switch (direction) {
                case 'N':
                    return out('S')
                case 'E':
                    return out('W')
                case 'S':
                    return out('N')
                case 'W':
                    return out('E')
            }
        }

        case 270: {
            switch (direction) {
                case 'N':
                    return out('E')
                case 'E':
                    return out('S')
                case 'S':
                    return out('W')
                case 'W':
                    return out('N')
            }
        }

        default:
            throw new Error('Unknown degree for turning right')
    }
}

const right = ({ position, direction }, value) => {
    const out = (direction) => ({ position, direction })

    switch (value) {
        case 90: {
            switch (direction) {
                case 'N':
                    return out('E')
                case 'E':
                    return out('S')
                case 'S':
                    return out('W')
                case 'W':
                    return out('N')
            }
        }

        case 180: {
            switch (direction) {
                case 'N':
                    return out('S')
                case 'E':
                    return out('W')
                case 'S':
                    return out('N')
                case 'W':
                    return out('E')
            }
        }

        case 270: {
            switch (direction) {
                case 'N':
                    return out('W')
                case 'E':
                    return out('N')
                case 'S':
                    return out('E')
                case 'W':
                    return out('S')
            }
        }

        default:
            throw new Error('Unknown degree for turning right')
    }
}

const forward = (current, value) => {
    switch (current.direction) {
        case 'N':
            return north(current, value)
        case 'E':
            return east(current, value)
        case 'S':
            return south(current, value)
        case 'W':
            return west(current, value)
    }
}

const apply = ({ type, value }, current) => {
    switch (type) {
        case 'N':
            return north(current, value)
        case 'E':
            return east(current, value)
        case 'S':
            return south(current, value)
        case 'W':
            return west(current, value)

        case 'L':
            return left(current, value)
        case 'R':
            return right(current, value)

        case 'F':
            return forward(current, value)

        default:
            throw new Error(`Unknown instruction: ${type}`)
    }
}

const process = (start) => (instructions) => {
    return instructions.reduce((current, instruction) => {
        return apply(instruction, current)
    }, start)
}

const calculateManhattanDistance = ({ position: [x, y] }) =>
    Math.abs(x) + Math.abs(y)

const run = (start) =>
    readFile('data.txt').then(
        pipe(parseFile, process(start), calculateManhattanDistance, log),
    )

run({ position: [0, 0], direction: 'E' })
