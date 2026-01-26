import { useUser } from "../../services/UserContext";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    Skeleton,
} from "@nextui-org/react";

function Navbar() {
    const { userData, logout, loading } = useUser();

    const { profile_picture, email, name } = userData || {};

    return (
        <div
            className="bg-white pt-4 pb-2 pr-2 flex justify-end items-center relative"
            style={{ background: "#fafafb", zIndex: 0, minHeight: "64px" }} // 👈 altura fija
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
                                    src: profile_picture || `https://ui-avatars.com/api/?name=${name}&background=random`,
                                    imgProps: { referrerPolicy: "no-referrer" }
                                }}
                                className="transition-transform user-prom"
                                name={
                                    <span className="text-gray-500 font-medium">
                                        {name ? name : "Usuario"}
                                    </span>
                                }
                                description={
                                    <span className="text-gray-600">
                                        {email ? email : "No registrado"}
                                    </span>
                                }
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
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

export default Navbar;
