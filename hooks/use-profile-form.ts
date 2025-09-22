import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { enqueueSnackbar } from 'notistack';

import { UPDATE_USER_MUTATION } from '@/graphql/mutation';
import { useAuth } from '@/contexts/auth-context';
import { profileValidator } from '@/lib/validators/auth';

// 1. Infer the form data type directly from your Zod schema for perfect type safety
type ProfileFormData = z.infer<typeof profileValidator>;

/**
 * @description A custom hook to manage user profile update logic.
 * It encapsulates the GraphQL mutation, submission handling, state management,
 * and user notifications for the profile form.
 * @returns {object} An object containing the user, the submit handler, and the loading state.
 */
export const useProfileForm = () => {
  const { user, updateUser: updateAuthContext } = useAuth();
  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      const response = await updateUser({
        variables: {
          // The form data (data) now perfectly matches the expected structure
          user: {
            account: {
              firstName: data.firstName,
              lastName: data.lastName,
              country: data.country,
              email: data.email,
              mobile: data.mobile,
              lang: data.lang,
            },
          },
        },
      });

      const result = response?.data?.updateUser?.account;

      if (result) {
        updateAuthContext(result);
        enqueueSnackbar('Profile updated successfully', {
          variant: 'success',
          anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
        });
      }
    } catch (e: any) {
      console.error('GraphQL Profile Update Error:', e);
      const message =
        e?.graphQLErrors?.[0]?.message ||
        e?.message ||
        'Something went wrong during the update';

      enqueueSnackbar(message, {
        variant: 'error',
        anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
      });
    }
  };

  return {
    user,
    handleSubmit,
    loading,
  };
};
