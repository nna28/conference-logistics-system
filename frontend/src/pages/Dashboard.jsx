import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import workshopService from "../services/workshopService";
import venueService from "../services/venueService";
import contractService from "../services/contractService";
import travelScheduleService from "../services/travelScheduleService";
import materialRequestService from "../services/materialRequestService";
import materialShipmentService from "../services/materialShipmentService";

const statCards = [
  {
    key: "workshops",
    label: "Workshops",
    icon: "📅",
    color: "orange",
    link: "/workshops",
  },
  {
    key: "venues",
    label: "Venues",
    icon: "🏛️",
    color: "blue",
    link: "/venues",
  },
  {
    key: "contracts",
    label: "Contracts",
    icon: "📄",
    color: "green",
    link: "/contracts",
  },
  {
    key: "schedules",
    label: "Travel Schedules",
    icon: "✈️",
    color: "purple",
    link: "/travel-schedules",
  },
  {
    key: "requests",
    label: "Material Requests",
    icon: "📋",
    color: "red",
    link: "/material-requests",
  },
  {
    key: "shipments",
    label: "Shipments",
    icon: "🚚",
    color: "cyan",
    link: "/material-shipments",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const fullName = localStorage.getItem("full_name") || "there";

  const [stats, setStats] = useState({
    workshops: 0,
    venues: 0,
    contracts: 0,
    schedules: 0,
    requests: 0,
    shipments: 0,
  });

  const [recentWorkshops, setRecentWorkshops] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentShipments, setRecentShipments] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    // 1. Lấy role của user hiện tại
    const userRole = localStorage.getItem("role") || "";
    
    // 2. Kiểm tra xem user này có quyền xem kho/shipment không
    const canViewMaterials = ["Admin", "Materials Handling Staff", "Logistics Coordinator"].includes(userRole);

    const fetchSafe = async (promise) => {
      try {
        const data = await promise;
        return Array.isArray(data) ? data : []; 
      } catch (error) {
        console.warn("API call failed:", error.message);
        return []; 
      }
    };

    try {
      const [
        workshops,
        venues,
        contracts,
        schedules,
        requests,
        shipments,
      ] = await Promise.all([
        fetchSafe(workshopService.getAll()),
        fetchSafe(venueService.getAll()),
        fetchSafe(contractService.getAll()),
        fetchSafe(travelScheduleService.getAll()),
        fetchSafe(materialRequestService.getAll()),
        
        // 3. ✅ SỬA Ở ĐÂY: Nếu có quyền mới gọi API, không thì trả về mảng rỗng luôn (không phát sinh request mạng)
        fetchSafe(canViewMaterials ? materialShipmentService.getAll() : Promise.resolve([]))
      ]);

      setStats({
        workshops: workshops.length,
        venues: venues.length,
        contracts: contracts.length,
        schedules: schedules.length,
        requests: requests.length,
        shipments: shipments.length,
      });

      setRecentWorkshops(workshops.slice(-5).reverse());
      setRecentRequests(requests.slice(-5).reverse());
      setRecentShipments(shipments.slice(-5).reverse());

    } catch (error) {
      console.error("Critical error in loadDashboard:", error);
    }
  };

  return (
    <div className="dashboard">

      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <p className="page-subtitle">Welcome back, {fullName} 👋</p>
          <h1>Dashboard</h1>
        </div>
        <div className="page-header-actions">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search..." />
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="stat-card"
            onClick={() => navigate(card.link)}
            style={{ cursor: "pointer" }}
          >
            <div className={`stat-card-icon ${card.color}`}>
              {card.icon}
            </div>
            <div className="stat-card-info">
              <div className="stat-card-label">{card.label}</div>
              <div className="stat-card-value">{stats[card.key]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent section */}
      <div className="dashboard-row">

        {/* Recent Workshops */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Recent Workshops</h2>
            <button
              className="dashboard-card-action"
              onClick={() => navigate("/workshops")}
              title="View all"
            >
              ↗
            </button>
          </div>

          {recentWorkshops.length === 0 ? (
            <div className="empty-state">
              <p>No workshops yet</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recentWorkshops.map((item) => (
                <li
                  key={item.id}
                  className="recent-list-item"
                  onClick={() => navigate(`/workshops/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="recent-item-icon">📅</div>
                  <div className="recent-item-info">
                    <div className="recent-item-title">
                      {item.workshop_code}
                    </div>
                    <div className="recent-item-sub">
                      {item.workshop_type} · {item.status}
                    </div>
                  </div>
                  <div className="recent-item-check">✓</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Material Requests */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Recent Requests</h2>
            <button
              className="dashboard-card-action"
              onClick={() => navigate("/material-requests")}
              title="View all"
            >
              ↗
            </button>
          </div>

          {recentRequests.length === 0 ? (
            <div className="empty-state">
              <p>No requests yet</p>
            </div>
          ) : (
            <ul className="recent-list">
              {recentRequests.map((item) => (
                <li
                  key={item.id}
                  className="recent-list-item"
                  onClick={() => navigate(`/material-requests/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="recent-item-icon blue">📋</div>
                  <div className="recent-item-info">
                    <div className="recent-item-title">
                      Request #{item.id}
                    </div>
                    <div className="recent-item-sub">
                      {item.delivery_address} · {item.status}
                    </div>
                  </div>
                  <div className="recent-item-check">✓</div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>

      {/* Recent Shipments */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2>Recent Shipments</h2>
          <button
            className="dashboard-card-action"
            onClick={() => navigate("/material-shipments")}
            title="View all"
          >
            ↗
          </button>
        </div>

        {recentShipments.length === 0 ? (
          <div className="empty-state">
            <p>No shipments yet</p>
          </div>
        ) : (
          <div className="table-card" style={{ border: "none", boxShadow: "none", padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Request #</th>
                  <th>Material #</th>
                  <th>Quantity</th>
                  <th>Packaging</th>
                  <th>Shipping</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    onClick={() => navigate(`/material-shipments/${shipment.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>#{shipment.id}</td>
                    <td>#{shipment.material_request_id}</td>
                    <td>#{shipment.material_id}</td>
                    <td>{shipment.quantity}</td>
                    <td>
                      <span className={`badge badge-${(shipment.packaging_status || "pending").toLowerCase()}`}>
                        {shipment.packaging_status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${(shipment.shipping_status || "pending").toLowerCase()}`}>
                        {shipment.shipping_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}