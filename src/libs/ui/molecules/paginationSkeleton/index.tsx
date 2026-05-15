const PaginationSkeleton: React.FC = () => {
    return (
        <div className="p-2 mt-12 flex md:flex-row flex-col justify-between items-center animate-pulse">
           
            <div className="h-5 w-24 bg-slate-200 rounded mb-5 md:mb-0"></div>
            <div className="flex items-center gap-5">
                <div className="w-[45px] h-12 bg-slate-200 rounded-lg"></div>
                <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="w-10 h-10 bg-slate-200 rounded-lg"
                        ></div>
                    ))}
                </div>
                <div className="w-[45px] h-12 bg-slate-200 rounded-lg"></div>
            </div>
        </div>
    )
}
export default PaginationSkeleton
