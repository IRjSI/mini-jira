import { useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

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
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center px-2 py-6 sm:px-4">
            <section className="w-full max-w-md border border-slate-300 bg-white p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Access</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-sm text-slate-600">Sign in to continue managing your work.</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                        <span>Email</span>
                        <input
                            className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData((data) => ({ ...data, email: e.target.value }))}
                        />
                    </label>

                    <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                        <span>Password</span>
                        <input
                            className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
                        />
                    </label>

                    <button className="border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900" type="submit">
                        Sign in
                    </button>
                </form>
            </section>
        </main>
    );
}

export default LoginPage;