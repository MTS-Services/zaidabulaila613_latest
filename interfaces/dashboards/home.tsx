'use client'
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { DashboardData } from '@/types/dashboard';
import { GET_DASHBOARD_DATA } from '@/graphql/query';
import { CircleCheckBig, Folders, PackageSearch, CircleDashed } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';


const Dashboard = () => {
    const { t } = useTranslation();
    const { loading, error, data } = useQuery<{ userDashboard: DashboardData }>(GET_DASHBOARD_DATA);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;

    const dashboardData = data?.userDashboard;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Analytics</h1> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* User Stats */}
                <StatCard
                    title={t("dashboard.pendingOrders")}
                    value={dashboardData?.pending || 0}
                    icon={<CircleDashed />}
                    color="bg-white"
                />

                <StatCard
                    title={t("dashboard.inProcessOrders")}
                    value={dashboardData?.processing || 0}
                    icon={<PackageSearch />}
                    color="bg-white"
                />
                <StatCard
                    title={t("dashboard.totalOrders")}
                    value={dashboardData?.total || 0}
                    icon={<Folders />}
                    color="bg-white"
                />
                <StatCard
                    title={t("dashboard.completedOrders")}
                    value={dashboardData?.completed || 0}
                    icon={<CircleCheckBig />}
                    color="bg-white"
                />
            </div>

            {/* Product Analytics */}
            {/* <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            title="Total Products" 
            value={dashboardData?.productAnalytics.total || 0} 
            small
          />
          <StatCard 
            title="Approved" 
            value={dashboardData?.productAnalytics.approved || 0} 
            small
            
          />
          <StatCard 
            title="Not Approved" 
            value={dashboardData?.productAnalytics.notApproved || 0} 
            small
            
          />
          <StatCard 
            title="Approval Rate" 
            value={`${dashboardData?.productAnalytics.approvalPercentage.toFixed(2) || 0}%`} 
            small
            
          />
        </div>
      </div> */}

            {/* Orders Analytics */}
            {/* <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Orders Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard 
            title="Total Orders" 
            value={dashboardData?.ordersAnalytics.total || 0} 
          />
          <StatCard 
            title="Paid Orders" 
            value={dashboardData?.ordersAnalytics.paid || 0} 
          />
          <StatCard 
            title="Unpaid Orders" 
            value={dashboardData?.ordersAnalytics.unpaid || 0} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Payment Completion" 
            value={`${dashboardData?.ordersAnalytics.paymentPercentage || 0}%`} 
          />
          <StatCard 
            title="Total Revenue" 
            value={`$${(dashboardData?.ordersAnalytics.totalRevenue || 0).toLocaleString()}`} 
          />
          <StatCard 
            title="Avg Order Value" 
            value={`$${(dashboardData?.ordersAnalytics.averageOrderValue || 0).toFixed(2)}`} 
          />
        </div>
      </div> */}
        </div>
    );
};

// StatCard component
const StatCard = ({ title, value, icon, color = 'bg-white', small = false }: {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    color?: string;
    small?: boolean;
}) => (
    <div className={`${color} rounded-lg shadow p-${small ? '4' : '6'} flex flex-col`}>
        <div className="flex justify-between items-center">
            <h3 className={`${small ? 'text-sm' : 'text-lg'} font-medium text-gray-600`}>{title}</h3>
            {icon && <div className="text-white p-2 rounded-full bg-opacity-20">{icon}</div>}
        </div>
        <p className={`${small ? 'text-2xl' : 'text-3xl'} font-bold text-gray-800 mt-2`}>{value}</p>
    </div>
);

// Simple icon components
const UsersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const SubscriptionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
);

export default Dashboard;