import { useEffect, useState } from "react";
import { getCurrentUser, refreshAccessToken } from "../api/auth.api";
import { useAppDispatch } from "../hooks/redux";
import { loginSuccess } from "../features/auth/authSlice";

function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const initialize = async () => {
            try {
                const response = await refreshAccessToken();
                
                const accessToken = response.data.accessToken;

                const userResponse = await getCurrentUser(accessToken);

                dispatch(
                    loginSuccess({
                        user: userResponse.data,
                        accessToken,
                    })
                );
            } catch {
                console.log("Not logged in");
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
}

export default AppInitializer;