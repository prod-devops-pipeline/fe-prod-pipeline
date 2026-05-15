import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProductDetails from "../libs/ui/organisms/ProductDetails";
import TestPage3 from "../libs/ui/organisms/TestPage3";

// Lazy loaded components
const LoginForm = lazy(() => import("../libs/ui/molecules/loginForm"));
const RegisterForm = lazy(() => import("../libs/ui/molecules/registerForm"));
const MainModule = lazy(() => import("../modules/mainModules"));
const TestPage = lazy(() => import("../libs/ui/organisms/TestPage"));
const NotFound = lazy(() => import("../libs/ui/templates/notFound"));
const TestPage2 = lazy(() => import("../libs/ui/organisms/TestPage2"));
const AdminModule = lazy(() => import("../modules/AdminModule"));
const AdminDashboard = lazy(() => import("../libs/ui/templates/AdminDashboard"));
const ProtectedRoute = lazy(() => import("../libs/ui/organisms/ProtectedRoute"));
const AdminProducts = lazy(() => import("../libs/ui/organisms/AdminProducts"));
const UserList = lazy(() => import("../libs/ui/organisms/UserList"));
const UserLogs = lazy(() => import("../libs/ui/molecules/UserLogs"));
const EditProduct = lazy(() => import("../libs/ui/organisms/EditProduct"));
const EditUser = lazy(() => import("../libs/ui/organisms/EditUser"));
const CreateUser = lazy(() => import("../libs/ui/organisms/CreateUser"));
const CreateProduct = lazy(() => import("../libs/ui/organisms/CreateProduct"));

const Products = lazy(() => import('../libs/ui/organisms/Products'));

export const AppRoute = () => {
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <ToastContainer position="top-right" autoClose={1000} />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/test" element={<TestPage />} />
                    <Route path="/test2" element={<TestPage2 />} />
                    <Route path="/test3" element={<TestPage3/>} />
                    {/* <Route element={<ProtectedRoute />} > */}
                    <Route element={<MainModule />}>
                        <Route path="/" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetails />} />

                    </Route>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminModule />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="products" element={<AdminProducts />} />
                            <Route path="products/:id" element={<EditProduct />} />
                            <Route path="users" element={<UserList />} />
                            <Route path="users/:id" element={<EditUser />} />
                            <Route path="users/createUser" element={<CreateUser />} />
                            <Route path="products/createProduct" element={<CreateProduct />} />
                            <Route path="logs" element={<UserLogs />} />
                        </Route>
                    </Route>
                    <Route path="" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                    <Route element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    )
}