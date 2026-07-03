import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createProject, deleteProject, getProjects, getProjectsByOrganization } from "../api/project.api";
import type { Project } from "../features/project/projectTypes";
import { TrashIcon, XIcon } from "lucide-react";

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [modalOpen, setModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const organizationId = searchParams.get("organizationId") ?? "";

    const loadProjects = async () => {
        const response = organizationId
            ? await getProjectsByOrganization(organizationId)
            : await getProjects();

        setProjects(response.data);
    };

    useEffect(() => {
        loadProjects();
    }, [organizationId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.name) {
            return;
        }

        await createProject({
            name: formData.name,
            description: formData.description,
            organizationId
        });

        setFormData({ name: "", description: "" });
        setModalOpen(false);
        await loadProjects();
    };

    const handleDelete = async (projectId: string) => {
        const projectName = projects.find(p => p._id === projectId)?.name;
        if (!window.confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteProject(projectId);
            await loadProjects();
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 py-1 text-slate-900 sm:px-2 sm:py-2">
            <header className="border-b border-slate-300 pb-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Planning</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Create new initiatives and keep track of the work in motion.</p>
            </header>

            <section className="border border-slate-300 bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Create Project</h2>
                    <button
                        className="text-sm font-semibold uppercase tracking-[0.25em] border border-slate-900 bg-slate-900 px-4 py-2 text-white transition hover:bg-white hover:text-slate-900"
                        onClick={() => setModalOpen(true)}
                        type="button"
                    >
                        + Create
                    </button>
                </div>
            </section>

            {modalOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                    <div className="w-full max-w-xl border border-slate-300 bg-white p-5 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]" role="dialog" aria-modal="true" aria-label="Create project" aria-labelledby="create-project-title">
                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Create project</p>
                                <h2 id="create-project-title" className="text-xl font-semibold tracking-tight text-slate-900">New project</h2>
                            </div>
                            <button
                                type="button"
                                className="border border-slate-300 p-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                onClick={() => setModalOpen(false)}
                                aria-label="Close"
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Project name</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Project name"
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
                                    Create Project
                                </button>
                                <button
                                    className="border border-slate-300 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            {projects.length === 0 ? (
                <div className="border border-slate-300 bg-white p-6 text-sm text-slate-600">No projects found for this workspace yet.</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {projects.map((project) => (
                        <article className="border border-slate-300 bg-white p-4 sm:p-5 flex items-start justify-between gap-3" key={project._id}>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
                                <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                                <p className="mt-3 text-sm text-slate-500">Organization: {project.organization}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleDelete(project._id)}
                                className="border border-red-300 bg-red-50 p-2 text-red-700 transition hover:border-red-900 hover:bg-red-100 hover:text-red-900 shrink-0"
                                aria-label="Delete project"
                            >
                                <TrashIcon size={16} />
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default ProjectsPage;
