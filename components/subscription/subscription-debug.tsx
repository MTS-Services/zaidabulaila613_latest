'use client'
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_MY_SUBSCRIPTION } from '@/graphql/query';
import { useAuth } from '@/contexts/auth-context';

export function SubscriptionDebug() {
  const { user } = useAuth();
  const { data: subscriptionData, refetch, loading } = useQuery(GET_MY_SUBSCRIPTION, {
    skip: !user?.user?.id,
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-and-network'
  });

  const currentSubscription = subscriptionData?.getMySubscription || user?.subscription;

  return (
    <div className="p-4 bg-gray-50 border rounded-lg mb-4">
      <h3 className="font-bold mb-2">Subscription Debug Info</h3>
      <button 
        onClick={() => refetch()} 
        className="mb-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </button>
      
      <div className="text-sm space-y-1">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Subscription ID:</strong> {currentSubscription?.id || 'None'}</p>
        <p><strong>Plan:</strong> {currentSubscription?.plan || 'None'}</p>
        <p><strong>Status:</strong> {currentSubscription?.status || 'None'}</p>
        <p><strong>Cancel at Period End:</strong> {currentSubscription?.cancelAtPeriodEnd ? 'YES' : 'NO'}</p>
        <p><strong>Canceled At:</strong> {currentSubscription?.canceledAt || 'None'}</p>
        <p><strong>Period End:</strong> {currentSubscription?.currentPeriodEnd ? new Date(parseInt(currentSubscription.currentPeriodEnd)).toLocaleDateString() : 'None'}</p>
      </div>
      
      <div className="mt-2 text-xs">
        <p><strong>Raw Data:</strong></p>
        <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(currentSubscription, null, 2)}
        </pre>
      </div>
    </div>
  );
}