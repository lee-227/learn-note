#!/usr/bin/env node
const program = require('commander');
program
    .version(`@vue/lee-cli ${require('../package').version}`)
    .usage('<command> [options]')

program
    .command('create <app-name>')
    .description('create a new project powered by vue-cli-service')
    .action((name) => {
        require('../lib/create')(name)
    })

program.parse(process.argv)