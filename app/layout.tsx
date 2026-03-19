export const metadata = {
  title: "My Blog",
  description: "Minimal coding blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f7f7f2",
          color: "#111111",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            padding: "24px 16px 60px",
          }}
        >
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "20px",
              borderBottom: "1px solid #dddddd",
              marginBottom: "32px",
            }}
          >
            <a
              href="/"
              style={{
                color: "#111",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "22px",
              }}
            >
              My Blog
            </a>

            <nav style={{ display: "flex", gap: "16px" }}>
              <a href="/" style={{ color: "#444", textDecoration: "none" }}>
                Home
              </a>
              <a
                href="/iamadmin"
                style={{ color: "#444", textDecoration: "none" }}
              >
                Admin
              </a>
            </nav>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}