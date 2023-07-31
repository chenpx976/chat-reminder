import { chat } from '../src';

describe('blah', () => {
  it('works', async () => {
    expect(await chat('晚上吃饭')).toEqual('');
  });
});
