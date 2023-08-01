#!/usr/bin/env node

import { ChatAPI } from './index';

const prompt = process.argv[2];

const chatAPI = new ChatAPI(process.env.OPENAI_API_KEY || '');

chatAPI.chatReminder(prompt)
