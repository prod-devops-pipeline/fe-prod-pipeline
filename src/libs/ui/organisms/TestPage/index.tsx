import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface product {
  id: number;
  title: string;
  images: string[];
}

function TestPage() {
  // const [products, setProducts] = useState<product[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [isFetchingMore, setIsFetchingMore] = useState(false);
  // const [limit, setLimit] = useState(12);
  // const [page, setPage] = useState(1);
  // const navigate = useNavigate();
  const [data, setData] = useState();
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const result = await fetch(
  //         `https://dummyjson.com/products?limit=${limit}&skip=${page * limit}`,
  //         {
  //           method: "GET",
  //         },
  //       );
  //       const data = await result.json();

  //       if (data) {
  //         setTimeout(() => {
  //           setProducts((prev) => [...prev, ...data.products]);
  //           setIsLoading(false);
  //         }, 1000);

  //       }
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //     finally {
  //       setIsLoading(false);
  //       setIsFetchingMore(false);
  //     }
  //   }
  //   fetchData();
  // }, [page]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const isAtBottom =
  //       window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;

  //     if (isAtBottom && !isFetchingMore) {
  //       setIsFetchingMore(true);
  //       setPage((prev) => prev + 1);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [isFetchingMore]);

  // if (isLoading) {
  //   return <>isLoading......</>;
  // }
  // const handelLoadMore = () => {
  //   setPage((prev) => prev + 1)
  // }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/test', {
          method: 'GET',
          credentials: "include",
        });
        const data = await res.json();
        setData(data.message);
        console.log(data);
      } catch (err) {
        console.error("CORS Error:", err);
      }
    };

    fetchData();
  }, []);
  return (
    <>

      {data}
      {/* <button onClick={() => { navigate('/test2', { state: { name: 'nishant' } }) }}>Click here </button> */}

      {/* <div className="flex flex-row">
       
        <div>
          <div className="max-w-6xl  ml-10">
            <div className="grid grid-cols-3 gap-8 mt-12 ">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="shadow-lg rounded-2xl group h-[470px]"
                >
                  <div className="relative group/image overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="group-hover:scale-105 transition-all duration-300 ease-in-out rounded-lg"
                    />

                    <div className="absolute inset-0 bg-black/40 hidden group-hover/image:flex items-center justify-center transition-all rounded-t-lg">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium">
                        Quick view
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="font-bold">{product.title}</div>

                    <button className="w-full border-2 p-2 mt-4 border-blue-500 font-bold text-blue-500 group-hover:bg-black group-hover:text-white group-hover:underline  group-hover:border-black">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>


            {isFetchingMore ? (
              <div className="py-10 text-center font-bold text-blue-500 animate-pulse">
                Loading more amazing products...
              </div>
            ) : (<button className=" p-3 text-blue-600 hover:underline" onClick={handelLoadMore}>Load More</button>)}
          </div>




        </div>
      </div> */}


    </>
  );
}

export default React.memo(TestPage);
