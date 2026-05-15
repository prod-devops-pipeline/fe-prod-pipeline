import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">        
            <h1 className=" text-9xl font-black text-gray-200 sm:text-[12rem]">
                404
            </h1>       
            <div className="">         
                <p className="mx-auto mb-8 max-w-md text-lg text-gray-600">
                    The page you're looking for doesn't exist .
                    Let's get you back on track.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Return to Homepage
                </button>
            </div>
        </div>
    );
};

export default React.memo(NotFound);
