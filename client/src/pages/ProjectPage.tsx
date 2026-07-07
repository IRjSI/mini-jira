import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProject, getProjectById } from "../api/project.api";
import type { Project } from "../features/project/projectTypes";
import { ClockIcon, PlusIcon, TrashIcon, UserIcon, XIcon, FolderIcon, ArrowUpRightIcon } from "lucide-react";
import { useAppSelector } from "../hooks/redux";
import Breadcrumbs from "../components/Breadcrumbs";
import { createBoard, getBoardsByProject, deleteBoard, type CreateBoardRequest } from "../api/board.api";
import type { Board } from "../features/board/boardTypes";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function ProjectPage() {
    const queryClient = useQueryClient();
    const user = useAppSelector((state) => (state.auth.user));
    const { id: projectId } = useParams();
    const navigate = useNavigate();

    const [createBoardOpen, setCreateBoardOpen] = useState(false);
    const [newBoardData, setNewBoardData] = useState<CreateBoardRequest>({ name: "", description: "" });

    const { data: project, isLoading: projLoading } = useQuery<Project>({
        queryKey: ["project", projectId],
        queryFn: async () => {
            const data = await getProjectById(projectId!);
            return data;
        },
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5,
    });

    const { data: boards, isLoading: boardsLoading } = useQuery<Board[]>({
        queryKey: ["boards", projectId],
        queryFn: async () => {
            const data = await getBoardsByProject(projectId!);
            return Array.isArray(data) ? data : data.boards ?? [];
        },
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5,
    });

    const isLoading = projLoading || boardsLoading;
    const safeBoards = boards ?? [];

    const handleDelete = async (id: string | undefined) => {
        if (!id || !project) return;

        if (!window.confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteProject(id);
            navigate(`/organization/${project.organization}`);
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const handleDeleteBoard = async (boardId: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete board "${name}"?`)) return;
        try {
            await deleteBoard(boardId);
            queryClient.invalidateQueries({ queryKey: ["boards", projectId] });
        } catch (error) {
            console.error("Failed to delete board:", error);
        }
    };

    const handleCreateBoard = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBoardData.name.trim() || !projectId) return;
        try {
            await createBoard(projectId, newBoardData);
            setNewBoardData({ name: "", description: "" });
            setCreateBoardOpen(false);
            queryClient.invalidateQueries({ queryKey: ["boards", projectId] });
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-1 py-1 text-slate-900 sm:px-2 sm:py-2">
            <header className="border-b border-slate-300 pb-4">
                <Breadcrumbs
                    items={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Organizations", href: "/organizations" },
                        { label: project?.organizationName || "Organization", href: project?.organization ? `/organization/${project.organization}` : undefined },
                        { label: project?.name || "..." }
                    ]}
                />

                {isLoading ? (
                    <div className="py-2 text-sm text-slate-500 font-medium">Loading details...</div>
                ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Planning</p>
                            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project?.name ?? "Project"}</h1>
                            <p className="mt-2 max-w-2xl text-sm text-slate-600">Create new initiatives and keep track of the work in motion.</p>
                            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                    <UserIcon size={13} />
                                    Owner: {user?.name}
                                </span>
                                <span className="flex items-center gap-1">
                                    <UserIcon size={13} />
                                    Org: {project?.organizationName}
                                </span>
                                {project?.createdAt && (
                                    <span className="flex items-center gap-1">
                                        <ClockIcon size={13} />
                                        Created: {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 self-start">
                            <button
                                onClick={() => setCreateBoardOpen(true)}
                                className="border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                            >
                                <PlusIcon size={14} />
                                Create Board
                            </button>
                            <button
                                onClick={() => handleDelete(project?._id)}
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
                        Boards in this Project
                    </h2>
                </div>

                {boardsLoading ? (
                    <div className="py-12 text-center text-sm text-slate-500 font-medium">Fetching boards...</div>
                ) : safeBoards.length === 0 ? (
                    <div className="border border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
                        <p className="text-base font-medium">No boards created in this project yet.</p>
                        <p className="mt-1 text-sm text-slate-500">Create a board to start organizing tasks.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {safeBoards.map((board) => (
                            <div
                                className="border border-slate-300 bg-white p-5 flex flex-col justify-between gap-4 transition duration-200 hover:shadow-md hover:border-slate-500"
                                key={board._id}
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{board.name}</h3>
                                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{board.description || "No description provided."}</p>
                                </div>
                                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                    <button
                                        onClick={() => handleDeleteBoard(board._id, board.name)}
                                        className="border border-red-200 bg-red-50 p-1.5 text-red-600 hover:border-red-600 hover:text-red-800 transition cursor-pointer"
                                        aria-label="Delete board"
                                    >
                                        <TrashIcon size={14} />
                                    </button>
                                    <button
                                        onClick={() => navigate(`/board/${board._id}`)}
                                        className="border border-slate-900 bg-slate-900 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                                    >
                                        Open
                                        <ArrowUpRightIcon size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {createBoardOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                    <div className="w-full max-w-xl border border-slate-300 bg-white p-5 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-board-title">
                        <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500">Initiatives</p>
                                <h2 id="create-board-title" className="text-xl font-semibold tracking-tight text-slate-900">New Board</h2>
                            </div>
                            <button
                                type="button"
                                className="border border-slate-300 p-2 text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
                                onClick={() => setCreateBoardOpen(false)}
                            >
                                <XIcon size={16} />
                            </button>
                        </div>
                        <form className="flex flex-col gap-4" onSubmit={handleCreateBoard}>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Board name</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter name"
                                    required
                                    autoFocus
                                    value={newBoardData.name}
                                    onChange={(e) => setNewBoardData(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-left text-sm text-slate-700">
                                <span>Description</span>
                                <input
                                    className="w-full border border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-slate-900"
                                    type="text"
                                    placeholder="Enter description"
                                    value={newBoardData.description}
                                    onChange={(e) => setNewBoardData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </label>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    className="w-fit border border-slate-900 bg-slate-900 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900 cursor-pointer"
                                    type="submit"
                                >
                                    Create Board
                                </button>
                                <button
                                    className="border border-slate-300 px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-900 hover:text-slate-900 cursor-pointer"
                                    type="button"
                                    onClick={() => setCreateBoardOpen(false)}
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

export default ProjectPage;
