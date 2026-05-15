import { useEffect, useState } from "react";
import Pagination from "../../molecules/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Search, X, Pencil, Trash2 } from "lucide-react";
import Button from "../../atoms/button";
import PaginationSkeleton from "../../molecules/paginationSkeleton";
import Model from "../../molecules/Model";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export type TCategory = "beauty" | "fragrances" | "furniture" | "groceries";

export interface IProduct {
    _id: number;
    title: string;
    description: string;
    price: number;
    image: { src: string; altName: string };
    category: string;
    rating: number;
}

export interface IMetaData {
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
    currentPage: number;
}

export const fetchData = async (
    page: number,
    name: string,
    category: string,
    limit: number,
) => {
    const params = new URLSearchParams({
        name,
        page: page.toString(),
        category,
        limit: limit.toString(),
    });

    const response = await fetch(`http://localhost:3000/api/product?${params}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });

    if (!response.ok) {
        const error = new Error(
            "An error occurred while fetching the data.",
        ) as Error & { code: number };
        error.code = response.status;
        throw error;
    }

    const result = await response.json();
    return result.data;
};

function AdminProducts() {
    const [page, setPage] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [debouncedName, setDebouncedName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [limit, setLimit] = useState<number>(10);
    const [showModel, setShowModel] = useState<boolean>(false);
    const [deleteProdct, setDeleteProduct] = useState<string>();
    const navigate=useNavigate();
    const queryClient = useQueryClient();
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(name);
            setPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [name]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["products", page, debouncedName, category, limit, deleteProdct],
        queryFn: () => fetchData(page, debouncedName, category, limit),
        staleTime: 1000 * 60 * 5,
        retry: 6,
    });

    const handleEdit = (productId: number) => {
       navigate(`${productId}`)
    };

    const handleDelete = (productId: string) => {
        setShowModel(true);
        setDeleteProduct(productId);
    };

    const deleteProductRequest = async (productId: string) => {
        const result = await fetch(`http://localhost:3000/api/product/${productId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        if (!result.ok) {
            const errorData = await result.json();
            throw new Error(errorData.message || "Error while deleting product");
        }
        return result.json();
    };

    const { mutate: deleteProduct } = useMutation({
        mutationFn: deleteProductRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setShowModel(false);
            setDeleteProduct('');
            toast.success("Product Deleted Successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    const handleConformDelete = async () => {
        if (deleteProdct) {
            deleteProduct(deleteProdct);
        }
    };
    if (isError) {
        return (
            <div className="text-red-500 text-center py-10">
                Error: {error.message}
            </div>
        );
    }

    return (
        <div className="w-full  p-8 py-10  ">
            <div className="mb-10 flex md:flex-row flex-col gap-4 justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:border-blue-500 outline-none transition-all"
                        placeholder="Search by name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {name && (
                        <Button
                            onClick={() => setName("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500 hover:text-blue-400" />
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="flex flex-row gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                            <Filter className="w-4 h-4" />
                            <span>Category</span>
                        </div>
                        <select
                            name="Category"
                            id="Category"
                            onChange={(e) => {
                                setCategory(e.target.value);
                                setPage(1);
                            }}
                            value={category}
                            className="w-40 border-2 p-2 rounded-md"
                        >
                            <option value="">All Categories</option>
                            <option value="beauty">Beauty</option>
                            <option value="fragrances">Fragrances</option>
                            <option value="furniture">Furniture</option>
                            <option value="groceries">Groceries</option>
                        </select>
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                            <Filter className="w-4 h-4" />
                            <span>Limit</span>
                        </div>
                        <select
                            name="limit"
                            id="limit"
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            value={limit}
                            className="w-40 border-2 p-2 rounded-md"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                    <div>
                        <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600" onClick={()=>{navigate('createProduct')}}>
                            Add Product +
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <>
                    <div className="w-full">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="grid grid-cols-6 gap-4 px-4 py-3 border-t animate-pulse items-center"
                            >
                                <div className="w-14 h-14 bg-gray-200 rounded-lg" />

                                <div className="h-4 bg-gray-200 rounded w-3/4" />

                                <div className="h-4 bg-gray-200 rounded w-1/2" />

                                <div className="h-4 bg-gray-200 rounded w-1/3" />

                                <div className="h-4 bg-gray-200 rounded w-1/4" />

                                <div className="flex gap-2 justify-center">
                                    <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                                    <div className="h-8 w-16 bg-gray-200 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
                        <table className="w-full min-w-[900px] text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                        Image
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                        Title
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700">
                                        Rating
                                    </th>
                                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8">
                                            <PaginationSkeleton />
                                        </td>
                                    </tr>
                                ) : data?.products?.length > 0 ? (
                                    data.products.map((product: IProduct) => (
                                        <tr
                                            key={product._id}
                                            className="border-t hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <img
                                                    src={product.image?.src}
                                                    alt={product.image?.altName || product.title}
                                                    className="w-14 h-14 object-cover rounded-lg border"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                {product.title}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                                                {product.category}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                ₹ {product.price}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {product.rating}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => handleEdit(product._id)}
                                                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() => handleDelete(product._id.toString())}
                                                        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center">
                                            <p className="text-gray-400 text-lg">
                                                No products found matching your criteria.
                                            </p>
                                            <Button
                                                onClick={() => {
                                                    setName("");
                                                    setCategory("");
                                                }}
                                                className="mt-4 !text-blue-600 font-medium hover:underline !bg-white"
                                            >
                                                Clear all filters
                                            </Button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            {showModel && (
                <Model
                    isOpen={true}
                    onClose={() => {
                        setShowModel(false);
                    }}
                    onConfirm={handleConformDelete}
                    title="Delete Product"
                    message="This action is permanent. The product will be removed from the store."
                    confirmText="Delete Now"
                ></Model>
            )}
            {!isLoading &&
                data?.products?.length > 0 &&
                data?.metadata?.totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination
                            {...data.metadata}
                            onPageChange={(newPage) => setPage(newPage)}
                        />
                    </div>
                )}
        </div>
    );
}

export default AdminProducts;
