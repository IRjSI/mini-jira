import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProjects, getProjectsByOrganization } from "../api/project.api";
import type { Project } from "../features/project/projectTypes";

function ProjectPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchParams] = useSearchParams();
    const organizationId = searchParams.get("organizationId");

    useEffect(() => {
        const loadProjects = async () => {
            const response = organizationId
                ? await getProjectsByOrganization(organizationId)
                : await getProjects();

            setProjects(response.data);
        };

        loadProjects();
    }, [organizationId]);

    if (projects.length === 0) {
        return (
            <main>
                <h2>No projects found</h2>
            </main>
        );
    }

    return (
        <main>
            {projects.map((project) => (
                <div key={project._id}>
                    <h2>{project.name}</h2>
                    <p>{project.description}</p>
                    <p>Organization: {project.organization}</p>
                </div>
            ))}
        </main>
    );
}

export default ProjectPage;
