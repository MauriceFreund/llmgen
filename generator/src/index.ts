#!/usr/bin/env node
import { runGenerator } from './runGenerator';

const configPath: string = process.argv[2];
runGenerator(configPath).then(() => console.log('Done.'));
