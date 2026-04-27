import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import TableDocentes from "../../../components/Table/TableDocentes";

function GestionDocentes() {
    return (
        <div className="container p-4 max-w-full animate-in fade-in duration-500">
            <div className="mb-6">
                <Breadcrumb
                    paths={[
                        { name: "Gestión" },
                        { name: "Gestión de Docentes", href: "/gestionar-docentes" }
                    ]}
                />
                <div className="mt-2 text-slate-500 text-sm">
                    Administra el acceso y la información de todos los docentes evaluadores del sistema.
                </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 min-w-[320px]">
                <TableDocentes />
            </div>
        </div>
    );
}

export default GestionDocentes;
