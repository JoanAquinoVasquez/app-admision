import SidebarMenu from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
    <div className="flex h-screen overflow-hidden">
        <SidebarMenu />
        <div className="flex-1 overflow-x-auto h-full flex flex-col">
            <Navbar />
            <div className="px-3 sm:px-3 md:px-3 h-auto flex-1">
                <Outlet />
            </div>
        </div>
    </div>
);

export default DashboardLayout;
