import { useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginSuccess } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await loginUser(formData);

            dispatch(loginSuccess({
                user: response.data.user,
                accessToken: response.data.accessToken
            }));

            setFormData({
                email: "",
                password: ""
            });

            navigate("/dashboard");
        } catch (err: any) {
            console.error("Login error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to sign in. Please check your credentials.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center px-2 py-6 sm:px-4">
            <section className="w-full max-w-md border border-slate-300 bg-white p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Access</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-600">Sign in to continue managing your work.</p>
                </div>

                {error && (
                    <div className="mb-4 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <p>{error}</p>
                    </div>
                )}

                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                        <span>Email</span>
                        <input
                            className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900 disabled:opacity-50"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData((data) => ({ ...data, email: e.target.value }))}
                            disabled={isLoading}
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                        <span>Password</span>
                        <input
                            className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900 disabled:opacity-50"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
                            disabled={isLoading}
                        />
                    </label>

                    <button
                        className="border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="mt-6">
                    <Link
                        to="/register"
                        className="text-sm text-slate-700 hover:text-slate-900 transition"
                    >
                        Don't have an account? Register
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default LoginPage;