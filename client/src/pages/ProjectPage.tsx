import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createProject, getProjects, getProjectsByOrganization } from "../api/project.api";
import type { Project } from "../features/project/projectTypes";

function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({ name: "", description: "" });
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
        await loadProjects();
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 py-1 text-slate-900 sm:px-2 sm:py-2">
            <header className="border-b border-slate-300 pb-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Planning</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">Create new initiatives and keep track of the work in motion.</p>
            </header>

            <section className="border border-slate-300 bg-white p-4 sm:p-5">
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
                    <button className="w-fit border border-slate-900 bg-slate-900 px-4 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900" type="submit">Create Project</button>
                </form>
            </section>

            {projects.length === 0 ? (
                <div className="border border-slate-300 bg-white p-6 text-sm text-slate-600">No projects found for this workspace yet.</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {projects.map((project) => (
                        <article className="border border-slate-300 bg-white p-4 sm:p-5" key={project._id}>
                            <h2 className="text-lg font-semibold text-slate-900">{project.name}</h2>
                            <p className="mt-1 text-sm text-slate-600">{project.description}</p>
                            <p className="mt-3 text-sm text-slate-500">Organization: {project.organization}</p>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default ProjectPage;
