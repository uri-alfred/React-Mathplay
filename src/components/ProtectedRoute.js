import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Loading from "./Loading";


export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
}

// export function ProtectedRouteAMN({ children }) {
//   const { user, loading, userInfo } = useAuth();

//   if (loading) return <Loading />;

//   if (!user && userInfo != "MP-AMN") return <Navigate to="/login" />;

//   return <>{children}</>;
// }