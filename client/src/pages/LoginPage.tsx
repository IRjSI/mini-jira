import { useEffect, useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { loginSuccess } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) navigate("/dashboard");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await loginUser(formData);
            dispatch(loginSuccess({ user: response.data.user, accessToken: response.data.accessToken }));
            setFormData({ email: "", password: "" });
            navigate("/dashboard");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to sign in.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-layout">
            {/* LEFT PANEL */}
            <div className="auth-panel-left">
                <div className="auth-panel-left-inner">
                    <img
                        src="/auth-bg.png"
                        alt=""
                        aria-hidden="true"
                        className="auth-bg-img"
                    />
                    <div className="auth-panel-overlay" />
                    <div className="auth-panel-content">
                        <div className="auth-brand">
                            <span className="auth-brand-dot" />
                            <span className="auth-brand-name">Collaborative Project Manager</span>
                        </div>
                        <div className="auth-tagline">
                            <p className="auth-tagline-quote">"The best teams move together."</p>
                        </div>
                        <div className="auth-panel-features">
                            {["Kanban boards", "Team collaboration", "Organized workspaces"].map(f => (
                                <div key={f} className="auth-feature-item">
                                    <span className="auth-feature-check">✓</span>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="auth-panel-right">
                <div className="auth-form-container">
                    <div className="auth-form-header">
                        <p className="auth-form-eyebrow">Welcome back</p>
                        <h1 className="auth-form-title">Sign in to continue</h1>
                        <p className="auth-form-subtitle">Resume where you left off with your team.</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={onSubmit}>
                        <label className="auth-field">
                            <span className="auth-label">Email address</span>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                                disabled={isLoading}
                            />
                        </label>

                        <label className="auth-field">
                            <span className="auth-label">Password</span>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Your password"
                                value={formData.password}
                                onChange={(e) => setFormData(d => ({ ...d, password: e.target.value }))}
                                disabled={isLoading}
                            />
                        </label>

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register" className="auth-switch-link">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;