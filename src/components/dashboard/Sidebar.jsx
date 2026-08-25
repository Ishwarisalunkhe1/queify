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
        <aside className="w-64 min-h-screen bg-card border-r border-gray-200 flex flex-col">

            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-primary">
                    QUEIFY
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">

                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`
                            }
                        >
                            <Icon size={20} />
                            {item.name}
                        </NavLink>
                    );
                })}

            </nav>

            <div className="p-4 border-t border-gray-200 space-y-2">

                <NavLink
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100"
                >
                    <User size={20} />
                    Profile
                </NavLink>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
                >
                    <LogOut size={20} />
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;