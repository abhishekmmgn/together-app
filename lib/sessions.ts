"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionPayload } from "@/lib/definitions";

const secretKey = process.env.TOKEN_SECRET;
const key = new TextEncoder().encode(secretKey);

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  },
  duration: 60 * 60 * 24 * 30,
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });

  // Store the session in cookies for optimistic auth checks
  cookies().set(cookie.name, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  redirect("/");
}

export async function verifySession() {
  const returnedCookie = cookies().get(cookie.name)?.value;
  const session = await decrypt(returnedCookie);
  if (!session?.userId) {
    redirect("/login");
  }
  return { userId: session.userId };
}

export async function deleteSession() {
  cookies().delete(cookie.name);
  redirect("/login");
}
