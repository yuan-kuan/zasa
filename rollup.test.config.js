
import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';


// if (process.env.LOCAL) {
//   config({ path: '.env.local' });
// } else {
//   config();
// }
config({ path: '.env.local' });

export default {
  plugins: [
    replace({
      // stringify the object
      LOCAL_DB_URL: JSON.stringify(process.env.LOCAL_DB_URL),
      LOCAL_DB_USERNAME: JSON.stringify(process.env.LOCAL_DB_USERNAME),
      LOCAL_DB_PASSWORD: JSON.stringify(process.env.LOCAL_DB_PASSWORD),
      REMOTE_BACKUP_CRED_URL: JSON.stringify(process.env.REMOTE_BACKUP_CRED_URL),
      preventAssignment: true,
    }),
    alias({
      entries: [
        { find: 'fp', replacement: __dirname + '/src/fp' },
        { find: 'view', replacement: __dirname + '/src/view' },
        { find: 'app', replacement: __dirname + '/src/app' },
      ]
    }),
  ],
};
