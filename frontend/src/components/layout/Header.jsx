export default function Header() {
  const fullName =
    localStorage.getItem("full_name") ||
    "System Admin";

  const handleLogout = () => {
    localStorage.clear();

    window.location.href =
      "/login";
  };

  return (
    <header className="header">

      <h2>
        Conference Logistics System
      </h2>

      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <span>
          {fullName}
        </span>

        <button
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

    </header>
  );
}