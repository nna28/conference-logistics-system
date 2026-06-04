import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import notificationService from "../../services/notificationService";


const navItems = [
  {
    to: "/dashboard",
    tooltip: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
];

const conferenceItems = [
  {
    to: "/workshops",
    tooltip: "Workshops",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    to: "/venues",
    tooltip: "Venues",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: "/contracts",
    tooltip: "Contracts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
      </svg>
    ),
  },
  {
    to: "/travel-schedules",
    tooltip: "Travel Schedules",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
      </svg>
    ),
  },
];

const materialItems = [
  {
    to: "/materials",
    tooltip: "Materials",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      </svg>
    ),
  },
  {
    to: "/material-requests",
    tooltip: "Material Requests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: "/material-shipments",
    tooltip: "Shipments",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
];

const adminItems = [
  {
    to: "/users",
    tooltip: "Users",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    to: "/notifications",
    tooltip: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
    ),
  },
  {
    to: "/audit-logs",
    tooltip: "Audit Logs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

function NavItem({ to, tooltip, icon }) {
  return (
    <NavLink
      to={to}
      data-tooltip={tooltip}
      className={({ isActive }) =>
        `sidebar-nav-item${isActive ? " active" : ""}`
      }
    >
      {icon}
    </NavLink>
  );
}

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role") || "";
  const fullName = localStorage.getItem("full_name") || "A";
  const userId = localStorage.getItem("user_id");
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      notificationService.getByUser(userId)
        .then(data => {
          const unread = data.filter(n => !n.is_read).length;
          setUnreadCount(unread);
        })
        .catch(err => console.error("Error fetching notifications", err));
    }
  }, [userId]);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" title="Conference Logistics System">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {["Admin", "Booking Staff", "Training Consultant", "Logistics Coordinator", "Sales Manager"].includes(userRole) && (
          <>
            <div className="sidebar-section-divider" />
            {conferenceItems.map((item) => {
              // specific role checks for inner items
              if (item.to === "/users" && userRole !== "Admin") return null;
              if (item.to === "/contracts" && !["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"].includes(userRole)) return null;
              if (item.to === "/venues" && !["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"].includes(userRole)) return null;
              if (item.to === "/travel-schedules" && !["Admin", "Booking Staff", "Logistics Coordinator", "Training Consultant"].includes(userRole)) return null;
              return <NavItem key={item.to} {...item} />;
            })}
          </>
        )}

        {["Admin", "Materials Handling Staff", "Logistics Coordinator"].includes(userRole) && (
          <>
            <div className="sidebar-section-divider" />
            {materialItems.map((item) => {
              if (item.to === "/material-requests" && !["Admin", "Materials Handling Staff", "Logistics Coordinator"].includes(userRole)) return null;
              return <NavItem key={item.to} {...item} />;
            })}
          </>
        )}

        {userRole === "Admin" && (
          <>
            <div className="sidebar-section-divider" />
            {adminItems.map((item) => {
              if (item.to === "/notifications") return null; // handle notifications separately if needed
              return <NavItem key={item.to} {...item} />;
            })}
          </>
        )}
        
        {/* Notifications for everyone */}
        <div className="sidebar-section-divider" />
        <NavItem to="/notifications" tooltip="Notifications" icon={
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px' }}>
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                backgroundColor: '#e41e3f',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 5px',
                fontSize: '10px',
                fontWeight: 'bold',
                minWidth: '16px',
                textAlign: 'center',
                lineHeight: 1
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        } />
      </nav>

      {/* Bottom: avatar / logout */}
      <div className="sidebar-bottom">
        <div
          className="sidebar-nav-item"
          data-tooltip="Logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <div
          className="sidebar-avatar"
          data-tooltip={fullName}
        >
          {initials}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;