import { createTestHelper } from 'test/utils';
import { setupBackupInterpretor, sync } from 'app/sop/backup';
import { config } from 'dotenv';

test('Local backup setup', async () => {
  config({ path: '.env.local' });

  const interpret = createTestHelper(true, false, [setupBackupInterpretor()]).setup();
  const fm = sync('a');

  const result = await interpret(fm);
  console.log('result :>> ', result);

  throw Error('incomplete test');
});
