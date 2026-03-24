import { prisma } from "@kicksmtaani/db";
import { hashPassword, verifyPassword } from "../../lib/password.js";

export async function createUser(data: {
  email: string;
  phone: string;
  password: string;
  fullName: string;
}) {
  const passwordHash = await hashPassword(data.password);
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      phone: data.phone,
      passwordHash,
      fullName: data.fullName,
    },
  });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function validateUserPassword(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  return user;
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
