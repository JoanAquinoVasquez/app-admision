import { useEffect, useState, useCallback } from "react";
import axios from "../../axios";

export default function useResumenVouchers() {
    const [resumenVouchers, setResumenVouchers] = useState([]);

    const fetchResumenVouchers = useCallback(async () => {
        try {
            const response = await axios.get("/resumen-vouchers");
            setResumenVouchers(response.data.data);
        } catch (error) {
            console.error("Error al cargar los resumen vouchers:", error);
        }
    }, []);
    useEffect(() => {
        fetchResumenVouchers();
    }, [fetchResumenVouchers]);

    return { resumenVouchers, fetchResumenVouchers };
}
