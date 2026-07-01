import { useState } from "react";
import { loginUser } from "../api/auth.api";
import { useAppDispatch } from "../hooks/redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    
    const onSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        
        const response = await loginUser(formData);
        
        dispatch(loginSuccess({
            user: response.data.user,
            accessToken: response.data.accessToken
        }))
        
        setFormData({
            email: "",
            password: ""
        });
        
        navigate("/dashboard");
    };

    return (
        <main>
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData((data) => ({ ...data, email: e.target.value }))}
                    />
                    
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData((data) => ({ ...data, password: e.target.value }))}
                    />

                    <button
                        type="submit"
                    >
                        Register
                    </button>
                </form>
            </div>
        </main>
    )
};

export default LoginPage;