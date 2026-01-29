import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useResumenVouchers() {
    const { data: resumenVouchers, loading, refresh: fetchResumenVouchers } =
        useDashboardQuery("/resumen-vouchers");

    return { resumenVouchers, loading, fetchResumenVouchers };
}
