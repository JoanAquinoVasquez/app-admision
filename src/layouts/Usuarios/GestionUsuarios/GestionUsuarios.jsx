import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableUsuarios from "../../../components/Table/TableUsuarios";

function Ingresantes() {
    return (
        <div className="container p-4 max-w-full">
            <div>
                <Breadcrumb
                    paths={[{ name: "Gestionar Usuarios", href: "/gestionar-usuarios" }]}
                />
            </div>
            <div className="bg-white rounded-lg p-3 shadow-md mb-3 min-w-[320px] overflow-x-auto">
                <TableUsuarios></TableUsuarios>
            </div>
        </div>
    );
}

export default Ingresantes;
