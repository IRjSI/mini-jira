import { useState } from "react";
import { Link } from "react-router-dom";
import {
    createOrganization,
    getOrganizationsByOwner
} from "../api/organization.api";
import type { Organization } from "../features/organization/organizationTypes";
import {
    PlusIcon,
    XIcon,
    UserIcon,
    ArrowUpRightIcon
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function OrganizationsPage() {
    const queryClient = useQueryClient();

    const [createOrgOpen, setCreateOrgOpen] = useState(false);
    const [newOrgData, setNewOrgData] = useState({ name: "", description: "" });

    const { data: organizations, isLoading } = useQuery<Organization[]>({
        queryKey: ["organizations"],
        queryFn: async () => {
            const data = await getOrganizationsByOwner();
            return Array.isArray(data) ? data : data.organizations ?? [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const safeOrgs = organizations ?? [];

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newOrgData.name.trim()) return;
        try {
            await createOrganization(newOrgData);
            setNewOrgData({ name: "", description: "" });
            setCreateOrgOpen(false);
            queryClient.invalidateQueries({ queryKey: ["organizations"] });
        } catch (error) {
            console.error("Failed to create organization:", error);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 text-slate-900">
            <header className="border-b border-slate-300 pb-5">
                <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Organizations" }]} />

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Corporate workspaces</p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Organizations</h1>
                        <p className="mt-2 text-sm text-slate-600">Select an organization to manage projects, design workspaces, and collaborate.</p>
                    </div>
                    <button
                        onClick={() => setCreateOrgOpen(true)}
                        className="w-fit self-start border border-slate-900 bg-slate-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                        <PlusIcon size={14} />
                        Create Organization
                    </button>
                </div>
            </header>

            {createOrgOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                    <div className="w-full max-w-xl border border-slate-300 bg-white p-5 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-org-title">
                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">New space</p>
                                <h2 id="create-org-title" className="text-xl font-semibold tracking-tight text-slate-900">New Organization</h2>
                            </div>
                            <button
                                type="button"
                                className="border border-slate-300 p-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                onClick={() => setCreateOrgOpen(false)}
                                aria-label="Close"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                        <form className="flex flex-col gap-4" onSubmit={handleCreateOrg}>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Organization name</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter name"
                                    required
                                    autoFocus
                                    value={newOrgData.name}
                                    onChange={(e) => setNewOrgData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Description</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter description"
                                    value={newOrgData.description}
                                    onChange={(e) => setNewOrgData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </label>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    className="w-fit border border-slate-900 bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 cursor-pointer"
                                    type="submit"
                                >
                                    Create Organization
                                </button>
                                <button
                                    className="border border-slate-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900 cursor-pointer"
                                    type="button"
                                    onClick={() => setCreateOrgOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="py-12 text-center text-sm text-slate-500 font-medium">Fetching organizations...</div>
            ) : safeOrgs.length === 0 ? (
                <div className="border border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                    <p className="text-base font-medium">No organizations listed yet.</p>
                    <p className="mt-1 text-sm text-slate-500">Create your first organization to get started.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {safeOrgs.map((org) => (
                        <div
                            className="border border-slate-300 bg-white p-5 flex flex-col justify-between gap-4 transition duration-200 hover:shadow-md hover:border-slate-500"
                            key={org._id}
                        >
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">{org.name}</h2>
                                <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{org.description || "No description provided."}</p>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                                    <UserIcon size={12} />
                                    Owner Space
                                </span>
                                <Link
                                    to={`/organization/${org._id}`}
                                    className="border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                                >
                                    Select
                                    <ArrowUpRightIcon size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default OrganizationsPage;