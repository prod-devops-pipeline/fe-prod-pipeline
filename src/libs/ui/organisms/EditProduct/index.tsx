import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InputTextBox from "../../atoms/inputTextBox";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import Button from "../../atoms/button";

type ProductForm = {
  title: string;
  price: number;
  description: string;
  category: string;
  _id: string;
};

export const fetchData = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/product/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("Error fetching product") as Error & {
      code: number;
    };
    error.code = response.status;
    throw error;
  }

  return response.json();
};

function EditProduct() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductForm>();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchData(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    if (product?.Product) {
      const { title, price, description, category } = product.Product;

      reset({
        title,
        price,
        description,
        category,
      });
    }
  }, [product, reset]);

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (data: ProductForm) => {
      const response = await fetch(`http://localhost:3000/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
      toast.success("Product updated successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
      console.error("Update failed:", error);
    },
  });

  const onSubmit = (data: ProductForm) => {
    updateProduct(data);
  };

  if (isLoading)
    return <div className="p-10 text-center">Loading Product...</div>;
  if (isError)
    return (
      <div className="p-10 text-red-500 text-center">
        Error loading product.
      </div>
    );
  if (isPending)
    return <div className="p-10 text-center">Loading Product...</div>;
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="flex items-center justify-between mb-8">
        <Button
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft size={24} />
        </Button>

        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>

        {/* Empty div to balance the Flexbox so title stays centered */}
        <div className="w-10"></div>
      </div>

      <div className="grid grid-cols-1  gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-2 space-y-4"
        >
          <InputTextBox
            label="Product Title"
            id="title"
            type="text"
            disabled={isSubmitting}
            formProps={{
              ...register("title", { required: "Title is required" }),
            }}
            error={errors.title}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputTextBox
              label="Price ($)"
              id="price"
              type="text"
              disabled={isSubmitting}
              formProps={{
                ...register("price", {
                  required: "Price is required",

                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?)$/,
                    message: "Price must be a valid positive number",
                  },

                  validate: (value) => value > 0 || "Price cannot be zero",
                }),
              }}
              error={errors.price}
            />

            <div className=" align-middle">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className="border-2 border-slate-300 rounded-lg h-11 w-full"
              >
                <option value="">Select a category</option>
                <option value="beauty">Beauty</option>
                <option value="fragrances">Fragrances</option>
                <option value="furniture">Furniture</option>
                <option value="groceries">Groceries</option>
              </select>
              <span className="text-red-500 text-xs font-medium text-start">
                {errors.category?.message}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            />
            <span>{errors.description?.message}</span>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;
