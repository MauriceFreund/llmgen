#!/usr/bin/env node
import { config } from 'dotenv';
import { runGenerator } from './runGenerator';
import { withBasePath } from './util/Utility';

config({ path: withBasePath('../.env') });

const configPath: string = process.argv[2];
const isInEvalMode: boolean = process.argv.length === 4 && process.argv[3] === 'eval';
runGenerator(configPath, isInEvalMode).then(() => console.log('Done.'));
