import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getOrganizationById } from "../api/organization.api";
import type { Organization } from "../features/organization/organizationTypes";
import { ArrowUpRightIcon } from "lucide-react";

function OrganizationPage() {
    const [organization, setOrganization] = useState<Organization>();
    const [searchParams] = useSearchParams();
    const organizationId = searchParams.get("organizationId") ?? "";

    useEffect(() => {
        const getOrganization = async () => {
            const response = await getOrganizationById(organizationId);

            setOrganization(response.data);
        };

        getOrganization();
    }, []);

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 py-1 text-slate-900 sm:px-2 sm:py-2">
            <header className="border-b border-slate-300 pb-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Workspace</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Organization</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Choose an Project to explore its tasks.</p>
            </header>

            <div className="flex flex-col gap-3">
                <article className="border border-slate-300 bg-white p-4 sm:p-5" key={organization?._id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">{organization?.name}</h2>
                            <p className="mt-1 text-sm text-slate-600">{organization?.description}</p>
                            <p className="mt-2 text-sm text-slate-500">Owner: {organization?.owner}</p>
                        </div>
                        <Link
                            className="border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center"
                            to={`/projects?organizationId=${organization?._id}`}
                        >
                            View Projects
                            <ArrowUpRightIcon size={14} />
                        </Link>
                    </div>
                </article>
            </div>
        </main>
    );
}

export default OrganizationPage;