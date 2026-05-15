import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import InputTextBox from "../../atoms/inputTextBox";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import Button from "../../atoms/button";

type ProductForm = {
  name: string;
  email: number;
  role: string;
};

export const fetchData = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/User/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error("Error fetching user") as Error & {
      code: number;
    };
    error.code = response.status;
    throw error;
  }

  return response.json();
};

function EditUser() {
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
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchData(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  useEffect(() => {
    if (user?.user) {
      const { name, email, role } = user.user;

      reset({
        name,
        email,
        role,
      });
    }
  }, [user, reset]);

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (data: ProductForm) => {
      const response = await fetch(`http://localhost:3000/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/admin/users");
      toast.success("user updated successfully!");
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
          <Button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"

          onClick={()=>{navigate(-1)}} 
          >
            <ArrowLeft size={24} />
          </Button>
          
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
          
          {/* Empty div to balance the Flexbox so title stays centered */}
          <div className="w-10"></div> 
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:col-span-2 space-y-4"
        >
          <InputTextBox
            label="Name"
            id="name"
            type="text"
            disabled={isSubmitting}
            formProps={{
              ...register("name", { required: "name is required" }),
            }}
            error={errors.name}
          />

          <div className="grid grid-cols-2 gap-4">
            <InputTextBox
              label="Email"
              id="email"
              type="text"
              disabled={true}
              formProps={{
                ...register("email", {
                  required: "email is required",
                }),
              }}
              error={errors.email}
            />

            <div className=" align-middle">
              <label htmlFor="role">Category</label>
              <select
                id="role"
                {...register("role", { required: "role is required" })}
                className="border-2 border-slate-300 rounded-lg h-11 w-full"
              >
                <option value="">Select a role</option>
                <option value="user">user</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
              <span className="text-red-500 text-xs font-medium text-start">
                {errors.role?.message}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Saving..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
