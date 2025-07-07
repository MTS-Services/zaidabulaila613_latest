import { useRouter, useSearchParams } from 'next/navigation';

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue | QueryValue[]>;

export const useUpdateQueryParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (newParams: QueryParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      // Remove param if null or empty
      if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
        return;
      }

      // Convert arrays to comma-separated string
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  };
};