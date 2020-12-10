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

const parseLine = (line) => {
    const [colour, contains] = line.split('bags contain').map((s) => s.trim())
    const bags = contains.split(',').reduce((output, part) => {
        const [, count, colour] = part.match(/(\d+)\s(.*)\sbags?/) || []
        return [
            ...output,
            ...(count ? [{ count: Number.parseInt(count, 10), colour }] : []),
        ]
    }, [])

    return { colour, bags }
}

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseLine),
)

const toAdjacenyList = (bags) =>
    bags.reduce(
        (output, { colour, bags }) => ({
            ...output,
            [colour]: bags.reduce(
                (o, bag) => ({ ...o, [bag.colour]: bag.count }),
                {},
            ),
        }),
        {},
    )

const dfs = (list) => (bag) => {
    const go = (bag, visited) => {
        const bags = Object.keys(list[bag])

        if (bags.length === 0) {
            return [visited]
        }

        return bags.flatMap((b) => go(b, [...visited, b]))
    }

    return go(bag, [bag])
}

const doDfs = (list) => {
    return Object.keys(list).flatMap(dfs(list))
}

const bagsContaining = (bag) => (paths) => {
    return paths.reduce((output, path) => {
        const index = path.indexOf(bag)

        if ([-1, 0].includes(index)) {
            return output
        }

        return output.add(...path.slice(0, index))
    }, new Set())
}

const count = (a) => a.size

const run = (bag) =>
    readFile('data.txt').then(
        pipe(parseFile, toAdjacenyList, doDfs, bagsContaining(bag), count, log),
    )

run('shiny gold')
