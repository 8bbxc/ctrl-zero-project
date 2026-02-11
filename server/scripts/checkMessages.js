(async function(){
  try{
    const prisma = require('../src/utils/prisma');
    const msgs = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
    console.log('MESSAGES COUNT:', msgs.length);
    console.dir(msgs.slice(0,10), { depth: 2 });
    await prisma.$disconnect();
  } catch (e) {
    console.error('ERROR', e.message || e);
    process.exit(1);
  }
})();
