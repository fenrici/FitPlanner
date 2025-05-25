import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../components/common";
import { Login, Register } from "../components/features/auth";
import { Dashboard, RoutineDetail, NewRoutine } from "../components/features/routines";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routines/new"
        element={
          <ProtectedRoute>
            <NewRoutine />
          </ProtectedRoute>
        }
      />
      <Route
        path="/routines/:id"
        element={
          <ProtectedRoute>
            <RoutineDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes; 