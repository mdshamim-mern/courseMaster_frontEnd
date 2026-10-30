import { Navigate } from "react-router-dom";

export default function AdminRoute({ children, me }) {
    if (!me) return null; // Wait until the current user is loaded.
    if (me.role !== "admin") return <Navigate to="/student" replace />;
    return children;
}
