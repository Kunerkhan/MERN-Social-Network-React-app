import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../shared/hooks";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated() ? 
        children
    : (
        <Navigate to="/signin" replace />
    )
}   