import SidebarMenu from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
    <div className="flex h-screen overflow-hidden bg-[#fafafb]">
        <SidebarMenu />
        <div className="flex-1 overflow-auto h-full flex flex-col relative w-full pt-0">
            <Navbar />
            <div className="px-3 sm:px-3 md:px-3 h-auto flex-1 shrink-0 mb-4 min-w-0">
                <Outlet />
            </div>
            <div className="mt-auto shrink-0 w-full">
                <Footer />
            </div>
        </div>
    </div>
);

export default DashboardLayout;
