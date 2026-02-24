import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, user, loading }) {
  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
}

export default ProtectedRoute;