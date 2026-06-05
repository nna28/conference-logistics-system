import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/auth/RoleGuard";


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
            element={
              <RoleGuard allowedRoles={["Admin"]}>
                <UserList />
              </RoleGuard>
            }
          />

          <Route
            path="/users/new"
            element={
              <RoleGuard allowedRoles={["Admin"]}>
                <UserCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/users/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin"]}>
                <UserEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/users/:id"
            element={
              <RoleGuard allowedRoles={["Admin"]}>
                <UserDetail />
              </RoleGuard>
            }
          />

          {/* Workshops */}
          <Route
            path="/workshops"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Training Consultant", "Consultant", "Logistics Coordinator"]}>
                <WorkshopList />
              </RoleGuard>
            }
          />

          <Route
            path="/workshops/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator"]}>
                <WorkshopCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/workshops/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator"]}>
                <WorkshopEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/workshops/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Training Consultant", "Consultant", "Logistics Coordinator"]}>
                <WorkshopDetail />
              </RoleGuard>
            }
          />

          {/* Venues */}
          <Route
            path="/venues"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Sales Manager", "Logistics Coordinator"]}>
                <VenueList />
              </RoleGuard>
            }
          />

          <Route
            path="/venues/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Sales Manager", "Logistics Coordinator"]}>
                <VenueCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/venues/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Sales Manager", "Logistics Coordinator"]}>
                <VenueEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/venues/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Sales Manager", "Logistics Coordinator"]}>
                <VenueDetail />
              </RoleGuard>
            }
          />

          {/* Contracts */}
          <Route
            path="/contracts"
            element={
              <RoleGuard allowedRoles={["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"]}>
                <ContractList />
              </RoleGuard>
            }
          />

          <Route
            path="/contracts/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"]}>
                <ContractCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/contracts/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"]}>
                <ContractEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/contracts/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Sales Manager", "Booking Staff", "Logistics Coordinator"]}>
                <ContractDetail />
              </RoleGuard>
            }
          />

          {/* Travel Schedules */}
          <Route
            path="/travel-schedules"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator", "Training Consultant", "Consultant"]}>
                <TravelScheduleList />
              </RoleGuard>
            }
          />

          <Route
            path="/travel-schedules/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator"]}>
                <TravelScheduleCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/travel-schedules/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator"]}>
                <TravelScheduleEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/travel-schedules/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Booking Staff", "Logistics Coordinator", "Training Consultant", "Consultant"]}>
                <TravelScheduleDetail />
              </RoleGuard>
            }
          />

          {/* Materials */}
          <Route
            path="/materials"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialList />
              </RoleGuard>
            }
          />

          <Route
            path="/materials/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/materials/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/materials/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialDetail />
              </RoleGuard>
            }
          />

          {/* Material Requests */}
          <Route
            path="/material-requests"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialRequestList />
              </RoleGuard>
            }
          />

          <Route
            path="/material-requests/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialRequestCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/material-requests/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialRequestEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/material-requests/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialRequestDetail />
              </RoleGuard>
            }
          />

          {/* Material Shipments */}
          <Route
            path="/material-shipments"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialShipmentList />
              </RoleGuard>
            }
          />

          <Route
            path="/material-shipments/new"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialShipmentCreate />
              </RoleGuard>
            }
          />

          <Route
            path="/material-shipments/edit/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialShipmentEdit />
              </RoleGuard>
            }
          />

          <Route
            path="/material-shipments/:id"
            element={
              <RoleGuard allowedRoles={["Admin", "Materials Handling Staff", "Logistics Coordinator"]}>
                <MaterialShipmentDetail />
              </RoleGuard>
            }
          />

          {/* Notifications */}
          <Route
            path="/notifications"
            element={<NotificationList />}
          />

          {/* Audit Logs */}
          <Route
            path="/audit-logs"
            element={
              <RoleGuard allowedRoles={["Admin"]}>
                <AuditLogList />
              </RoleGuard>
            }
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;