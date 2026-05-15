import { SubmitHandler, useForm } from "react-hook-form";
import InputTextBox from "../../atoms/inputTextBox";
import Button from "../../atoms/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";

type Inputs = {
    name: string;
    email: string;
    password: string;
    confirmpassword: string;
};

function RegisterForm() {
    const [error, setError] = useState();
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<Inputs>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const response = await fetch('http://localhost:3000/api/user/create', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                return;
            }
            navigate('/');
            toast.success('User registered successfully');
        } catch (error) {
            console.error('Registration Error:', error);
        }
    };
    console.log('error', error)
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>

                </div>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}
                    <InputTextBox
                        label="Full Name"
                        type="text"
                        id="Name"
                        placeholder="John Doe"
                        formProps={{ ...register("name", { required: "Name is required" }) }}
                        error={errors.name}
                    />
                    <InputTextBox
                        label="Email Address"
                        type="email"
                        id="email"
                        placeholder="name@company.com"
                        formProps={{
                            ...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" },
                            }),
                        }}
                        error={errors.email}
                    />
                    <InputTextBox
                        label="Password"
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        formProps={{
                            ...register("password", {
                                required: "Password is required",
                                minLength: { value: 6, message: "Minimum 6 characters" },
                            }),
                        }}
                        error={errors.password}
                    />
                    <InputTextBox
                        label="confirm Password "
                        type="password"
                        id="confirm Password"
                        placeholder="••••••••"
                        formProps={{
                            ...register("confirmpassword", {
                                required: "Confirmpassword is required",
                                validate: (val: string) => {
                                    if (watch('password') != val) {
                                        return "Your passwords do no match";
                                    }
                                },
                            }),
                        }}
                        error={errors.confirmpassword}
                    />
                    {/* Login Link */}
                    <div className="text-sm text-center text-slate-600 mt-2">
                        Already have an account?{" "}
                        <span
                            className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors underline-offset-4 hover:underline"
                            onClick={() => navigate('/')}
                        >
                            Log in
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            className="flex-1 bg-white !text-slate-700 hover:bg-slate-50 border border-slate-200 py-2.5 rounded-lg transition-all font-medium"
                            onClick={() => reset()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-600 !text-white hover:bg-blue-700 shadow-md shadow-blue-200 py-2.5 rounded-lg transition-all font-medium border-none"
                        >
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;
