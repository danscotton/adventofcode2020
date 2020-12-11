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

const parseInstruction = (instruction, index) => {
    const [operation, argument] = instruction.split(' ')

    return { index, operation, argument: Number.parseInt(argument, 10) }
}

const parseFile = pipe(
    split('\n'),
    filter((l) => l),
    map(parseInstruction),
)

const runProgram = (instructions) => {
    const _switch = (operation) => (operation === 'nop' ? 'jmp' : 'nop')

    const switches = instructions
        .filter((instruction) => ['nop', 'jmp'].includes(instruction.operation))
        .map((instruction) => instruction.index)

    const go = ({ index, value, ran, switches }) => {
        console.log(index, value, ran, switches)

        if (index === instructions.length) {
            return value
        }

        const { operation, argument } = instructions[index]

        const [head, ...rest] = switches
        if (ran.includes(index)) {
            return go({ index: 0, value: 0, ran: [], switches: rest })
        }

        const o = index === head ? _switch(operation) : operation

        switch (o) {
            case 'nop':
                return go({
                    index: index + 1,
                    value,
                    ran: [...ran, index],
                    switches,
                })

            case 'acc':
                return go({
                    index: index + 1,
                    value: value + argument,
                    ran: [...ran, index],
                    switches,
                })

            case 'jmp':
                return go({
                    index: index + argument,
                    value,
                    ran: [...ran, index],
                    switches,
                })
        }
    }

    return go({ index: 0, value: 0, ran: [], switches })
}

const run = () => readFile('data.txt').then(pipe(parseFile, runProgram, log))

run()
