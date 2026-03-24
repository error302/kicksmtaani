import {
  registerSchema,
  loginSchema,
  RegisterInput,
  LoginInput,
} from "./schema.js";
import {
  createUser,
  validateUserPassword,
  findUserById,
} from "./repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  TokenPayload,
} from "../../lib/jwt.js";
import { logger } from "../../lib/logger.js";

export async function register(input: RegisterInput) {
  const data = registerSchema.parse(input);

  const user = await createUser({
    email: data.email,
    phone: data.phone,
    password: data.password,
    fullName: data.fullName,
  });

  logger.info("User registered", { userId: user.id, email: user.email });

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export async function login(input: LoginInput) {
  const data = loginSchema.parse(input);

  const user = await validateUserPassword(data.email, data.password);
  if (!user) {
    throw {
      statusCode: 401,
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    };
  }

  logger.info("User logged in", { userId: user.id });

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    throw { statusCode: 404, code: "NOT_FOUND", message: "User not found" };
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
}
