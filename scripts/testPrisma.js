const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const u = await p.user.findUnique({ where: { email: 'user1@example.com' } });
    console.log('OK', u);
  } catch (e) {
    console.error('ERR', e);
  } finally {
    await p.$disconnect();
  }
})();