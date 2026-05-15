import { Link, useLocation } from "react-router-dom";

interface AdminSideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSideBar = ({ isOpen, onClose }: AdminSideBarProps) => {
    const location = useLocation();
    console.log('location',location.pathname.split('/')[2]);
    const menuItems = [
        { name: "Dashboard", path: "/admin" },
        { name: "Products", path: "/admin/products" },
        { name: "Users", path: "/admin/users" },    
        { name: "Logs", path: "/admin/logs" }
    ];

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-screen w-64 mt-16  bg-white border-r shadow-sm z-50 transform transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0`}
            >
                <nav className="p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const isActive = location.pathname.split('/')[2] === item.name.toLocaleLowerCase();

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={onClose}
                                        className={`block px-4 py-3 rounded-lg font-medium transition-all
                                        ${
                                            isActive
                                                ? "bg-blue-500 text-white shadow-sm"
                                                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default AdminSideBar;
