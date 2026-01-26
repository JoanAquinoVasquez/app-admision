// RoleGuard.jsx
import { useUser } from "../services/UserContext";

const RoleGuard = ({ allowedRoles = [], children }) => {
    const { userData } = useUser();

    if (!userData) return null;

    // si no hay restricción de roles, mostramos
    if (allowedRoles.length === 0) return children;

    // verificamos si el usuario tiene alguno de los roles requeridos
    const userRoles = userData.roles || [];
    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

    return hasAccess ? children : null;
};

export default RoleGuard;
