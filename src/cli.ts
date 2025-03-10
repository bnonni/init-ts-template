#!/usr/bin/env node
import { program } from 'commander';
import TsTemplate from './ts-template.js';
// const pkg = require('../../package.json');
// cli: init-ts-template
// TODO: support all possible options as per TsTemplate.init
program
  .version(`init-ts-template`, '-v, --version', 'Output the current version.')
  .description('TypeScript project template initializer with support for tsconfig.')
  .option('-s, --skip', 'Skip all prompts accepting all defaults.')
  .option('-n, --name <name>', 'Package name.')
  .option('-d, --description <description>', 'Package description.')
  .action(async (options: any) => await TsTemplate.init(options))
  .parse();