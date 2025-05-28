import { Routes, Route } from "react-router-dom";
import { Login, Register } from "../components/features/auth";
import { Dashboard, RoutineDetail, NewRoutine } from "../components/features/routines";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/routines/new" element={<NewRoutine />} />
      <Route path="/routines/:id" element={<RoutineDetail />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes; 