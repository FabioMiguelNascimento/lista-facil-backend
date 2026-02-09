require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

(async () => {
  const connectionString = process.env.DATABASE_URL;
  console.log('Using DATABASE_URL=', connectionString);
  const adapter = new PrismaPg({ connectionString });
  const p = new PrismaClient({ adapter });
  try {
    const u = await p.user.findUnique({ where: { email: 'user1@example.com' } });
    console.log('OK', u);
  } catch (e) {
    console.error('ERR', e);
    if (e && e.meta) console.error('meta:', e.meta);
    if (e && e.meta && e.meta.driverAdapterError) console.error('driverAdapterError message:', e.meta.driverAdapterError.message);
  } finally {
    await p.$disconnect();
  }
})();