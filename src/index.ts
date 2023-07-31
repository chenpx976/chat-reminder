import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import dayjs from 'dayjs';
import * as reminders from 'node-reminders';

const safeParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

const getSchema = z.object({
  taskName: z.string(),
  taskDate: z.date(),
});
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const chat = async (prompt: any) => {
  const response = await openai.createChatCompletion({
    'model': 'gpt-3.5-turbo-0613',
    'messages': [
      {
        'role': 'user',
        'content': prompt,
      },
    ],
    'functions': [
      {
        'name': 'print_taskName_taskDate',
        'description': `a function that prints the taskName and taskDate(YYYY-MM-DD HH:mm) of the prompt, now is ${dayjs().format(
          'YYYY-MM-DD HH:mm'
        )}`,
        'parameters': zodToJsonSchema(getSchema),
      },
    ],
    function_call: {
      name: 'print_taskName_taskDate',
    },
  });
  return response.data.choices[0].message?.function_call?.arguments;
};

export const chatReminder =async (content = '', defaultList = '我的工作') => {
  if (!content) {
    return '';
  }
  const response: any = await chat(content);
  const { taskName, taskDate } = safeParse(response);
  console.log('custom-debug:taskName, taskDate', taskName, taskDate);
  const remindMeDate = new Date(taskDate);
  const list = await reminders.getLists();
  const listId = list.find((item) => item.name === defaultList)?.id;
  if (!listId) {
    throw new Error('listId not found');
  }
  return reminders.createReminder(listId, {
    name: taskName,
    body: '', // 你可以根据需求更改这里的 body
    remindMeDate,
    completed: false,
  });
}
