import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useIngresantesPrograma() {
    const { data: ingresantesPrograma, loading, refresh: fetchIngresantesPrograma } =
        useDashboardQuery("/ingresantes-programa");

    return { ingresantesPrograma, loading, fetchIngresantesPrograma };
}
