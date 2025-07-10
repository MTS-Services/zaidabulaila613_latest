"use client"
import UserSidebar from "@/components/user-sidebar";
import { useAuth } from "@/contexts/auth-context";
import { GET_USER_PROFILE } from "@/graphql/query";
import AuthGuard from "@/guards/authGuard";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { updateUserProductsCount, updateUserSubscription } = useAuth()
    const { loading, error, data } = useQuery(GET_USER_PROFILE);
    const { user } = useAuth()
    useEffect(() => {
        if (data?.userProfile) {
            const newCount = data.userProfile.productsCount;
            const newSub = data.userProfile.subscription;

            // Avoid unnecessary context updates
            if (newCount !== user?.productsCount) {
                updateUserProductsCount(newCount);
            }

            if (newSub !== user?.subscription) {
                updateUserSubscription(newSub);
            }
        }
    }, [data?.userProfile]);
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
