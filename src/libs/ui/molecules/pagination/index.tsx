import React from "react";
import Button from "../../atoms/button";

interface PaginationProps {
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange
}) => {
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

        pages.push(1);
        if (currentPage > 3) pages.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push('...');
        if (!pages.includes(totalPages)) pages.push(totalPages);

        return pages;
    };

    const pages = getVisiblePages();

    return (
        <div className="p-2 mt-12 flex md:flex-row flex-col justify-between items-center">
            <div className="flex align-middle   text-sm font-medium text-gray-500 mb-5 md:mb-0 ">
                Page <span className="text-gray-900 mx-1">{currentPage}</span> of {totalPages}
            </div>
            <div>
                <div className="flex items-center gap-5 shadow-sm ">
                    <Button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="p-2 min-w-[45px] h-12 flex items-center justify-center rounded-lg  disabled:opacity-50  transition-all border-none shadow-none text-white "
                    >
                        {'<'}
                    </Button>


                    <div className="flex items-center gap-3">
                        {pages.map((page, index) => (
                            <div key={index}>
                                {page === "..." ? (
                                    <span className="w-10 text-center text-gray-400 font-bold">···</span>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => onPageChange(page as number)}
                                        className={`
                                        w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold transition-all border-none shadow-none
                                        ${page === currentPage
                                                ? "bg-blue-800 text-white shadow-md shadow-blue-200 "
                                                : " text-white"}
                                    `}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="p-2 min-w-[45px] h-12 flex items-center justify-center rounded-lgdisabled:opacity-50  transition-all border-none shadow-none text-white"
                    >
                        {'>'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
