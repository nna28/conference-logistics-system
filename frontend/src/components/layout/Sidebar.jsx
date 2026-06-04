import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <div>Conference</div>
        <span>Logistics</span>
      </div>

      <nav>

        <h4>Overview</h4>

        <NavLink to="/dashboard">
          Dashboard
        </NavLink>

        <h4>Conference</h4>

        <NavLink to="/workshops">
          Workshops
        </NavLink>

        <NavLink to="/venues">
          Venues
        </NavLink>

        <NavLink to="/contracts">
          Contracts
        </NavLink>

        <NavLink to="/travel-schedules">
          Travel Schedules
        </NavLink>

        <h4>Materials</h4>

        <NavLink to="/materials">
          Materials
        </NavLink>

        <NavLink to="/material-requests">
          Material Requests
        </NavLink>

        <NavLink to="/material-shipments">
          Material Shipments
        </NavLink>

        <h4>Administration</h4>

        <NavLink to="/users">
          Users
        </NavLink>

        <NavLink to="/notifications">
          Notifications
        </NavLink>

        <NavLink to="/audit-logs">
          Audit Logs
        </NavLink>

      </nav>

    </aside>
  );
}

export default Sidebar;