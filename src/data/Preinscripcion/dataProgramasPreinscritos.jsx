import useDashboardQuery from "../../hooks/useDashboardQuery";

export default function useProgramaPreinscritos() {
    const { data: programasPreinscritos, loading, refresh: fetchProgramasPreinscritos } =
        useDashboardQuery("/preinscritos-totales");

    return { programasPreinscritos, loading, fetchProgramasPreinscritos };
}
