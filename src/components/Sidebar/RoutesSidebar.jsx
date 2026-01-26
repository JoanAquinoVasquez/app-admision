import { useState } from "react";
import { HomeIcon } from "../Icons/HomeIcon";
import { UserCogIcon } from "../Icons/UserCogIcon";

const useRoutes = () => {
    const [loading, setLoading] = useState(false);

    const menuItems = [
        {
            to: "inicio",
            icon: <HomeIcon className="text-xl" />,
            text: "Inicio",
            roles: ["super-admin", "admin", "comision"],
        },
    ];

    const preInscripcionItems = [
        {
            to: "preinscripciones",
            icon: <UserCogIcon className="text-xl" />,
            text: "Ver Preinscritos",
            roles: ["super-admin", "admin", "comision"],
        },
    ];

    const inscripcionItems = [
        {
            to: "inscripciones",
            icon: <UserCogIcon className="text-xl" />,
            text: "Ver Inscritos",
            roles: ["super-admin", "admin", "comision"],
        },
        {
            to: "validar-expedientes",
            icon: <UserCogIcon className="text-xl" />,
            text: "Val. Expediente",
            roles: ["super-admin", "admin"],
        },
        {
            to: "cargar-vouchers",
            icon: <UserCogIcon className="text-xl" />,
            text: "Cargar Vouchers",
            roles: ["super-admin"],
        },
        {
            to: "inscripcion-pendiente",
            icon: <UserCogIcon className="text-xl" />,
            text: "Ins. Pendientes",
            roles: ["super-admin", "admin"],
        },
    ];

    const evaluacionItems = [
        {
            to: "asignar-docentes",
            icon: <UserCogIcon className="text-xl" />,
            text: "Asignar Docente",
            roles: ["super-admin"],
        },
        {
            to: "gestionar-evaluaciones",
            icon: <UserCogIcon className="text-xl" />,
            text: "Gestionar notas",
            roles: ["super-admin", "admin"],
        },
    ];

    const registrosItems = [
        {
            to: "bitacora",
            icon: <UserCogIcon className="text-xl" />,
            text: "Ver Bitácora",
            roles: ["super-admin"],
        },
    ];

    const resultadosItems = [
        {
            to: "resultados",
            icon: <UserCogIcon className="text-xl" />,
            text: "Ver Ingresantes",
            roles: ["super-admin", "admin", "comision"],
        },
    ];

    const gestionItems = [
        {
            to: "gestionar-usuarios",
            icon: <UserCogIcon className="text-xl" />,
            text: "Gestión Usuarios",
            roles: ["super-admin"],
        },
    ];

    return {
        menuItems,
        preInscripcionItems,
        inscripcionItems,
        evaluacionItems,
        resultadosItems,
        registrosItems,
        gestionItems,
        loading,
    };
};

export default useRoutes;
