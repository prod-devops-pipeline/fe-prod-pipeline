import React from "react";
import Button from "../button";
import { IProduct } from "../../organisms/Products";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Cart: React.FC<IProduct> = ({
    _id,
    title,
    description,
    image,
    price,
    category,
    rating,
}) => {
    const { isLogin } = useAuth();
    const navigate = useNavigate();

    const handleProductClick=(id:number)=>{
        // navigate(`/product/${id}`)
    }

    return (
        <>
            <div>
                <div className=" group border-2 p-3 drop-shadow-lg rounded-xl  bg-white">
                    <div className="flex justify-between items-center mb-3">
                        <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
                            {category}
                        </span>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-700">
                                {rating || "4.5"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <img
                            src={image?.src}
                            alt={image.altName}
                            className="transition delay-150 ease-in-out hover:-translate-y-1 group-hover:scale-105 h-[270px]"
                        />
                    </div>
                    <div className="" onClick={()=>{handleProductClick(_id)}}>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-4">
                            {description}
                        </p>
                  
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 font-medium">
                                    Price
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                    ${price}
                                </span>
                            </div>
                            {isLogin && (
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-md hover:shadow-blue-200">
                                    Add To Cart
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
