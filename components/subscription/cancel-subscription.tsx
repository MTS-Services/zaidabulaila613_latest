'use client'
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CANCEL_SUBSCRIPTION_MUTATION } from '@/graphql/mutation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { enqueueSnackbar } from 'notistack';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslation } from '@/hooks/use-translation';

interface CancelSubscriptionProps {
  subscription: {
    id: string;
    plan: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd?: boolean;
  };
  onCancelSuccess?: () => void;
}

export function CancelSubscription({ subscription, onCancelSuccess }: CancelSubscriptionProps) {
  const { t } = useTranslation();
  const { user, updateUserSubscription } = useAuth();
  const [canceling, setCanceling] = useState(false);
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION_MUTATION);

  const handleCancelSubscription = async () => {
    if (!subscription?.id) {
      enqueueSnackbar({ 
        message: "Subscription not found", 
        variant: 'error', 
        anchorOrigin: { horizontal: "center", vertical: "bottom" } 
      });
      return;
    }

    try {
      setCanceling(true);

      const result = await cancelSubscription({
        variables: {
          subscriptionId: subscription.id,
        },
      });

      if (result.data?.cancelSubscription?.success) {
        // Update user subscription in context to reflect the cancellation
        if (result.data.cancelSubscription.subscription && user?.subscription) {
          updateUserSubscription({
            ...user.subscription,
            cancelAtPeriodEnd: true,
            canceledAt: new Date().toISOString(),
          });
        }

        // Call the success callback to refetch data
        if (onCancelSuccess) {
          onCancelSuccess();
        }

        enqueueSnackbar({ 
          message: result.data.cancelSubscription.message || "Subscription will be canceled at the end of the current billing period", 
          variant: 'success', 
          anchorOrigin: { horizontal: "center", vertical: "bottom" } 
        });

        // Call the success callback to refresh subscription data
        if (onCancelSuccess) {
          onCancelSuccess();
        }
      } else {
        enqueueSnackbar({ 
          message: result.data?.cancelSubscription?.message || "Failed to cancel subscription", 
          variant: 'error', 
          anchorOrigin: { horizontal: "center", vertical: "bottom" } 
        });
      }
    } catch (error: any) {
      console.error('Error canceling subscription:', error);
      
      let errorMessage = "Failed to cancel subscription. Please try again.";
      
      if (error.networkError) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      enqueueSnackbar({ 
        message: errorMessage, 
        variant: 'error', 
        anchorOrigin: { horizontal: "center", vertical: "bottom" } 
      });
    } finally {
      setCanceling(false);
    }
  };

  // Don't show cancel button if subscription is already set to cancel
  if (subscription.cancelAtPeriodEnd) {
    return (
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">
              {t('dashboard.subcription.cancelation_scheduled')}
            </p>
            <p className="text-xs text-amber-700">
              Access continues until {new Date(parseInt(subscription.currentPeriodEnd)).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-red-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-400 hover:text-red-700 transition-all duration-200 font-medium"
          >
            {t('dashboard.subcription.cancel_subscription')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('dashboard.subcription.cancel_confirmation_title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                {t('dashboard.subcription.cancel_confirmation_description')}
              </p>
              <p className="font-medium">
                {t('dashboard.subcription.current_plan')}: {subscription.plan}
              </p>
              <p>
                {t('dashboard.subcription.access_until')}: {new Date(parseInt(subscription.currentPeriodEnd)).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {t('dashboard.subcription.cancel_confirmation_note')}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('dashboard.subcription.keep_subscription')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700"
            >
              {canceling ? t('dashboard.subcription.canceling') : t('dashboard.subcription.yes_cancel')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}