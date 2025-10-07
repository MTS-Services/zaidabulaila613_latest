/**
 * Check if the user's WhatsApp number is verified from localStorage
 * @returns boolean - true if verified, false otherwise
 */
export const isWhatsAppVerified = (): boolean => {
  try {
    if (typeof window === 'undefined') {
      console.log('isWhatsAppVerified: Window is undefined, returning false');
      return false;
    }

    const loginUser = localStorage.getItem('loginUser');
    console.log('isWhatsAppVerified: loginUser from localStorage:', loginUser);

    if (!loginUser) {
      console.log('isWhatsAppVerified: No loginUser found in localStorage');
      return false;
    }

    const userData = JSON.parse(loginUser);
    console.log('isWhatsAppVerified: Full userData structure:', userData);

    // Check multiple possible paths for WhatsApp verification
    let isVerified = false;

    // Path 1: Direct property (for manually set values)
    if (userData.isWhatsAppVerified === true) {
      isVerified = true;
      console.log('isWhatsAppVerified: Found via direct property');
    }

    // Path 2: Check in user object (from API response structure)
    else if (userData.user && userData.user.isWhatsAppVerified === true) {
      isVerified = true;
      console.log(
        'isWhatsAppVerified: Found via userData.user.isWhatsAppVerified'
      );
    }

    // Path 3: Check in userDetails (from access token structure)
    else if (
      userData.userDetails &&
      userData.userDetails.isWhatsAppVerified === true
    ) {
      isVerified = true;
      console.log(
        'isWhatsAppVerified: Found via userData.userDetails.isWhatsAppVerified'
      );
    }

    console.log('isWhatsAppVerified: Final verification result:', isVerified);
    return isVerified;
  } catch (error) {
    console.error(
      'isWhatsAppVerified: Error checking WhatsApp verification status:',
      error
    );
    return false;
  }
};

/**
 * Update the WhatsApp verification status in localStorage
 * @param status - verification status to set
 */
export const updateWhatsAppVerificationStatus = (status: boolean): void => {
  try {
    if (typeof window === 'undefined') {
      console.log('updateWhatsAppVerificationStatus: Window is undefined');
      return;
    }

    const loginUser = localStorage.getItem('loginUser');
    console.log(
      'updateWhatsAppVerificationStatus: Current loginUser:',
      loginUser
    );

    if (loginUser) {
      const userData = JSON.parse(loginUser);
      console.log(
        'updateWhatsAppVerificationStatus: Current userData structure:',
        userData
      );

      // Update in multiple places to ensure compatibility
      userData.isWhatsAppVerified = status;
      userData.whatsAppVerificationDate = new Date().toISOString();

      // Also update in user object if it exists (API response structure)
      if (userData.user) {
        userData.user.isWhatsAppVerified = status;
        userData.user.whatsAppVerifiedAt = new Date().toISOString();
      }

      // Also update in userDetails if it exists (token structure)
      if (userData.userDetails) {
        userData.userDetails.isWhatsAppVerified = status;
      }

      localStorage.setItem('loginUser', JSON.stringify(userData));
      console.log(
        'updateWhatsAppVerificationStatus: Updated userData with multiple paths:',
        userData
      );

      // Verify the update
      const updatedLoginUser = localStorage.getItem('loginUser');
      const updatedUserData = JSON.parse(updatedLoginUser || '{}');
      console.log('updateWhatsAppVerificationStatus: Verification check:', {
        direct: updatedUserData.isWhatsAppVerified,
        user: updatedUserData.user?.isWhatsAppVerified,
        userDetails: updatedUserData.userDetails?.isWhatsAppVerified,
      });
    } else {
      console.log('updateWhatsAppVerificationStatus: No loginUser found');
    }
  } catch (error) {
    console.error(
      'updateWhatsAppVerificationStatus: Error updating WhatsApp verification status:',
      error
    );
  }
};

/**
 * Force update WhatsApp verification to true - used when user successfully accesses protected pages
 */
export const forceWhatsAppVerified = (): void => {
  try {
    if (typeof window === 'undefined') return;

    const loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
      const userData = JSON.parse(loginUser);
      userData.isWhatsAppVerified = true;
      userData.whatsAppVerificationDate = new Date().toISOString();
      userData.forcedVerification = true;
      localStorage.setItem('loginUser', JSON.stringify(userData));
      console.log('🔧 Force-updated WhatsApp verification to true');
    }
  } catch (error) {
    console.error('Error force-updating WhatsApp verification:', error);
  }
};
