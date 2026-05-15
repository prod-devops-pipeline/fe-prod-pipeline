const ProductCardSkeleton = () => {
    return (
        <div className="border-2 p-3 drop-shadow-lg rounded-xl bg-white animate-pulse">
            {/* Category & Rating Row */}
            <div className="flex justify-between items-center mb-3">
                <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-5 w-12 bg-gray-100 rounded-full"></div>
            </div>

            {/* Image Placeholder */}
            <div className="w-full h-[270px] bg-gray-200 rounded-lg mb-4"></div>

            {/* Content Area */}
            <div className="space-y-3">
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>

                {/* Description */}
                <div className="h-4 bg-gray-100 rounded w-full"></div>

                {/* Footer Area */}
                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="h-3 bg-gray-100 rounded w-8"></div>
                        <div className="h-7 bg-gray-200 rounded w-16"></div>
                    </div>

                    {/* Button Placeholder (assuming isLogin) */}
                    <div className="h-10 w-24 bg-gray-200 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
};
export default ProductCardSkeleton;