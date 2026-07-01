import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizationsByOwner } from "../api/organization.api";
import type { Organization } from "../features/organization/organizationTypes";

function OrganizationPage() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getOrganizations = async () => {
            const response = await getOrganizationsByOwner();

            setOrganizations(response.data);
        };

        getOrganizations();
    }, []);

    const handleSelectOrganization = (orgId: string) => {
        navigate(`/projects?organizationId=${orgId}`);
    };

    if (organizations.length === 0) {
        return (
            <main>
                <h2>No organizations found</h2>
            </main>
        );
    }

    return (
        <main>
            {organizations.map((org) => (
                <div key={org._id}>
                    <h2>{org.name}</h2>
                    <p>{org.description}</p>
                    <p>{org.owner}</p>
                    <button type="button" onClick={() => handleSelectOrganization(org._id)}>
                        View Projects
                    </button>
                </div>
            ))}
        </main>
    );
};

export default OrganizationPage;