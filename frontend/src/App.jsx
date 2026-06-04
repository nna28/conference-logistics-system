import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

/* Audit Logs */
import AuditLogList from "./pages/auditLogs/AuditLogList";

/* Notifications */
import NotificationList from "./pages/notifications/NotificationList";

/* Users */
import UserList from "./pages/users/UserList";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import UserDetail from "./pages/users/UserDetail";

/* Workshops */
import WorkshopList from "./pages/workshops/WorkshopList";
import WorkshopCreate from "./pages/workshops/WorkshopCreate";
import WorkshopEdit from "./pages/workshops/WorkshopEdit";
import WorkshopDetail from "./pages/workshops/WorkshopDetail";

/* Venues */
import VenueList from "./pages/venues/VenueList";
import VenueCreate from "./pages/venues/VenueCreate";
import VenueEdit from "./pages/venues/VenueEdit";
import VenueDetail from "./pages/venues/VenueDetail";

/* Contracts */
import ContractList from "./pages/contracts/ContractList";
import ContractCreate from "./pages/contracts/ContractCreate";
import ContractEdit from "./pages/contracts/ContractEdit";
import ContractDetail from "./pages/contracts/ContractDetail";

/* Travel Schedules */
import TravelScheduleList from "./pages/travelSchedules/TravelScheduleList";
import TravelScheduleCreate from "./pages/travelSchedules/TravelScheduleCreate";
import TravelScheduleEdit from "./pages/travelSchedules/TravelScheduleEdit";
import TravelScheduleDetail from "./pages/travelSchedules/TravelScheduleDetail";

/* Materials */
import MaterialList from "./pages/materials/MaterialList";
import MaterialCreate from "./pages/materials/MaterialCreate";
import MaterialEdit from "./pages/materials/MaterialEdit";
import MaterialDetail from "./pages/materials/MaterialDetail";

/* Material Requests */
import MaterialRequestList from "./pages/materialRequests/MaterialRequestList";
import MaterialRequestCreate from "./pages/materialRequests/MaterialRequestCreate";
import MaterialRequestEdit from "./pages/materialRequests/MaterialRequestEdit";
import MaterialRequestDetail from "./pages/materialRequests/MaterialRequestDetail";

/* Material Shipments */
import MaterialShipmentList from "./pages/materialShipments/MaterialShipmentList";
import MaterialShipmentCreate from "./pages/materialShipments/MaterialShipmentCreate";
import MaterialShipmentEdit from "./pages/materialShipments/MaterialShipmentEdit";
import MaterialShipmentDetail from "./pages/materialShipments/MaterialShipmentDetail";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Users */}
          <Route
            path="/users"
            element={<UserList />}
          />

          <Route
            path="/users/new"
            element={<UserCreate />}
          />

          <Route
            path="/users/edit/:id"
            element={<UserEdit />}
          />

          <Route
            path="/users/:id"
            element={<UserDetail />}
          />

          {/* Workshops */}
          <Route
            path="/workshops"
            element={<WorkshopList />}
          />

          <Route
            path="/workshops/new"
            element={<WorkshopCreate />}
          />

          <Route
            path="/workshops/edit/:id"
            element={<WorkshopEdit />}
          />

          <Route
            path="/workshops/:id"
            element={<WorkshopDetail />}
          />

          {/* Venues */}
          <Route
            path="/venues"
            element={<VenueList />}
          />

          <Route
            path="/venues/new"
            element={<VenueCreate />}
          />

          <Route
            path="/venues/edit/:id"
            element={<VenueEdit />}
          />

          <Route
            path="/venues/:id"
            element={<VenueDetail />}
          />

          {/* Contracts */}
          <Route
            path="/contracts"
            element={<ContractList />}
          />

          <Route
            path="/contracts/new"
            element={<ContractCreate />}
          />

          <Route
            path="/contracts/edit/:id"
            element={<ContractEdit />}
          />

          <Route
            path="/contracts/:id"
            element={<ContractDetail />}
          />

          {/* Travel Schedules */}
          <Route
            path="/travel-schedules"
            element={<TravelScheduleList />}
          />

          <Route
            path="/travel-schedules/new"
            element={<TravelScheduleCreate />}
          />

          <Route
            path="/travel-schedules/edit/:id"
            element={<TravelScheduleEdit />}
          />

          <Route
            path="/travel-schedules/:id"
            element={<TravelScheduleDetail />}
          />

          {/* Materials */}
          <Route
            path="/materials"
            element={<MaterialList />}
          />

          <Route
            path="/materials/new"
            element={<MaterialCreate />}
          />

          <Route
            path="/materials/edit/:id"
            element={<MaterialEdit />}
          />

          <Route
            path="/materials/:id"
            element={<MaterialDetail />}
          />

          {/* Material Requests */}
          <Route
            path="/material-requests"
            element={<MaterialRequestList />}
          />

          <Route
            path="/material-requests/new"
            element={<MaterialRequestCreate />}
          />

          <Route
            path="/material-requests/edit/:id"
            element={<MaterialRequestEdit />}
          />

          <Route
            path="/material-requests/:id"
            element={<MaterialRequestDetail />}
          />

          {/* Material Shipments */}
          <Route
            path="/material-shipments"
            element={<MaterialShipmentList />}
          />

          <Route
            path="/material-shipments/new"
            element={<MaterialShipmentCreate />}
          />

          <Route
            path="/material-shipments/edit/:id"
            element={<MaterialShipmentEdit />}
          />

          <Route
            path="/material-shipments/:id"
            element={<MaterialShipmentDetail />}
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<NotificationList />}
          />

          {/* Audit Logs */}
          <Route
            path="/audit-logs"
            element={<AuditLogList />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;