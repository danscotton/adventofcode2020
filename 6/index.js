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
const split = (char) => (s) => s.split(char)
const join = (char) => (a) => a.join(char)
const filter = (fn) => (a) => a.filter(fn)
const map = (fn) => (a) => a.map(fn)
const flatMap = (fn) => (a) => a.flatMap(fn)
const take = (n) => (a) => a.slice(0, 20)
const last = (n) => (a) => a.slice(n * -1)
const replace = (search, replace) => (s) => s.replaceAll(search, replace)
const toSet = (a) => new Set(a)
const log = (m) => console.log(m)
const count = (a) => a.length
const sum = (initial) => (a) => a.reduce((o, n) => o + n, initial)
const tally = (a) =>
    a.reduce((o, l) => {
        return {
            ...o,
            [l]: o[l] ? o[l] + 1 : 1,
        }
    }, {})

const tap = (fn) => (x) => {
    fn(x)
    return x
}

const tallyAnswers = (group) => {
    const size = group.length

    return pipe(
        flatMap(split('')),
        tally,
        Object.entries,
        filter(([_, c]) => c === size),
    )(group)
}

// part a
// const parseGroup = pipe(replace('\n', ''), split(''), toSet, Array.from)

// part b
const parseGroup = pipe(
    split('\n'),
    filter((l) => l),
    tallyAnswers,
)

const parseFile = pipe(split('\n\n'), map(parseGroup), map(count), sum(0))

const run = () => readFile().then(pipe(parseFile, log))

run()
