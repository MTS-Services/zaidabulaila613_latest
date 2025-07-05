// 'use client'
// import { useMutation, useQuery } from '@apollo/client';
// import { GET_USER_PRODUCTS } from '@/graphql/query';
// import { useState } from 'react';
// import { FaTh, FaList } from 'react-icons/fa';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { IoMdMore } from "react-icons/io";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { DELETE_PRODUCT } from '@/graphql/mutation';
// import { enqueueSnackbar } from 'notistack';
// import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

// export default function UserProducts() {
//     const router = useRouter();
//     const [view, setView] = useState<'grid' | 'list'>('grid');
//     const { data, loading, error } = useQuery(GET_USER_PRODUCTS, {
//         fetchPolicy: 'network-only', // Ensures fresh data on each load
//     });
//     const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT, {
//         refetchQueries: [{ query: GET_USER_PRODUCTS }],
//         awaitRefetchQueries: true
//     });

//     if (loading) return <p className="p-6">Loading...</p>;
//     if (error) return <p className="p-6 text-red-600">Error: {error.message}</p>;

//     const products = data?.userProducts || [];

//     const handleEdit = (productId: string) => {
//         router.push(`/dashboard/dress/update/${productId}`);
//     };

//     const handleDelete = async (productId: string) => {
//         // Implement your delete logic here
//         console.log('Delete product', productId);
//         try {
//             await deleteProduct({
//                 variables: {
//                     id: productId
//                 }
//             })
//             enqueueSnackbar({
//                 message: "Your dress has been deleted successfully.",
//                 variant: 'success',
//                 anchorOrigin: { horizontal: "center", vertical: "bottom" }
//             })
//         } catch (e: any) {
//             const message =
//                 e?.graphQLErrors?.[0]?.message ||
//                 e?.message ||
//                 "Something went wrong during deleting dress";

//             enqueueSnackbar(message, {
//                 variant: 'error',
//                 anchorOrigin: { horizontal: "center", vertical: "bottom" },
//             });

//         }

//         // You might want to add a confirmation dialog before deleting
//     };

//     return (
//         <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//                 <h1 className="text-2xl font-bold">User Products</h1>
//                 <div className="flex gap-2">
//                     <Button className='mr-4' onClick={() => { router.push(`/dashboard/dress/create`) }}>Add Dress</Button>
//                     <button
//                         onClick={() => setView('grid')}
//                         className={`p-2 rounded ${view ? 'bg-black text-white' : 'bg-gray-200'}`}
//                     >
//                         <FaTh />
//                     </button>
//                     <button
//                         onClick={() => setView('list')}
//                         className={`p-2 rounded ${view === 'list' ? 'bg-black text-white' : 'bg-gray-200'}`}
//                     >
//                         <FaList />
//                     </button>
//                 </div>
//             </div>
//             {products.length === 0 &&
//                 <div className='flex justify-center absolute top-[50%] left-0 right-0'>
//                     <Link href={`/dashboard/dress/create`}>Create your first dress</Link>
//                 </div>
//             }
//             {view === 'grid' ? (
//                 <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                     {
//                         products.map((product: any) => (
//                             <div key={product.id} className="border relative rounded-xl overflow-hidden shadow-sm">
//                                 <img
//                                     src={`http://localhost:3000${product.pictures[0]?.path}`}
//                                     alt={product.name}
//                                     className="w-full h-48 object-cover cursor-pointer"
//                                     onClick={() => handleEdit(product.id)}
//                                 />
//                                 <div className='absolute top-2 right-2'>
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild>
//                                             <button className="p-2 hover:bg-gray-100 rounded-full">
//                                                 <IoMdMore size={20} className="text-gray-700" />
//                                             </button>
//                                         </DropdownMenuTrigger>
//                                         <DropdownMenuContent align="end" className="w-40">
//                                             <div
//                                                 className='flex flex-col items-start pl-2 gap-1'
//                                             >
//                                                 <button onClick={() => handleEdit(product.id)}>
//                                                     Edit
//                                                 </button>
//                                                 <button className="text-red-600" disabled={deleteLoading} onClick={(e) => {
//                                                     handleDelete(product.id);
//                                                 }}>
//                                                     Delete
//                                                 </button>

//                                             </div>
//                                             {/* <DropdownMenuItem style={{ cursor: 'pointer' }} onClick={() => handleEdit(product.id)}>
//                                             Edit
//                                         </DropdownMenuItem>
//                                         <DropdownMenuItem style={{ cursor: 'pointer' }} disabled={deleteLoading} onClick={(e) => {
//                                             handleDelete(product.id);
//                                         }} className="text-red-600">
//                                             Delete
//                                         </DropdownMenuItem> */}
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>

//                                 </div>

//                                 <div className="p-4 cursor-pointer" onClick={() => handleEdit(product.id)}>
//                                     <h2 className="text-lg font-semibold">{product.name}</h2>
//                                     <p className="text-gray-500 text-sm capitalize">{product.type}</p>
//                                     <p className="mt-2 font-bold text-black">

//                                         ${product?.rent ? `${product.rentPerHur} / Per Day` : product.price
//                                         }

//                                     </p>
//                                     {product.oldPrice && (
//                                         <p className="text-sm text-gray-400 line-through">${product.oldPrice}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             ) : (
//                 <ul className="space-y-4">
//                     {products.map((product: any) => (
//                         <li key={product.id} className="flex gap-4 border rounded-lg p-4 items-center">
//                             <img
//                                 src={`http://localhost:3000${product.pictures[0]?.path}`}
//                                 alt={product.name}
//                                 className="w-24 h-24 object-cover rounded-md cursor-pointer"
//                                 onClick={() => handleEdit(product.id)}
//                             />
//                             <div className="flex-1 cursor-pointer" onClick={() => handleEdit(product.id)}>
//                                 <h2 className="text-lg font-semibold">{product.name}</h2>
//                                 <p className="text-gray-500 text-sm">{product.type}</p>
//                                 <p className="font-bold">${product.price}</p>
//                                 {product.oldPrice && (
//                                     <p className="text-sm text-gray-400 line-through">${product.oldPrice}</p>
//                                 )}
//                             </div>
//                             <div className='flex gap-2'>
//                                 <button className='bg-transparent'>
//                                     <MdEdit color='green' onClick={() => handleEdit(product.id)} />

//                                 </button>
//                                 <button className='bg-transparent' disabled={deleteLoading} onClick={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                     handleDelete(product.id);
//                                 }}>
//                                     <MdOutlineDeleteOutline color='red' />

//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     );
// }


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
        router.push(`/dashboard/users/${userId}`)
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
                    <Button className='mr-4' onClick={() => { router.push(`/dashboard/dress/import`) }}>{t('common.import')}</Button>


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