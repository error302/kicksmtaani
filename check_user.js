const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@sneakroom.co.ke" }
  });
  console.log(JSON.stringify(user, null, 2));
  await prisma.$disconnect();
}

checkUser();
