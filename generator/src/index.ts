#!/usr/bin/env node
import { runGenerator } from './runGenerator';

const configPath: string = process.argv[2];
const isInEvalMode: boolean = process.argv.length === 4 && process.argv[3] === 'eval';
runGenerator(configPath, isInEvalMode).then(() => console.log('Done.'));
