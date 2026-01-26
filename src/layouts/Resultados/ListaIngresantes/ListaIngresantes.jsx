import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableIngresantes from "../../../components/Table/TableIngresantes";

function Ingresantes() {
    return (
        <div className="container p-4 max-w-full">
            <div>
                <Breadcrumb
                    paths={[{ name: "Resultados", href: "/resultados" }]}
                />
            </div>
            <div className="bg-white rounded-lg p-3 shadow-md mb-3 min-w-[320px] overflow-x-auto">
                <TableIngresantes></TableIngresantes>
            </div>
        </div>
    );
}

export default Ingresantes;
