import { useEffect } from "react";
import { useAppSelector } from "../hooks/redux";
import { getCurrentUser } from "../api/auth.api";

function DashboardPage() {
    const auth = useAppSelector((state) => state.auth);

    useEffect(() => {
        getCurrentUser(auth.accessToken!)
            .then(console.log)
            .catch(console.error);
    }, []);

    return (
        <pre>
            {JSON.stringify(auth, null, 2)}
        </pre>
    );
};

export default DashboardPage;