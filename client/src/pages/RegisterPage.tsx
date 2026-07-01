import { useState } from "react";
import { registerUser } from "../api/auth.api";

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

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
        <main>
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData((data) => ({ ...data, name: e.target.value }))}
                    />

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

export default RegisterPage;