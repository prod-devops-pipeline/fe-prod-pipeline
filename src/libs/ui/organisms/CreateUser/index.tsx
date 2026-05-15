import { useForm, SubmitHandler } from "react-hook-form";
import InputTextBox from "../../atoms/inputTextBox";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../atoms/button";

type UserForm = {
    name: string;
    email: string;
    password: string;
    role: string;
};

export default function CreateUser() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<UserForm>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();


  const onSubmit: SubmitHandler<UserForm> = async (data) => {
    try {
        const result = await fetch('http://localhost:3000/api/user/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(data)
        });

        const response = await result.json();

        if (!result.ok) {
            throw new Error(response.message || "Something went wrong");
        }

        // ✅ Success
        toast.success("User created successfully 🎉");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        // navigate after slight delay
        setTimeout(() => {
            navigate("/admin/users");
        }, 1000);

    } catch (error: any) {
        // ❌ Error
        toast.error(error.message || "Failed to create user");

        // ❗ stay on same page so user can fix input
    }
};


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 relative">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                    <Button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                        onClick={() => { navigate(-1) }}
                    >
                        <ArrowLeft size={24} />
                    </Button>

                    <h2 className="text-2xl font-bold text-gray-800">Add User</h2>

                    {/* Empty div to balance the Flexbox so title stays centered */}
                    <div className="w-10"></div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <InputTextBox id="name" type="text" disabled={isSubmitting} label="Name" formProps={{ ...register('name', { required: "Name is required" }) }} error={errors.name}></InputTextBox>

                    {/* Email Field */}
                    <div>
                        <InputTextBox id="email" type="text" disabled={isSubmitting} label="email" formProps={{ ...register('email', { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } }) }} error={errors.email}></InputTextBox>


                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">User Role</label>
                        <select
                            {...register('role', { required: "Please select a role" })}
                            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select a role...</option>
                            <option value="user">User</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <InputTextBox id="password" type="password" disabled={isSubmitting} label="password" formProps={{ ...register('password', { required: "password is required", minLength: { value: 6, message: "Minimum 6 characters" } }) }} error={errors.password}></InputTextBox>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isSubmitting ? "Creating..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}
