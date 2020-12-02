const fs = require('fs')
const path = require('path')

const readData = async () =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, 'data.txt'), 'utf8', (_error, data) => {
            resolve(data)
        }),
    )

const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const toArray = (s) => s.split('\n').filter((s) => s)
const log = (x) => console.log(x)
const map = (fn) => (a) => a.map(fn)
const parsePolicy = (policy) => {
    const [counts, letter] = policy.split(' ')
    const [min, max] = counts.split('-').map((s) => Number.parseInt(s, 10))

    return { min, max, letter }
}
const parsePolicy2 = (policy) => {
    const [numbers, letter] = policy.split(' ')
    const positions = numbers.split('-').map((s) => Number.parseInt(s, 10))

    return { positions, letter }
}
const toPolicyObject = (policyFn) => (s) => {
    const [policy, password] = s.split(':').map((s) => s.trim())

    return { policy: policyFn(policy), password }
}

const validate = ({ policy: { min, max, letter }, password }) => {
    const count = password.split('').filter((l) => l === letter).length
    return min <= count && count <= max
}

const validate2 = ({
    policy: {
        positions: [a, b],
        letter,
    },
    password,
}) => {
    return [password[a - 1], password[b - 1]].filter((l) => l === letter).length === 1
}

const addValidation = (fn) => (o) => ({
    ...o,
    isValid: fn(o),
})

const reduce = (policies) => policies.reduce((acc, { isValid }) => (isValid ? acc + 1 : acc), 0)

const run1 = () =>
    readData().then(
        pipe(toArray, map(toPolicyObject(parsePolicy)), map(addValidation(validate)), reduce, log),
    )

const run2 = () =>
    readData().then(
        pipe(
            toArray,
            map(toPolicyObject(parsePolicy2)),
            map(addValidation(validate2)),
            reduce,
            log,
        ),
    )

// run1()
run2()
