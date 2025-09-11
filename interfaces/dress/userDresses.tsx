'use client'
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import DataTable from '@/components/dataTable';
import { Product, ProductCategory, ProductPicture, ProductSize, UserProductsResponse } from '@/types/product';
import { ColumnDef } from '@/types/table';
import { MoreVertical, Edit, Trash2, Eye, Currency } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { GET_USER_PRODUCTS } from '@/graphql/query';
import Image from 'next/image';
import { config } from '@/constants/app';
import { useTranslation } from '@/hooks/use-translation';
import { useCurrency } from '@/contexts/currency-context';
import { Button } from '@/components/ui/button';
import { DELETE_PRODUCT } from '@/graphql/mutation';
import { enqueueSnackbar } from 'notistack';
import { useUserSubscription } from '@/hooks/useSubscription';
import TooltipBox from '@/components/tooltipBox';

type ProductTableData = {
    id: string;
    name: string;
    type: string;
    selectedColor: string;
    origin: string;
    qty: number;
    approve: boolean;
    price?: number;
    oldPrice?: number;
    size: ProductSize[];
    color: string[];
    category: ProductCategory | null;
    pictures: ProductPicture[];
};

const Users = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState({ field: 'account.firstName', direction: 'asc' });
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const router = useRouter()
    const { language, t } = useTranslation()
    const { selectedCurrency } = useCurrency()
    const [approve, setApprove] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const { bulkUpload } = useUserSubscription()

    const { loading, error, data, refetch } = useQuery<UserProductsResponse>(GET_USER_PRODUCTS, {
        variables: {
            language: language,
            currency: (selectedCurrency.code).toLowerCase(),
            approve: approve,
            page,
            limit: pageSize,
            search: searchTerm,
            sortField: sortOption.field,
            sortOrder: sortOption.direction,
        },
        fetchPolicy: 'network-only',
    });

    const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT);

    // Refresh when language changes
    useEffect(() => {
        refetch({ language });
    }, [language]);

    // Refresh when currency changes
    useEffect(() => {
        refetch({ currency: (selectedCurrency.code).toLowerCase() });
    }, [selectedCurrency]);




    // Helper function to get nested property values
    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc?.[part], obj);
    };

    const handleView = (userId: string) => {
        console.log('View user:', userId);
        router.push(`/products/${userId}`)
        // Add your view logic here
    };

    const handleEdit = (id: string) => {
        console.log('Edit user:', id);
        // Add your edit logic here
        router.push(`/dashboard/dress/update/${id}`)
    };

    const handleDelete = async (productId: string) => {
        // Implement your delete logic here
        console.log('Delete product', productId);
        setIsDeleting(true)
        try {
            await deleteProduct({
                variables: {
                    id: productId
                }
            })
            refetch()
            setIsDeleting(false)
            enqueueSnackbar({
                message: "Your dress has been deleted successfully.",
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" }
            })
        } catch (e: any) {
            setIsDeleting(false)
            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during deleting dress";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        }

        // You might want to add a confirmation dialog before deleting
    };

    const columns: ColumnDef<ProductTableData>[] = [
        {
            header: t('userProducts.image'),
            accessor: 'pictures',
            cell: (value, row) => (
                row.pictures?.length > 0 ? (
                    <div className="w-12 h-12 relative">
                        <Image
                            src={config.API_URL + row.pictures[0].path}
                            alt={row.name}
                            fill
                            className="object-cover rounded"
                        />
                    </div>
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">{t('userProducts.noImage')}</span>
                    </div>
                )
            ),
        },
        {
            header: t('userProducts.name'),
            accessor: 'name',
            sortable: true,
        },
        {
            header: t('userProducts.price'),
            accessor: 'price',
            sortable: true,
            cell: (value) => `${parseInt(value).toFixed(2)}`,
        },
        {
            header: t('userProducts.type'),
            accessor: 'type',
            sortable: true,
        },
        {
            header: t('userProducts.quantity'),
            accessor: 'qty',
            sortable: true,
        },
        {
            header: t('userProducts.category'),
            accessor: 'category',
            cell: (value, row) => row.category ? row.category.name : '-',
            sortable: true,
        },
        {
            header: t('userProducts.approved'),
            accessor: 'approve',
            sortable: true,
            cell: (value) => (
                <span className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {value ? t('userProducts.approved') : t('userProducts.notApproved')}
                </span>
            ),
        },
        {
            header: t('userProducts.actions'),
            accessor: 'id',
            cell: (value, row) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-gray-100">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <button onClick={() => handleView(row.id)} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>{t('common.view')}</span>
                        </button>
                        <button onClick={() => handleEdit(row.id)} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            <span>{t('common.edit')}</span>
                        </button>
                        <button disabled={isDeleting} onClick={() => handleDelete(row.id)} className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-4 w-4" />
                            <span>{t('common.delete')}</span>
                        </button>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const products = data?.userProducts?.data?.map(product => ({
        ...product
    })) || [];

    return (
        <div className="p-6">


            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{t('userProducts.products')}</h1>
                    <button
                        onClick={() => setApprove(true)}
                        className={`p-2 rounded ${approve ? 'bg-black text-white' : 'bg-gray-200'} text-xs`}
                    >
                        {t('userProducts.approved')}
                    </button>
                    <button
                        onClick={() => setApprove(false)}
                        className={`p-2 rounded ${!approve ? 'bg-black text-white' : 'bg-gray-200'} text-xs`}
                    >
                        {t('userProducts.notApproved')}
                    </button>
                </div>
                <div className="flex gap-2">
                    <Button className='mr-4' onClick={() => { router.push(`/dashboard/dress/create`) }}>{t('userProducts.addDress')}</Button>
                    
                    {
                        bulkUpload ? 
                        <Button className='mr-4' onClick={() => { router.push(`/dashboard/dress/import`) }}>{t('common.import')}</Button>
                        :
                    <TooltipBox text='Upgrade your subscription'>
                        <Button className='mr-4' disabled>{t('common.import')}</Button>

                    </TooltipBox>

                    }


                </div>
            </div>
            <DataTable<ProductTableData>
                data={products}
                columns={columns}
                loading={loading}
                error={error?.message}
                onSearch={setSearchTerm}
                onSort={setSortOption}
                onPageChange={setPage}
                totalItems={data?.userProducts?.total || 0}
                pageSize={pageSize}
                currentPage={page}
                searchPlaceholder={t('userProducts.searchProducts')}
            />
        </div>
    );
};

export default Users;