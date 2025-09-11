'use client'
import { useState } from 'react';
import { Inbox } from 'lucide-react';
import Papa from 'papaparse';
import { IMPORT_PRODUCT } from '@/graphql/mutation';
import { useMutation } from '@apollo/client';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/ui/button';
import ProductLoader from '@/components/productLoader';
import { useUserSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/auth-context';

const REQUIRED_HEADERS = [
    "language",
    "currency",
    "name",
    "description",
    "category",
    "price",
    "oldPrice",
    "type",
    "color",
    "selectedColor",
    "origin",
    "chest",
    "waist",
    "hip",
    "shoulder",
    "high",
    "length",
    "sleeve",
    "underlay",
    "qty",
    "ref",
    "state",
    "size",
    "material",
    "careInstructions",
    "images"
];

export default function ImportDress() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [loading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false)
    const [productCount, setProductsCount] = useState<number>(0)
    const {bulkUpload, maxDresses} = useUserSubscription()
    const {user} = useAuth()
    console.log(user?.productsCount, "user products count")
    const [uploadCsv] = useMutation(IMPORT_PRODUCT, {
        
    })

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setSuccess(null);
        const file = e.target.files?.[0];
        if (!file || file.type !== 'text/csv') {
            setError('Only CSV files are allowed.');
            return;
        }

        Papa.parse(file, {
            header: true,
            complete: (results: Papa.ParseResult<any>) => {
                const headers = results.meta.fields;
                const rows = results.data.filter((row) => Object.values(row).some(val => val !== ''));

                if (!headers || REQUIRED_HEADERS.some(h => !headers.includes(h))) {
                    setError(`CSV must include the following columns: ${REQUIRED_HEADERS.join(', ')}`);
                    return;
                }

                if (rows.length === 0) {
                    setError('CSV file contains no rows.');
                    return;
                }

                if(!bulkUpload){
                    setError('Upgrade your subscription.');
                }

                setCsvFile(file)

                setProductsCount(rows.length)
                setSuccess(`File has ${rows.length} dresses`);
            },
            error: () => setError('Failed to parse CSV file.')
        });
    };


    const upload = async () => {
        console.log(csvFile, "csvFile")
        try {
            if (!csvFile) {
                return
            }
            setIsLoading(true)
            const result = await uploadCsv({
                variables: {
                    file: csvFile
                },
            })

            console.log(result, "Result")
            setIsLoading(false)
            setError(null)
            setSuccess(null)
            enqueueSnackbar({
                message: "Your dresses has uploading.",
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" }
            })
            setCsvFile(null)
            setUploading(true)

            // router.push("/dashboard/dress")
        } catch (e: any) {

            console.error("GraphQL Update Error:", e);
            setIsLoading(false)
            const message =
                e?.graphQLErrors?.[0]?.message ||
                e?.message ||
                "Something went wrong during updating dress";

            enqueueSnackbar(message, {
                variant: 'error',
                anchorOrigin: { horizontal: "center", vertical: "bottom" },
            });

        } finally {
            // setIsSubmitting(false)
        }
    }

    return (
        <div className="p-6">


            <div className="flex items-center justify-between mb-4">
                {/* <div>
                    <h1 className="text-2xl font-bold">Import Dresses</h1>

                </div> */}

            </div>
            {
                uploading ?
                    <ProductLoader productsLength={productCount} redirectTo='/dashboard/dress' />
                    :
                    <div className=" flex flex-col justify-center items-center p-4">
                        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                            <div className="mb-4">
                                <Inbox className="mx-auto h-16 w-16 text-gold" />
                                <h1 className="text-xl font-bold mt-4 text-center">Upload CSV File</h1>
                                <p className="text-sm text-gray-500 text-center">Only files with columns</p>
                                <p className="text-xs text-gray-400 text-center mt-1">{REQUIRED_HEADERS.join(', ')}</p>
                            </div>

                            <label className="block border-dashed border-2 border-gold py-10 rounded-lg cursor-pointer hover:bg-blue-50">
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <p className="text-gold-dark font-medium">Click to upload your CSV</p>
                            </label>

                            <a
                                href="/sample.csv"
                                download
                                className="mt-4 inline-block text-gold underline text-sm"
                            >
                                Download sample.csv
                            </a>

                            <div className='flex flex-col gap-2'>

                                {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                                {success && <p className="text-green-500 mt-4 text-sm mb-4">{success}</p>}
                                {csvFile &&
                                    <Button onClick={() => upload()} disabled={loading}>
                                        Import
                                    </Button>

                                }
                            </div>
                        </div>
                    </div>

            }
        </div>
    );
}
