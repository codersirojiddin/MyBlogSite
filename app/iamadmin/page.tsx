import { redirect } from "next/navigation";
import {
  getAdminLockStatus,
  isAdminLoggedIn,
  loginAdmin,
} from "../../lib/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; locked?: string; attempts?: string };
}) {
  const loggedIn = await isAdminLoggedIn();

  if (loggedIn) {
    redirect("/iamadmin/panel");
  }

  const lockStatus = await getAdminLockStatus();

  async function handleLogin(formData: FormData) {
    "use server";

    const password = String(formData.get("password") || "");
    const result = await loginAdmin(password);

    if (result.success) {
      redirect("/iamadmin/panel");
    }

    if (result.locked) {
      redirect("/iamadmin?locked=1");
    }

    redirect(`/iamadmin?error=1&attempts=${result.remainingAttempts}`);
  }

  return (
    <div
      style={{
        maxWidth: "460px",
        margin: "0 auto",
        border: "1px solid #dddddd",
        borderRadius: "12px",
        padding: "18px",
        background: "#ffffff",
      }}
    >
      <h1 style={{ margin: "0 0 16px", fontSize: "26px", color: "#111" }}>
        Admin Login
      </h1>

      {lockStatus.locked || searchParams?.locked ? (
        <p style={{ color: "#c62828", lineHeight: 1.6 }}>
          Too many wrong attempts. Login is temporarily locked.
          <br />
          Try again in about {lockStatus.minutesLeft || 10} minute(s).
        </p>
      ) : null}

      {!lockStatus.locked && searchParams?.error ? (
        <p style={{ color: "#c62828", lineHeight: 1.6 }}>
          Wrong password.
          {searchParams?.attempts
            ? ` ${searchParams.attempts} attempt(s) left.`
            : ""}
        </p>
      ) : null}

      <form action={handleLogin}>
        <div style={{ display: "grid", gap: "8px", marginBottom: "14px" }}>
          <label htmlFor="password" style={{ color: "#222" }}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            disabled={lockStatus.locked}
            style={{
              width: "100%",
              border: "1px solid #cccccc",
              background: "#fff",
              color: "#111",
              borderRadius: "10px",
              padding: "12px 14px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={lockStatus.locked}
          style={{
            border: "none",
            borderRadius: "10px",
            padding: "10px 14px",
            background: lockStatus.locked ? "#cccccc" : "#111",
            color: lockStatus.locked ? "#666" : "#fff",
            fontWeight: 600,
            cursor: lockStatus.locked ? "not-allowed" : "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}