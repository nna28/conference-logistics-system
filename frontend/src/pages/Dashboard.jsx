import { useEffect, useState } from "react";

import workshopService from "../services/workshopService";
import venueService from "../services/venueService";
import contractService from "../services/contractService";
import travelScheduleService from "../services/travelScheduleService";
import materialRequestService from "../services/materialRequestService";
import materialShipmentService from "../services/materialShipmentService";

export default function Dashboard() {
  const [stats, setStats] = useState({
    workshops: 0,
    venues: 0,
    contracts: 0,
    schedules: 0,
    requests: 0,
    shipments: 0,
  });

  const [recentWorkshops, setRecentWorkshops] =
    useState([]);

  const [recentRequests, setRecentRequests] =
    useState([]);

  const [recentShipments, setRecentShipments] =
    useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        workshops,
        venues,
        contracts,
        schedules,
        requests,
        shipments,
      ] = await Promise.all([
        workshopService.getAll(),
        venueService.getAll(),
        contractService.getAll(),
        travelScheduleService.getAll(),
        materialRequestService.getAll(),
        materialShipmentService.getAll(),
      ]);

      setStats({
        workshops: workshops.length,
        venues: venues.length,
        contracts: contracts.length,
        schedules: schedules.length,
        requests: requests.length,
        shipments: shipments.length,
      });

      setRecentWorkshops(
        workshops.slice(-5).reverse()
      );

      setRecentRequests(
        requests.slice(-5).reverse()
      );

      setRecentShipments(
        shipments.slice(-5).reverse()
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>

      <h1>
        Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3,1fr)",
          gap: "16px",
          marginBottom: "30px",
        }}
      >

        <div className="card">
          <h3>Workshops</h3>
          <h2>{stats.workshops}</h2>
        </div>

        <div className="card">
          <h3>Venues</h3>
          <h2>{stats.venues}</h2>
        </div>

        <div className="card">
          <h3>Contracts</h3>
          <h2>{stats.contracts}</h2>
        </div>

        <div className="card">
          <h3>Travel Schedules</h3>
          <h2>{stats.schedules}</h2>
        </div>

        <div className="card">
          <h3>Material Requests</h3>
          <h2>{stats.requests}</h2>
        </div>

        <div className="card">
          <h3>Shipments</h3>
          <h2>{stats.shipments}</h2>
        </div>

      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
        }}
      >

        <div className="card">

          <h2>
            Recent Workshops
          </h2>

          <ul>

            {recentWorkshops.map(
              (item) => (
                <li key={item.id}>
                  {item.workshop_code}
                </li>
              )
            )}

          </ul>

        </div>

        <div className="card">

          <h2>
            Recent Requests
          </h2>

          <ul>

            {recentRequests.map(
              (item) => (
                <li key={item.id}>
                  Request #{item.id}
                </li>
              )
            )}

          </ul>

        </div>

      </div>

      <div
        className="card"
        style={{
          marginTop: "20px",
        }}
      >

        <h2>
          Recent Shipments
        </h2>

        <table
          className="data-table"
        >

          <thead>

            <tr>
              <th>ID</th>
              <th>Request</th>
              <th>Material</th>
              <th>Quantity</th>
            </tr>

          </thead>

          <tbody>

            {recentShipments.map(
              (shipment) => (
                <tr
                  key={shipment.id}
                >
                  <td>
                    {shipment.id}
                  </td>

                  <td>
                    {
                      shipment.material_request_id
                    }
                  </td>

                  <td>
                    {
                      shipment.material_id
                    }
                  </td>

                  <td>
                    {shipment.quantity}
                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}