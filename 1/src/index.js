const fs = require('fs')
const path = require('path')

const readData = async () =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, '..', 'data.txt'), 'utf8', (_error, data) => {
            resolve(data)
        }),
    )

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const toArray = (s) => s.split('\n')
const log = (x) => console.log(x)
const map = (fn) => (a) => a.map(fn)
const toNumber = (s) => Number.parseInt(s, 10)

const toPairs = (x) => x.flatMap((n) => x.map((m) => [n, m]))
const toTriples = (x) => x.flatMap((n) => x.flatMap((m) => x.map((o) => [n, m, o])))
const reduce = (pairs) =>
    pairs.reduce((acc, [a, b]) => {
        if (acc !== 0) {
            return acc
        }

        if (a + b === 2020) {
            return a * b
        }

        return acc
    }, 0)

const reduce3 = (triples) =>
    triples.reduce((acc, [a, b, c]) => {
        if (acc !== 0) {
            return acc
        }

        if (a + b + c === 2020) {
            return a * b * c
        }

        return acc
    }, 0)

const first = () => readData().then(pipe(toArray, map(toNumber), toPairs, reduce, log))
const second = () => readData().then(pipe(toArray, map(toNumber), toTriples, reduce3, log))

// first()
second()
