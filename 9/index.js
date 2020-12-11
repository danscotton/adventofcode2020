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
const parseNum = (n) => Number.parseInt(n, 10)

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseNum),
)

const process = (n) => (numbers) => {
    const sums = (numbers) =>
        numbers
            .flatMap((i) => numbers.map((j) => (i === j ? null : i + j)))
            .filter((n) => n)

    const go = ({ index, check }) => {
        if (sums(numbers.slice(index, n + index)).includes(check)) {
            return go({
                index: index + 1,
                check: numbers[index + 1 + n],
            })
        }

        return check
    }

    return go({ index: 0, check: numbers[n] })
}

const run = (n) => readFile('data.txt').then(pipe(parseFile, process(n), log))

run(25)
