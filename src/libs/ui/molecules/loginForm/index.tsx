import { SubmitHandler, useForm } from "react-hook-form";
import InputTextBox from "../../atoms/inputTextBox";
import Button from "../../atoms/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

type Inputs = {
    email: string;
    password: string;
};

function LoginForm() {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassowrd] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<Inputs>();

    const navigate = useNavigate();

    const auth = useAuth();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
       
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message);
                return;
            }
            const user = await response.json();
            auth.login(user.data.user.role);
            localStorage.setItem('name', user.data.user.name)
            navigate('/');
            toast.success("Logged in successfully!", {
                position: "top-right",
            });

        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error('Login Error:', err);
        }
    };
    const togglePassword = () => {
        setShowPassowrd((prev) => !prev);
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8">


                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2 text-sm">Please enter your credentials to log in.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                            <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <InputTextBox
                        label="Email Address"
                        type="email"
                        id="email"
                        placeholder="name@company.com"
                        formProps={{
                            ...register("email", {
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                            })
                        }}
                        error={errors.email}
                        disabled={isSubmitting}
                    />
                    <div className="relative">

                        <InputTextBox
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="••••••••"
                            formProps={{
                                ...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })
                            }}
                            inputClass="relative"
                            error={errors.password}
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute top-9 right-3"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-600">
                            New here?{" "}
                            <span
                                className="text-blue-600 font-semibold hover:text-blue-700 cursor-pointer transition-colors underline-offset-4 hover:underline"
                                onClick={() => navigate('/register')}
                            >
                                Create account
                            </span>
                        </div>


                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 !text-white hover:bg-blue-700 shadow-md shadow-blue-200 py-3 rounded-xl transition-all font-bold text-lg border-none mt-2"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
