#!/usr/bin/env node
const program = require('commander');
program.version(`zhang-cli 0.0.0}`).usage('<command> [options]');

program
  .command('create <app-name>')
  .description('create a new project powered by vue-cli-service')
  .action((name) => {
    console.log(name);
  });

program.parse(process.argv);
