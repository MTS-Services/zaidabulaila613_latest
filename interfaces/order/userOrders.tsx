"use client"

// pages/orders.tsx
import { useState } from 'react';
import Head from 'next/head';
import { Order, OrderItem, PaymentType } from '@/types/order';
import { Button } from '@/components/ui/button';
import { useQuery } from '@apollo/client';
import { GET_USER_ORDERS, GET_VENDOR_ORDERS } from '@/graphql/query';
import { config } from '@/constants/app';



export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

const statusOptions: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function UserOrders() {
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

    const { loading, error, data } = useQuery(GET_USER_ORDERS, {
        fetchPolicy: 'network-only', // Ensures fresh data on each load
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-red-500">Error loading orders: {error.message}</div>
        </div>
    );

    const orders = data?.orders || [];


    const toggleOrder = (orderId: string) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    return (
        <>
            <Head>
                <title>My Orders</title>
            </Head>
            {/* <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">User Products</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('myOrder')}
                        className={`p-2 rounded ${view === 'myOrder' ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        Placed Orders
                    </button>
                    <button
                        onClick={() => setView('RecievedOrder')}
                        className={`p-2 rounded ${view === 'RecievedOrder' ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                        Received Orders
                    </button>
                </div>
            </div> */}

            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                        <p className="mt-2 text-sm text-gray-600">Manage your placed orders</p>
                    </div>

                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div key={order.id} className="bg-white shadow overflow-hidden rounded-lg">
                                <div
                                    className="px-4 py-5 sm:px-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleOrder(order.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                Order #{order.ref}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-lg font-semibold text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            </div>
                                            <svg
                                                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''
                                                    }`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {expandedOrderId === order.id && (
                                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                            <div className="md:col-span-2">
                                                <h4 className="text-md font-medium text-gray-900 mb-3">Order Items</h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item: any, index: number) => (
                                                        <div key={index} className="flex items-start space-x-4 p-3 border rounded-lg">
                                                            <div className="flex-shrink-0">
                                                                <img
                                                                    className="h-16 w-16 rounded-md object-cover"
                                                                    src={config.API_URL + item.product?.pictures[0].path || '/placeholder-product.jpg'}
                                                                    alt="Product"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-gray-900">{item?.product?.name}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {item.size}, {item.color}
                                                                </p>
                                                                <p className="text-sm font-medium mt-1">
                                                                    ${item.total}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>


                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="text-md font-medium text-gray-900 mb-3">Order Details</h4>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-500">Payment Method:</span>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {order.paymentType}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-500">Payment Status:</span>
                                                            <span className="text-sm font-medium text-gray-900">
                                                                {order.isPaid ? 'Paid' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-sm text-gray-500">Delivery Address:</span>
                                                            <span className="text-sm font-medium text-gray-900 text-right">
                                                                {order.address?.
                                                                    appartment
                                                                }, {order.address?.street}, {order.address?.city}
                                                            </span>
                                                        </div>
                                                        {order.notes && (
                                                            <div>
                                                                <p className="text-sm text-gray-500">Notes:</p>
                                                                <p className="text-sm font-medium text-gray-900 mt-1">
                                                                    {order.notes}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* <div>
                                                    <h4 className="text-md font-medium text-gray-900 mb-3">Update Status</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {statusOptions.map((status) => (
                                                            <button
                                                                key={status}
                                                                // onClick={() => updateOrderStatus(order.id, status)}
                                                                // disabled={updatingStatus === order.id || order.status === status}
                                                                className={`px-3 py-1 text-sm rounded-full ${order.status === (status).toLowerCase()
                                                                    ? 'bg-gold text-white'
                                                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                                    } ${updatingStatus === order.id ? 'opacity-50 cursor-not-allowed' : ''
                                                                    }`}
                                                            >
                                                                {status}
                                                                {updatingStatus === order.id && order.status === (status).toLowerCase() && (
                                                                    <span className="ml-1 inline-block animate-spin">↻</span>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div> */}

                                                {/* <div className="pt-4 border-t border-gray-200">
                                                    <button
                                                        onClick={() => window.print()}
                                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    >
                                                        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                        </svg>
                                                        Print Order
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {orders.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders placed</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You haven't placed any orders yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
}