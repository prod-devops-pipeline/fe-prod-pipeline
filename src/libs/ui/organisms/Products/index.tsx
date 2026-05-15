import { useEffect, useState } from "react";
import Cart from "../../atoms/cart";
import Pagination from "../../molecules/pagination";
import { useQuery } from "@tanstack/react-query";
import { Filter, Search, X } from "lucide-react";
import Button from "../../atoms/button";
import ProductCardSkeleton from "../../molecules/ProductCardSkeleton";
import PaginationSkeleton from "../../molecules/paginationSkeleton";
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
      
        const error = new Error('An error occurred while fetching the data.') as Error & { code: number };
        error.code = response.status;
        throw error;
    };

    const result = await response.json();
    return result.data;
};

function Products() {
    const [page, setPage] = useState<number>(1);
    const [name, setName] = useState<string>("");
    const [debouncedName, setDebouncedName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [limit, setLimit] = useState<number>(10);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedName(name);
            setPage(1);
        }, 1000);
        return () => clearTimeout(handler);
    }, [name]);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["products", page, debouncedName, category, limit],
        queryFn: () => fetchData(page, debouncedName, category, limit),
        staleTime: 1000 * 60 * 5,
        retry: 2
    });

    if (isError)
        return (
            <div className="text-red-500 text-center py-10">
                Error: {error.message}
            </div>
        );


    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            
                <div className="relative w-full lg:max-w-md group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                    <input
                        type="text"
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        placeholder="Search by name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {name && (
                        <Button
                            onClick={() => setName("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-gray-500" />
                        </Button>
                    )}
                </div>

                {/* Filters Container */}
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {/* Category Filter */}
                    <div className="flex flex-1 sm:flex-none items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2.5 rounded-lg whitespace-nowrap">
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
                            className="w-full sm:w-44 bg-white border border-gray-200 p-2.5 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            <option value="beauty">Beauty</option>
                            <option value="fragrances">Fragrances</option>
                            <option value="furniture">Furniture</option>
                            <option value="groceries">Groceries</option>
                        </select>
                    </div>

                    {/* Limit Filter */}
                    <div className="flex flex-1 sm:flex-none items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 px-3 py-2.5 rounded-lg whitespace-nowrap">
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
                            className="w-full sm:w-24 bg-white border border-gray-200 p-2.5 rounded-lg text-sm focus:border-blue-500 outline-none cursor-pointer"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="50">50</option>
                        </select>
                    </div>
                </div>
            </div>


            <div className="grid md:grid-cols-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    <>
                        {[...Array(limit)].map((_, i) => (
                            <div key={`${i + 1}`}>
                                <ProductCardSkeleton />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {data?.products?.map((product: IProduct) => (
                            <Cart key={product._id} {...product} />
                        ))}
                    </>
                )}
            </div>

            {data?.products.length == 0 && (
                <div className="flex flex-col align-middle items-center">
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
                </div>
            )}
            {isLoading ? (
                <>
                    <PaginationSkeleton></PaginationSkeleton>
                </>
            ) : (
                <div>
                    {data?.products.length > 0 &&
                        data.metadata.totalPages > 1 &&
                        data?.metadata && (
                            <Pagination
                                {...data.metadata}
                                onPageChange={(newPage) => setPage(newPage)}
                            />
                        )}
                </div>
            )}
        </div>
    );
}

export default Products;
