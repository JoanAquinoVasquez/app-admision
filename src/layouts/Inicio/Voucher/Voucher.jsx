import { MdReceiptLong } from "react-icons/md";
import DashboardCard from "../../../components/Cards/DashboardCard";
import CountUp from "react-countup";
import { Spinner } from "@nextui-org/react";
import { admissionConfig } from "../../../config/admission";

const TotalVouchers = ({ resumenVouchers, loading }) => {
    // Valores con fallback
    const totalVouchers = resumenVouchers?.totalVouchers || 0;
    const totalRecaudado2025 = resumenVouchers?.totalRecaudado2025 || 0;
    const totalRecaudado2024 = resumenVouchers?.totalRecaudado2024 || 0;
    const inscritos = resumenVouchers?.inscritos || 0;
    const noInscritos = resumenVouchers?.noInscritos || 0;
    const bancoNacionCount = resumenVouchers?.bancoNacionCount || 0;
    const pagaloPeCount = resumenVouchers?.pagaloPeCount || 0;
    const porcentajeInscritos =
        parseFloat(resumenVouchers?.porcentajeInscritos) || 0;
    const porcentajeNoInscritos =
        parseFloat(resumenVouchers?.porcentajeNoInscritos) || 0;
    const porcentajeBancoNacion =
        parseFloat(resumenVouchers?.porcentajeBancoNacion) || 0;
    const porcentajePagaloPe =
        parseFloat(resumenVouchers?.porcentajePagaloPe) || 0;

    return (
        <DashboardCard
            title="Vouchers"
            icon={<MdReceiptLong className="text-purple-500 text-lg" />}
        >
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Spinner color="primary" size="md" label="Cargando..." />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1">
                        {/* Total de Pagos */}
                        <div className="grid grid-cols-3 space-x-0 pb-2">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">N° Pagos</p>
                                <p className="text-xl font-semibold">
                                    <CountUp
                                        end={totalVouchers}
                                        duration={1.5}
                                        separator=","
                                    />
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    <span className="hidden md:inline">
                                        Total Rec.{" "}
                                        {admissionConfig.cronograma.periodo}
                                    </span>
                                    <span className="inline md:hidden">
                                        Rec. {admissionConfig.cronograma.periodo}
                                    </span>
                                </p>
                                <p className="text-base font-semibold text-lg">
                                    S/{" "}
                                    <CountUp
                                        end={totalRecaudado2025}
                                        duration={1.5}
                                        separator="."
                                        decimal=","
                                    />
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    <span className="hidden md:inline">
                                        Total Rec. 2024
                                    </span>
                                    <span className="inline md:hidden">Rec. 2024</span>
                                </p>
                                <p className="text-base font-semibold text-lg">
                                    S/{" "}
                                    <CountUp
                                        end={totalRecaudado2024}
                                        duration={1.5}
                                        separator="."
                                    />
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 border-t border-gray-200 pt-2">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">Utilizados</p>
                                <p className="text-green-600 font-semibold">
                                    <CountUp
                                        end={inscritos}
                                        duration={1.5}
                                        separator="."
                                    />{" "}
                                    (
                                    <CountUp
                                        end={porcentajeInscritos}
                                        duration={1.5}
                                        decimals={2}
                                    />
                                    %)
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">Pendientes</p>
                                <p className="text-red-600 font-semibold">
                                    <CountUp
                                        end={noInscritos}
                                        duration={1.5}
                                        separator="."
                                    />{" "}
                                    (
                                    <CountUp
                                        end={porcentajeNoInscritos}
                                        duration={1.5}
                                        decimals={2}
                                    />
                                    %)
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 border-t border-gray-200 pt-2">
                            <div className="text-center">
                                <p className="text-sm text-gray-500">
                                    Banco de la Nación
                                </p>
                                <p className="text-indigo-600 font-semibold">
                                    <CountUp
                                        end={bancoNacionCount}
                                        duration={1.5}
                                        separator="."
                                    />{" "}
                                    (
                                    <CountUp
                                        end={porcentajeBancoNacion}
                                        duration={1.5}
                                        decimals={2}
                                    />
                                    %)
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500">PagaloPe</p>
                                <p className="text-blue-600 font-semibold">
                                    <CountUp
                                        end={pagaloPeCount}
                                        duration={1.5}
                                        separator="."
                                    />{" "}
                                    (
                                    <CountUp
                                        end={porcentajePagaloPe}
                                        duration={1.5}
                                        decimals={2}
                                    />
                                    %)
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardCard>
    );
};

export default TotalVouchers;
