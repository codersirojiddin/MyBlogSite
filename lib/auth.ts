import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "admin_session";
const ATTEMPT_COOKIE = "admin_attempts";
const LOCK_COOKIE = "admin_locked_until";

const MAX_ATTEMPTS = 3;
const LOCK_MINUTES = 10;

export async function loginAdmin(password: string) {
  const cookieStore = cookies();
  const realPassword = process.env.ADMIN_PASSWORD;

  if (!realPassword) {
    throw new Error("Missing ADMIN_PASSWORD in .env.local");
  }

  const lockedUntil = cookieStore.get(LOCK_COOKIE)?.value;
  if (lockedUntil) {
    const lockedUntilTime = Number(lockedUntil);
    if (Date.now() < lockedUntilTime) {
      return {
        success: false,
        locked: true,
        remainingAttempts: 0,
      };
    } else {
      cookieStore.delete(LOCK_COOKIE);
      cookieStore.delete(ATTEMPT_COOKIE);
    }
  }

  if (password === realPassword) {
    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.delete(ATTEMPT_COOKIE);
    cookieStore.delete(LOCK_COOKIE);

    return {
      success: true,
      locked: false,
      remainingAttempts: MAX_ATTEMPTS,
    };
  }

  const currentAttempts = Number(cookieStore.get(ATTEMPT_COOKIE)?.value || "0");
  const nextAttempts = currentAttempts + 1;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - nextAttempts);

  if (nextAttempts >= MAX_ATTEMPTS) {
    const lockedUntilTime = Date.now() + LOCK_MINUTES * 60 * 1000;

    cookieStore.set(LOCK_COOKIE, String(lockedUntilTime), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: LOCK_MINUTES * 60,
    });

    cookieStore.delete(ATTEMPT_COOKIE);

    return {
      success: false,
      locked: true,
      remainingAttempts: 0,
    };
  }

  cookieStore.set(ATTEMPT_COOKIE, String(nextAttempts), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 30,
  });

  return {
    success: false,
    locked: false,
    remainingAttempts,
  };
}

export async function isAdminLoggedIn() {
  return cookies().get(COOKIE_NAME)?.value === "true";
}

export async function requireAdmin() {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    redirect("/iamadmin");
  }
}

export async function logoutAdmin() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminLockStatus() {
  const cookieStore = cookies();
  const lockedUntil = cookieStore.get(LOCK_COOKIE)?.value;

  if (!lockedUntil) {
    return {
      locked: false,
      minutesLeft: 0,
    };
  }

  const lockedUntilTime = Number(lockedUntil);
  const diff = lockedUntilTime - Date.now();

  if (diff <= 0) {
    cookieStore.delete(LOCK_COOKIE);
    cookieStore.delete(ATTEMPT_COOKIE);

    return {
      locked: false,
      minutesLeft: 0,
    };
  }

  return {
    locked: true,
    minutesLeft: Math.ceil(diff / 60000),
  };
}