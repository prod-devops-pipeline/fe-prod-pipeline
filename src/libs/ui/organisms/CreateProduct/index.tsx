import { useForm, SubmitHandler } from "react-hook-form";
import InputTextBox from "../../atoms/inputTextBox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../atoms/button";

type ProductForm = {
    title: string;
    price: number;
    description: string;
    category: string;
    rating: number;
    image: {
        src: string;
        altName: string;
    };
};
const  CreateProduct=()=> {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ProductForm>();

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const onSubmit: SubmitHandler<ProductForm> = async (data) => {
        try {
            const result = await fetch('http://localhost:3000/api/product/create', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify([data])
            });

            const response = await result.json();

            if (!result.ok) {
                throw new Error(response.message || "Something went wrong");
            }

            toast.success("Product created successfully 🎉");
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setTimeout(() => {
                navigate("/admin/products");
            }, 1000);

        } catch (error: any) {
            toast.error(error.message || "Failed to create product");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={24} />
                    </Button>

                    <h2 className="text-2xl font-bold text-gray-800">
                        Add Product
                    </h2>

                    <div className="w-10"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Title */}
                    <InputTextBox
                        id="title"
                        type="text"
                        disabled={isSubmitting}
                        label="Title"
                        formProps={{
                            ...register("title", { required: "Title is required" })
                        }}
                        error={errors.title}
                    />

                    {/* Price */}
                    <InputTextBox
                        id="price"
                        type="number"
                        disabled={isSubmitting}
                        label="Price"
                        formProps={{
                            ...register("price", {
                                required: "Price is required",
                                valueAsNumber: true
                            })
                        }}
                        error={errors.price}
                    />

                    {/* Category */}
                    <div className=' align-middle'>
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                {...register("category", { required: "Category is required" })}
                                className='border-2 border-slate-300 rounded-lg h-11 w-full'
                            >
                                <option value="">Select a category</option>
                                <option value="beauty">Beauty</option>
                                <option value="fragrances">Fragrances</option>
                                <option value="furniture">Furniture</option>
                                <option value="groceries">Groceries</option>

                            </select>
                            <span className='text-red-500 text-xs font-medium text-start'>
                                {errors.category?.message}
                            </span>
                        </div>
                
                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            disabled={isSubmitting}
                            {...register("description", {
                                required: "Description is required"
                            })}
                            className="w-full rounded-lg border border-gray-300 p-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    {/* Image URL */}
                    <InputTextBox
                        id="image-src"
                        type="text"
                        disabled={isSubmitting}
                        label="Image URL"
                        formProps={{
                            ...register("image.src", {
                                required: "Image URL is required"
                            })
                        }}
                        error={errors.image?.src}
                    />

                

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Creating..." : "Add Product"}
                    </button>
                </form>
            </div>
        </div>
    );
}
export default CreateProduct;