import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useUsuarios() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        const controller = new AbortController();

        try {
            const response = await axios.get("/users", {
                signal: controller.signal,
            });
            setUsers(response.data ?? []);
        } catch (err) {
            if (err.name !== "CanceledError") {
                console.error("Error al cargar los usuarios:", err);
                setError(err);
            }
        } finally {
            setLoading(false);
        }

        return () => controller.abort();
    }, []);

    useEffect(() => {
        const abortFetch = fetchUsers();
        return () => {
            // cancelar si el componente se desmonta
            if (typeof abortFetch === "function") abortFetch();
        };
    }, [fetchUsers]);

    return { users, loading, error, refetch: fetchUsers };
}
