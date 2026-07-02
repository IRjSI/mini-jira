import { useEffect, useState } from "react";
import { registerUser } from "../api/auth.api";
import { useAppSelector } from "../hooks/redux";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        await registerUser(formData);

        setFormData({
            name: "",
            email: "",
            password: ""
        });
    };

    return (
        <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center px-2 py-6 sm:px-4">
            <section className="w-full max-w-md border border-slate-300 bg-white p-6 sm:p-8">
                <div className="mb-6 border-b border-slate-200 pb-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Create</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create an account</h1>
                    <p className="mt-2 text-sm text-slate-600">Start organizing your projects with a polished workspace.</p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                        <span>Name</span>
                        <input
                            className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData((data) => ({ ...data, name: e.target.value }))}
                        />
                    </label>

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
                            placeholder="Choose a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
                        />
                    </label>

                    <button className="border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900" type="submit">
                        Register
                    </button>
                </form>
            </section>
        </main>
    );
}

export default RegisterPage;