import { useDocente } from "../../services/UserContextDocente";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    Skeleton,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

function NavbarDocente() {
    const { docenteData, loading, logout, loadingSession } = useDocente();
    const { email, nombres, ap_materno, ap_paterno } = docenteData || {};
    const navigate = useNavigate();

    return (
        <div
            className="bg-white pt-4 pb-2 pr-2 flex justify-end items-center"
            style={{ background: "#fafafb" }}
        >
            <div className="flex items-center mr-5">
                {!loading ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <User
                                as="button"
                                avatarProps={{
                                    isBordered: true,
                                    size: "sm",
                                    src: `https://ui-avatars.com/api/?name=${nombres}+${ap_paterno}&background=random`,
                                    imgProps: { referrerPolicy: "no-referrer" }
                                }}
                                className="transition-transform user-prom"
                                description={email}
                                name={`${nombres} ${ap_paterno} ${ap_materno}`.trim()}
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Acciones del perfil"
                            variant="flat"
                        >
                            <DropdownItem
                                key="logout"
                                textValue="logout"
                                color="danger"
                                onPress={() =>
                                    logout("Sesión cerrada correctamente")
                                }
                            >
                                Cerrar sesión
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : loadingSession ? (
                    <Spinner />
                ) : (
                    // 👇 Skeletons para ocupar el mismo espacio
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />{" "}
                        {/* avatar */}
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-3 w-24 rounded-lg" />{" "}
                            {/* nombre */}
                            <Skeleton className="h-3 w-32 rounded-lg" />{" "}
                            {/* email */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavbarDocente;
