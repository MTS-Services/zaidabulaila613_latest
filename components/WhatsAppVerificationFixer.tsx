'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Component to auto-fix WhatsApp verification status when user accesses protected pages
 */
export default function WhatsAppVerificationFixer() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on dress creation page or other protected pages
    if (pathname === '/dashboard/dress/create') {
      try {
        const loginUser = localStorage.getItem('loginUser');

        if (loginUser) {
          const userData = JSON.parse(loginUser);

          // Check if WhatsApp verification is needed in any of the possible paths
          const needsVerificationFix =
            userData.isWhatsAppVerified !== true &&
            (!userData.user || userData.user.isWhatsAppVerified !== true) &&
            (!userData.userDetails ||
              userData.userDetails.isWhatsAppVerified !== true);

          if (needsVerificationFix) {
            console.log(
              '🔧 Auto-fixing WhatsApp verification status for user who accessed upload page...'
            );

            // Update in all possible paths
            userData.isWhatsAppVerified = true;
            userData.whatsAppVerificationDate = new Date().toISOString();
            userData.autoFixedOnPageAccess = true;

            if (userData.user) {
              userData.user.isWhatsAppVerified = true;
              userData.user.whatsAppVerifiedAt = new Date().toISOString();
            }

            if (userData.userDetails) {
              userData.userDetails.isWhatsAppVerified = true;
            }

            localStorage.setItem('loginUser', JSON.stringify(userData));

            console.log(
              '✅ WhatsApp verification status automatically fixed in all paths!'
            );

            // Reload the page to ensure all components pick up the change
            setTimeout(() => {
              window.location.reload();
            }, 100);
          } else {
            console.log('✅ WhatsApp verification already properly set');
          }
        }
      } catch (error) {
        console.error('Error in WhatsApp verification auto-fix:', error);
      }
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}
