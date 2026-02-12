import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useComputoIngresantes() {
    const { data: computoIngresantes, loading, refresh: fetchComputoIngresantes } =
        useDashboardQuery("/computo-ingresantes");

    return { computoIngresantes, loading, fetchComputoIngresantes };
}
