import { Outlet } from "react-router-dom";
import { useState } from "react";

import AdminSideBar from "../../libs/ui/molecules/AdminSideBar";
import AdminHeader from "../../libs/ui/molecules/AdminHeader";

function AdminModule() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSideBar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex flex-col min-h-screen lg:ml-64">
                <header className="fixed top-0 left-0 right-0  z-30 bg-white border-b">
                    <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
                </header>

                <main className="flex-grow !pt-14 ">
                    <div className="min-h-[calc(100vh-10rem)] ">
                        <Outlet />
                    </div>
                </main>

                {/* <footer className="w-full border-t bg-white">
                    <Footer />
                </footer> */}
            </div>
        </div>
    );
}

export default AdminModule;
