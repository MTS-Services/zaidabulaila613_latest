"use client"

// pages/orders.tsx
import { useState } from 'react';
import Head from 'next/head';
import { Order, OrderItem, PaymentType } from '@/types/order';
import { Button } from '@/components/ui/button';
import VendorOrders from '@/interfaces/order/vendorOrders';
import UserOrders from '@/interfaces/order/userOrders';
import { useTranslation } from '@/hooks/use-translation';

// Mock data - replace with actual API calls
const mockOrders: any[] = [
    {
        id: '1',
        total: 125.99,
        ref: 'ORD-2023-001',
        status: 'Delivered',
        notes: 'Please deliver after 5pm',
        items: [
            {
                productId: 'prod-1',
                pictures: ['/product1.jpg'],
                qty: 2,
                size: 'M',
                color: 'Blue'
            },
            {
                productId: 'prod-2',
                pictures: ['/product2.jpg'],
                qty: 1,
                size: 'L',
                color: 'Red'
            }
        ],
        paymentType: 'Online',
        isPaid: true,
        city: 'New York',
        apartment: 'Apt 4B',
        createdAt: '2023-05-15T10:30:00Z'
    },
    {
        id: '2',
        total: 89.50,
        ref: 'ORD-2023-002',
        status: 'Processing',
        items: [
            {
                productId: 'prod-3',
                pictures: ['/product3.jpg'],
                qty: 1,
                size: 'S',
                color: 'Green'
            }
        ],
        paymentType: 'Cash',
        isPaid: false,
        city: 'Los Angeles',
        apartment: 'Unit 12',
        createdAt: '2023-05-18T14:45:00Z'
    }
];

export default function OrdersPage() {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [view, setView] = useState<'myOrder' | 'RecievedOrder'>('myOrder');

    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const {t} = useTranslation();

    return (
        <>
            <Head>
                <title>{t('dashboard.order.title')}</title>
            </Head>
            <div className="flex items-center justify-between mb-4">
                {/* <h1 className="text-2xl font-bold">User Products</h1> */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('myOrder')}
                        className={`p-2 rounded ${view === 'myOrder' ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        {t('dashboard.order.placebtn')}
                    </button>
                    <button
                        onClick={() => setView('RecievedOrder')}
                        className={`p-2 rounded ${view === 'RecievedOrder' ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        {t('dashboard.order.recievedbtn')}
                    </button>
                </div>
            </div>
            {
                view === 'RecievedOrder' ?
                    <VendorOrders />
                    :
                    <UserOrders />
            }
        </>
    );
}