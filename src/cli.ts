#!/usr/bin/env node

import { chatReminder } from './index';

const prompt = process.argv[2];
chatReminder(prompt);
