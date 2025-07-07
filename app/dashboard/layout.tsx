import UserSidebar from "@/components/user-sidebar";
import AuthGuard from "@/guards/authGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="flex">
                <div className="pt-16">
                    <UserSidebar />

                </div>
                <main className="flex-1 px:[10px] sm:p-6 pt-16">
                    <div className="p-4">
                        {/* <h2 className="text-xl font-bold">Dashboard</h2> */}
                    </div>
                    {children}</main>
            </div>
        </AuthGuard>

    );
}
