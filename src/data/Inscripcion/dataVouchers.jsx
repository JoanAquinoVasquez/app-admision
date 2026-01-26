import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useVouchers() {
    const [vouchers, setVouchers] = useState([]);

    const fetchVouchers = useCallback(async () => {
        try {
            const response = await axios.get("/vouchers", {});
            setVouchers(response.data.data);
        } catch (error) {
            console.error("Error al cargar los vouchers:", error);
        }
    }, []);
    useEffect(() => {
        fetchVouchers();
    }, [fetchVouchers]);

    return { vouchers, fetchVouchers };
}
