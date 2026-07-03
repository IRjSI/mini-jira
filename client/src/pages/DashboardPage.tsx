import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createOrganization, getOrganizationsByOwner, type CreateOrganizationRequest } from "../api/organization.api";
import type { Organization } from "../features/organization/organizationTypes";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon, XIcon } from "lucide-react";
import { logoutUser } from "../api/auth.api";
import { logout } from "../features/auth/authSlice";

function DashboardPage() {
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [formData, setFormData] = useState<CreateOrganizationRequest>({ name: "", description: "" });
    const [modalOpen, setModalOpen] = useState(false);

    const getOrganizations = async () => {
        const orgs = await getOrganizationsByOwner(5, 0);

        setOrgs(orgs.data);
    }

    useEffect(() => {
        getOrganizations();
    }, [auth.accessToken]);

    const openModel = (open: boolean) => {
        setModalOpen(open);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();

            dispatch(logout())
        } catch (error) {

        }
    }

    const handleSubmit = async (event: React.SubmitEvent) => {
        event.preventDefault();

        if (!formData.name) {
            return;
        }

        await createOrganization({
            name: formData.name,
            description: formData.description
        });

        setFormData({ name: "", description: "" });
        setModalOpen(false);

        await getOrganizations();
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 py-1 text-slate-900 sm:px-2 sm:py-2">
            <header className="border-b border-slate-300 pb-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Workspace overview</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <span className="border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                            {auth.user?.name ?? "Signed in"}
                        </span>
                        <button
                            className="border border-red-300 bg-red-600/20 px-3 py-2 text-sm text-red-600 cursor-pointer"
                            onClick={handleLogout}
                        >
                            {auth.isAuthenticated ? "Logout" : "Login"}
                        </button>
                    </div>
                </div>
            </header>

            {modalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                    <div className="w-full max-w-xl border border-slate-300 bg-white p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]" role="dialog" aria-modal="true" aria-label="Create organization" aria-labelledby="create-organization-title">
                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Create organization</p>
                                <h2 id="create-organization-title" className="text-xl font-semibold tracking-tight text-slate-900">New organization</h2>
                            </div>
                            <button
                                type="button"
                                className="border border-slate-300 p-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900 group"
                                onClick={() => openModel(false)}
                                aria-label="Close"
                            >
                                <XIcon size={16} className="group-hover:rotate-6" />
                            </button>
                        </div>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Organization name</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Organization name"
                                    value={formData.name}
                                    onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Description</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Description"
                                    value={formData.description}
                                    onChange={(event) => setFormData((current) => ({ ...current, description: event.target.value }))}
                                />
                            </label>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <button
                                    className="w-fit border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900"
                                    type="submit"
                                >
                                    Create Organization
                                </button>
                                <button
                                    className="border border-slate-300 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                    type="button"
                                    onClick={() => openModel(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            <section className="grid gap-5 lg:grid-cols-[1fr_2fr] items-start">
                <div className="border border-slate-300 bg-white p-5">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Session</h2>
                        <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Connected</span>
                    </div>
                    <div className="space-y-3 text-sm text-slate-700">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Account</span>
                            <span className="font-medium text-slate-900">{auth.user?.name ?? "Unknown user"}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-slate-500">Email</span>
                            <span className="font-medium text-slate-900">{auth.user?.email ?? "Signed out"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500">Organizations</span>
                            <span className="font-medium text-slate-900">{orgs.length}</span>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-300 bg-slate-50 p-5">
                    <div className="mb-4 border-b border-slate-200 pb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Organizations</h2>
                        <button
                            className="text-sm font-semibold uppercase tracking-[0.25em] border border-slate-900 bg-slate-900 px-4 py-2 text-white transition hover:bg-white hover:text-slate-900 group"
                            onClick={() => openModel(!modalOpen)}
                        >
                            <span className="group-hover:rotate-6">+</span>Create
                        </button>
                    </div>
                    <span className="text-sm font-thin tracking-[0.1em] text-slate-500">Recently Created</span>
                    {orgs.length === 0 ? (
                        <p className="text-sm text-slate-600 mt-2">No organizations listed yet.</p>
                    ) : (
                        <ul className="space-y-2 mt-2 max-h-88 overflow-y-auto pr-1">
                            {orgs.slice(0, 5).map((org) => (
                                <li className="border border-slate-200 bg-white p-3 flex justify-between items-center" key={org._id}>
                                    <div className="text-sm font-medium text-slate-900">
                                        <p>{org.name}</p>
                                        <div className="mt-1 text-sm text-slate-600">{org.description}</div>
                                    </div>
                                    <Link
                                        className="border border-slate-900 bg-slate-900 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center"
                                        to={`/organizations?organizationId=${org._id}`}
                                    >
                                        View
                                        <ArrowUpRightIcon size={14} />
                                    </Link>
                                </li>
                            ))}

                            {<li className="pt-2">
                                <Link
                                    className="inline-flex w-full justify-center items-center gap-2 border border-slate-300 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                    to="/organizations"
                                >
                                    Load all
                                    <ArrowUpRightIcon size={14} />
                                </Link>
                            </li>}
                        </ul>
                    )}
                </div>
            </section>
        </main>
    );
}

export default DashboardPage;