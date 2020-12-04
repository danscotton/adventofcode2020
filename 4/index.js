const fs = require('fs')
const path = require('path')

const readFile = async () =>
    new Promise((resolve) =>
        fs.readFile(path.resolve(__dirname, 'data.txt'), 'utf-8', (_error, data) => resolve(data)),
    )

const split = (char) => (s) => s.split(char)
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)
const flatMap = (fn) => (a) => a.flatMap(fn)
const map = (fn) => (a) => a.map(fn)
const reduce = (fn, initial = {}) => (a) => a.reduce(fn, initial)
const filter = (fn) => (a) => a.filter(fn)
const count = (a) => a.length
const log = (m) => console.log(m)

const toPassportObject = (output, field) => {
    const [name, value] = field.split(':').map((x) => x.trim())
    return { ...output, [name]: value }
}

const parsePassport = pipe(split('\n'), flatMap(split(' ')), reduce(toPassportObject))
const parseFile = pipe(split('\n\n'), map(parsePassport))

const validate = (validators) => (passport) =>
    validators.every(({ field, validate }) => passport[field] && validate(passport[field]))

const run = (validators) =>
    readFile().then(pipe(parseFile, filter(validate(validators)), count, log))

const contains = (a) => (value) => a.includes(value)
const all = (...fns) => (value) => fns.every((fn) => fn(value))
const or = (...fns) => (value) => fns.some((fn) => fn(value))
const isNumber = (digits) => (value) => new RegExp(`^\\d{${digits}}$`).test(value)
const isMin = (number) => (value) => value >= number
const isMax = (number) => (value) => value <= number
const isNum = ({ length, min, max }) => all(isNumber(length), isMin(min), isMax(max))
const isHex = () => (value) => /^#[0-9a-f]{6}$/.test(value)
const parseNum = (value) => Number.parseInt(value, 10)
const hasSuffix = (suffix) => (value) => value.endsWith(suffix)
const hasHeight = ({ unit, min, max }) =>
    all(hasSuffix(unit), pipe(parseNum, isMin(min)), pipe(parseNum, isMax(max)))
const isPassportId = () => (value) => /^[0-9]{9}$/.test(value)

const validators = [
    { field: 'byr', validate: isNum({ length: 4, min: 1920, max: 2002 }) },
    { field: 'iyr', validate: isNum({ length: 4, min: 2010, max: 2020 }) },
    { field: 'eyr', validate: isNum({ length: 4, min: 2020, max: 2030 }) },
    {
        field: 'hgt',
        validate: or(
            hasHeight({ unit: 'cm', min: 150, max: 193 }),
            hasHeight({ unit: 'in', min: 59, max: 76 }),
        ),
    },
    { field: 'hcl', validate: isHex() },
    { field: 'ecl', validate: contains('amb blu brn gry grn hzl oth'.split(' ')) },
    { field: 'pid', validate: isPassportId() },
]

run(validators)
