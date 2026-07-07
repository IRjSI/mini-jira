import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    deleteOrganization,
    getOrganizationById
} from "../api/organization.api";
import {
    createProject,
    deleteProject,
    getProjectsByOrganization
} from "../api/project.api";
import type { Organization } from "../features/organization/organizationTypes";
import type { Project } from "../features/project/projectTypes";
import {
    ArrowUpRightIcon,
    TrashIcon,
    XIcon,
    PlusIcon,
    FolderIcon,
    ClockIcon,
    UserIcon
} from "lucide-react";
import { useAppSelector } from "../hooks/redux";
import Breadcrumbs from "../components/Breadcrumbs";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function OrganizationPage() {
    const queryClient = useQueryClient()

    const user = useAppSelector((state) => (state.auth.user));
    const { id: organizationId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [createProjectOpen, setCreateProjectOpen] = useState(false);
    const [newProjectData, setNewProjectData] = useState({ name: "", description: "" });

    const loadOrganizationDetails = async () => {
        try {
            const data = await getOrganizationById(organizationId!);
            return data;
        } catch (error) {
            console.error(error);
        }
    };
    const { data: organization, isLoading: orgLoading, } = useQuery<Organization>({ queryKey: ['organization', organizationId], queryFn: loadOrganizationDetails, enabled: !!organizationId, staleTime: 1000 * 60 * 5, })

    const loadProjects = async () => {
        try {
            const data = await getProjectsByOrganization(organizationId!);
            return Array.isArray(data) ? data : data.projects ?? [];
        } catch (error) {
            console.error(error);
        }
    };
    const { data: projectsData, isLoading: projLoading, } = useQuery<Project[]>({ queryKey: ['projects', organizationId], queryFn: loadProjects, enabled: !!organizationId, staleTime: 1000 * 60 * 5, });

    const projects = projectsData ?? [];

    const handleDeleteOrg = async () => {
        if (!organization || !organizationId) return;
        if (!window.confirm(`Are you sure you want to delete "${organization.name}"?`)) {
            return;
        }
        try {
            await deleteOrganization(organizationId);
            navigate("/organizations");
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectData.name.trim() || !organizationId) return;
        try {
            await createProject({
                name: newProjectData.name,
                description: newProjectData.description,
                organizationId
            });
            setNewProjectData({ name: "", description: "" });
            setCreateProjectOpen(false);

            await queryClient.invalidateQueries({
                queryKey: ["projects", organizationId]
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProject = async (projectId: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete project "${name}"?`)) return;
        try {
            await deleteProject(projectId);

            await queryClient.invalidateQueries({
                queryKey: ["projects", organizationId]
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 py-4 text-slate-900">
            <header className="border-b border-slate-300 pb-5">
                <Breadcrumbs
                    items={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Organizations", href: "/organizations" },
                        { label: organization?.name || "..." }
                    ]}
                />

                {orgLoading ? (
                    <div className="py-2 text-sm text-slate-500 font-medium">Loading details...</div>
                ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Organization Space</p>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{organization?.name}</h1>
                            <p className="mt-2 max-w-3xl text-sm text-slate-600">{organization?.description || "No description provided."}</p>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <UserIcon size={13} />
                                    Owner: {user?.name}
                                </span>
                                {organization?.createdAt && (
                                    <span className="flex items-center gap-1">
                                        <ClockIcon size={13} />
                                        Created: {new Date(organization.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 self-start">
                            <button
                                onClick={() => setCreateProjectOpen(true)}
                                className="border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                            >
                                <PlusIcon size={14} />
                                Create Project
                            </button>
                            <button
                                onClick={handleDeleteOrg}
                                className="border border-red-300 bg-red-50 p-2.5 text-red-700 transition hover:border-red-900 hover:bg-red-100 hover:text-red-900 cursor-pointer"
                            >
                                <TrashIcon size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500 flex items-center gap-1">
                        <FolderIcon size={14} />
                        Projects inside this Workspace
                    </h2>
                </div>

                {projLoading ? (
                    <div className="py-12 text-center text-sm text-slate-500 font-medium">Fetching projects...</div>
                ) : projects.length === 0 ? (
                    <div className="border border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                        <p className="text-base font-medium">No projects listed inside this organization yet.</p>
                        <p className="mt-1 text-sm text-slate-500">Create a project to start planning initiatives.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((proj) => (
                            <div
                                className="border border-slate-300 bg-white p-5 flex flex-col justify-between gap-4 transition duration-200 hover:shadow-md hover:border-slate-500"
                                key={proj._id}
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{proj.name}</h3>
                                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{proj.description || "No description provided."}</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <button
                                        onClick={() => handleDeleteProject(proj._id, proj.name)}
                                        className="border border-red-200 bg-red-50 p-1.5 text-red-600 hover:border-red-600 hover:text-red-800 transition cursor-pointer"
                                    >
                                        <TrashIcon size={14} />
                                    </button>
                                    <Link
                                        to={`/project/${proj._id}`}
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
            </section>

            {createProjectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                    <div className="w-full max-w-xl border border-slate-300 bg-white p-5 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-project-title">
                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Initiatives</p>
                                <h2 id="create-project-title" className="text-xl font-semibold tracking-tight text-slate-900">New Project</h2>
                            </div>
                            <button
                                type="button"
                                className="border border-slate-300 p-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                onClick={() => setCreateProjectOpen(false)}
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                        <form className="flex flex-col gap-4" onSubmit={handleCreateProject}>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Project name</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter name"
                                    required
                                    value={newProjectData.name}
                                    onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Description</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter description"
                                    value={newProjectData.description}
                                    onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </label>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    className="w-fit border border-slate-900 bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 cursor-pointer"
                                    type="submit"
                                >
                                    Create Project
                                </button>
                                <button
                                    className="border border-slate-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900 cursor-pointer"
                                    type="button"
                                    onClick={() => setCreateProjectOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default OrganizationPage;