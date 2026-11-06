import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
    LayoutDashboard,
    Package,
    Tags,
    Boxes,
    User,
    LogOut,
} from "lucide-react";

function Sidebar() {
    const { logout } = useAuth();

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Products",
            path: "/products",
            icon: Package,
        },
        {
            name: "Categories",
            path: "/categories",
            icon: Tags,
        },
        {
            name: "Inventory",
            path: "/inventory",
            icon: Boxes,
        },
    ];

    return (
        <aside className="w-[72px] md:w-64 min-h-screen bg-card border-r border-gray-200 flex flex-col shrink-0">
            {/* Logo */}
            <div className="h-[76px] flex items-center justify-center md:justify-start px-3 md:px-6 border-b border-gray-200">
                <h1 className="text-xl md:text-2xl font-bold text-primary">
                    <span className="md:hidden">Q</span>
                    <span className="hidden md:inline">QUEIFY</span>
                </h1>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 p-2 md:p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            title={item.name}
                            className={({ isActive }) =>
                                `flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl font-medium transition ${
                                    isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={20} />

                            <span className="hidden md:inline">
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-2 md:p-4 border-t border-gray-200 space-y-2">
                <NavLink
                    to="/profile"
                    title="Profile"
                    className="flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                    <User size={20} />

                    <span className="hidden md:inline">
                        Profile
                    </span>
                </NavLink>

                <button
                    onClick={logout}
                    title="Logout"
                    className="w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                >
                    <LogOut size={20} />

                    <span className="hidden md:inline">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;