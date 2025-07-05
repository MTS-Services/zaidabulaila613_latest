'use client'
import { useState } from 'react';
import { Inbox } from 'lucide-react';
import Papa from 'papaparse';
import { IMPORT_PRODUCT } from '@/graphql/mutation';
import { useMutation } from '@apollo/client';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@/components/ui/button';

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

    const [uploadCsv] = useMutation(IMPORT_PRODUCT, {
        // refetchQueries: [{ query: GET_PRODUCT_BY_ID, variables: { id: id } }],
        // awaitRefetchQueries: true
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

                setCsvFile(file)


                setSuccess(`File has ${rows.length} dresses.`);
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
            enqueueSnackbar({
                message: "Your dresses has uploading.",
                variant: 'success',
                anchorOrigin: { horizontal: "center", vertical: "bottom" }
            })

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
                <div>
                    <h1 className="text-2xl font-bold">Import Dresses</h1>

                </div>

            </div>
            <div className=" flex flex-col justify-center items-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
                    <div className="mb-4">
                        <Inbox className="mx-auto h-16 w-16 text-blue-500" />
                        <h1 className="text-xl font-bold mt-4">Upload CSV File</h1>
                        <p className="text-sm text-gray-500">Only files with columns: </p>
                    </div>

                    <label className="block border-dashed border-2 border-blue-500 py-10 rounded-lg cursor-pointer hover:bg-blue-50">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <p className="text-blue-600 font-medium">Click to upload your CSV</p>
                    </label>

                    <a
                        href="/sample.csv"
                        download
                        className="mt-4 inline-block text-blue-600 underline text-sm"
                    >
                        Download sample.csv
                    </a>


                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    {success && <p className="text-green-500 mt-4 text-sm">{success}</p>}
                    {csvFile &&
                        <Button onClick={() => upload()} disabled={loading}>
                            Import
                        </Button>

                    }
                </div>
            </div>
        </div>
    );
}
