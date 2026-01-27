import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function need(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

async function main() {
  const username = need("ADMIN_BOOTSTRAP_USERNAME");
  const password = need("ADMIN_BOOTSTRAP_PASSWORD");
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL || null;

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash, email },
    create: { username, passwordHash, email },
  });

  console.log(`Admin user ready: ${admin.username}${admin.email ? ` <${admin.email}>` : ""}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
