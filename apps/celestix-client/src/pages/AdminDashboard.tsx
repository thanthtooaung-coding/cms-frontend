import { useNavigate, Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar";
import { useTenantPath } from "@/hooks/useTenantPath";
import { useAuthDataStore } from "@/store/auth-store";

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { getPath, tenantSlug } = useTenantPath();
    const { clearUser } = useAuthDataStore();

    const handleLogout = () => {
        clearUser();
        localStorage.removeItem("bms_token");
        localStorage.removeItem("user");
        localStorage.removeItem("tenant_id");
        localStorage.removeItem("role");
        const redirectPath = tenantSlug ? `/bms/${tenantSlug}/login` : '/login';
        navigate(redirectPath);
    }

    const handlePageChange = (page: string) => {
        if (page === "logout") {
            handleLogout();
        } else {
            // Navigation is handled by Link components in Sidebar, so this is mainly for logout
        }
    };

    return (
        <div className="min-h-screen bg-gradient-primary">
            <div className="flex">
                <Sidebar onPageChange={handlePageChange} />
                <div className="flex-1 flex flex-col">
                    <main className="flex-1 p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};
