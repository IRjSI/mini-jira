import { useEffect, useState } from "react";
import { registerUser } from "../api/auth.api";
import { useAppSelector } from "../hooks/redux";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            await registerUser(formData);
            setFormData({ name: "", email: "", password: "" });
            navigate("/login");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to register.";
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
                        <p className="auth-form-eyebrow">Get started</p>
                        <h1 className="auth-form-title">Create your account</h1>
                        <p className="auth-form-subtitle">Start organizing your projects with a clean workspace.</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <p>{error}</p>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={onSubmit}>
                        <label className="auth-field">
                            <span className="auth-label">Full name</span>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Alex Johnson"
                                value={formData.name}
                                onChange={(e) => setFormData(d => ({ ...d, name: e.target.value }))}
                                disabled={isLoading}
                            />
                        </label>

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
                                placeholder="Choose a strong password"
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
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login" className="auth-switch-link">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;