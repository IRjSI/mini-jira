import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBoardById, deleteBoard } from "../api/board.api";
import { getProjectById } from "../api/project.api";
import { getColumnsByBoard, createColumn, deleteColumn, type CreateColumnRequest } from "../api/column.api";
import type { Board } from "../features/board/boardTypes";
import type { Project } from "../features/project/projectTypes";
import type { Column } from "../features/column/columnType";
import { ClockIcon, PlusIcon, TrashIcon, UserIcon, XIcon } from "lucide-react";
import { useAppSelector } from "../hooks/redux";
import Breadcrumbs from "../components/Breadcrumbs";
import { getTasksByColumn, createTask, deleteTask, type CreateTaskRequest, moveTask } from "../api/task.api";
import type { Task } from "../features/task/taskType";
import { Draggable, Droppable } from "react-drag-and-drop";

function BoardPage() {
    const user = useAppSelector((state) => state.auth.user);
    const { id: boardId } = useParams();
    const navigate = useNavigate();

    const [board, setBoard] = useState<Board>();
    const [project, setProject] = useState<Project>();
    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    const [createColumnOpen, setCreateColumnOpen] = useState(false);
    const [newColumnData, setNewColumnData] = useState<CreateColumnRequest>({ name: "" });
    const [isLoading, setIsLoading] = useState(true);

    const [createTaskColumnId, setCreateTaskColumnId] = useState<string | null>(null);
    const [newTaskData, setNewTaskData] = useState<CreateTaskRequest>({ title: "", description: "", priority: "medium" });

    const loadBoardAndColumns = async () => {
        if (!boardId) return;
        setIsLoading(true);
        try {
            const boardRes = await getBoardById(boardId);
            setBoard(boardRes.data);

            if (boardRes.data?.project) {
                const projectRes = await getProjectById(boardRes.data.project);
                setProject(projectRes.data);
            }

            const columnsRes = await getColumnsByBoard(boardId);
            setColumns(columnsRes.data);
        } catch (error) {
            console.error("Failed to load board details", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTasks = async () => {
        try {
            const tasksPromises = columns.map((column) => getTasksByColumn(column._id));
            const tasksResponse = await Promise.all(tasksPromises);
            const allTasks = tasksResponse.flatMap((tr) => tr.data);
            setTasks(allTasks);
        } catch (error) {
            console.error("Failed to load tasks", error);
        }
    };

    useEffect(() => {
        if (columns.length > 0) {
            loadTasks();
        }
    }, [columns]);

    useEffect(() => {
        loadBoardAndColumns();
    }, [boardId]);

    const handleDeleteBoard = async () => {
        if (!board) return;
        if (!window.confirm(`Are you sure you want to delete board "${board.name}"? This action cannot be undone.`)) return;
        try {
            await deleteBoard(board._id);
            if (project) {
                navigate(`/project/${project._id}`);
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Failed to delete board:", error);
        }
    };

    const handleCreateColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnData.name.trim() || !boardId) return;
        try {
            await createColumn(boardId, newColumnData);
            setNewColumnData({ name: "" });
            setCreateColumnOpen(false);

            const columnsRes = await getColumnsByBoard(boardId);
            setColumns(columnsRes.data);
        } catch (error) {
            console.error("Failed to create column:", error);
        }
    };

    const handleDeleteColumn = async (columnId: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete column "${name}"?`)) return;
        try {
            await deleteColumn(columnId);
            if (boardId) {
                const columnsRes = await getColumnsByBoard(boardId);
                setColumns(columnsRes.data);
            }
        } catch (error) {
            console.error("Failed to delete column:", error);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskData.title.trim() || !createTaskColumnId) return;
        try {
            await createTask(createTaskColumnId, newTaskData);
            setNewTaskData({ title: "", description: "", priority: "medium" });
            setCreateTaskColumnId(null);

            // Reload tasks after creation
            await loadTasks();
        } catch (error) {
            console.error("Failed to create task:", error);
        }
    };

    const handleDeleteTask = async (taskId: string, title?: string) => {
        if (!window.confirm(`Are you sure you want to delete task "${title || "Unknown"}"?`)) return;
        try {
            await deleteTask(taskId);

            // Reload tasks after deletion
            await loadTasks();
        } catch (error) {
            console.error("Failed to delete task:", error);
        }
    };

    const handleTaskMove = async (data: Task, column: Column) => {
        const previousTasks = tasks;

        try {
            if (data.column === column._id) {
                return;
            }
            const taskId = data._id;
            if (!taskId) return;
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t._id === taskId ? { ...t, column: column._id } : t
                )
            );

            await moveTask(taskId, column._id);
        } catch (error) {
            setTasks(previousTasks);
        }
    }

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 font-medium">Loading board details...</div>;
    }

    if (!board) {
        return <div className="p-8 text-center text-slate-500 font-medium">Board not found or you don't have access.</div>;
    }

    return (
        <main className="mx-auto flex h-[calc(100vh-4rem)] w-full max-w-7xl flex-col gap-4 px-2 py-4 text-slate-900 sm:px-4 sm:py-6 overflow-hidden">
            <header className="shrink-0 border-b border-slate-300 pb-4">
                <Breadcrumbs
                    items={[
                        { label: "Dashboard", href: "/dashboard" },
                        { label: "Organizations", href: "/organizations" },
                        ...(project ? [
                            { label: project.organizationName || "Organization", href: `/organization/${project.organization}` },
                            { label: project.name, href: `/project/${project._id}` }
                        ] : []),
                        { label: board.name }
                    ]}
                />

                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mt-3">
                    <div className="flex-1">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">Board</p>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{board.name}</h1>
                        {board.description && (
                            <p className="mt-1.5 max-w-2xl text-sm text-slate-600 line-clamp-1">{board.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1">
                                <UserIcon size={12} />
                                Owner: {user?.name}
                            </span>
                            {board.createdAt && (
                                <span className="flex items-center gap-1">
                                    <ClockIcon size={12} />
                                    Created: {new Date(board.createdAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 self-start md:self-center">
                        <button
                            onClick={() => setCreateColumnOpen(true)}
                            className="border border-slate-900 bg-slate-900 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                        >
                            <PlusIcon size={13} />
                            Add Column
                        </button>
                        <button
                            onClick={handleDeleteBoard}
                            className="border border-red-300 bg-red-50 p-2 text-red-700 transition hover:border-red-600 hover:bg-red-100 hover:text-red-800 cursor-pointer"
                            aria-label="Delete Board"
                            title="Delete Board"
                        >
                            <TrashIcon size={15} />
                        </button>
                    </div>
                </div>
            </header>

            <section className="flex-1 overflow-x-auto pb-4 pt-1">
                <div className="flex h-full items-start gap-4 flex-nowrap min-w-max">
                    {columns.map((column) => (
                        <div key={column._id} className="w-80 shrink-0 bg-slate-100 border border-slate-200 flex flex-col h-full rounded shadow-sm">
                            <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white group hover:bg-slate-50 transition">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                                    {column.name}
                                </h3>
                                <button
                                    onClick={() => handleDeleteColumn(column._id, column.name)}
                                    className="text-slate-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100 p-1"
                                    title="Delete Column"
                                >
                                    <TrashIcon size={13} />
                                </button>
                            </div>

                            <div className="flex-1 p-2 overflow-y-auto flex flex-col gap-2 relative">
                                <Droppable
                                    types={["task"]}
                                    onDrop={(data: any) => {
                                        if (data.task) {
                                            try {
                                                const droppedTask = JSON.parse(data.task);
                                                handleTaskMove(droppedTask, column);
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        }
                                    }}
                                >
                                    {tasks.filter(t => t.column === column._id).length === 0 ? (
                                        <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider text-center mt-6">
                                            No tasks yet
                                        </div>
                                    ) : (
                                        tasks.filter(t => t.column === column._id).map((task) => (
                                            <div key={task._id}>
                                                <Draggable
                                                    key={task._id}
                                                    type="task"
                                                    data={JSON.stringify(task)}
                                                >


                                                    <div className="group relative rounded border border-slate-200 bg-white p-3 shadow-sm hover:shadow hover:border-slate-300 transition flex flex-col gap-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                                                                {task.name}
                                                            </h4>
                                                            <button
                                                                onClick={() => handleDeleteTask(task._id, (task as any).title || task.name)}
                                                                className="text-slate-300 hover:text-red-600 transition p-1 shrink-0 bg-slate-50 rounded"
                                                                title="Delete Task"
                                                            >
                                                                <TrashIcon size={12} />
                                                            </button>
                                                        </div>
                                                        {(task as any).description && (
                                                            <p className="text-xs text-slate-600 line-clamp-2">
                                                                {(task as any).description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Draggable>
                                            </div>
                                        ))
                                    )}
                                </Droppable>
                            </div>
                            <div className="border-t border-slate-200 bg-slate-50 p-2">
                                <button
                                    onClick={() => setCreateTaskColumnId(column._id)}
                                    className="w-full flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition px-2 py-1.5 rounded cursor-pointer"
                                >
                                    <PlusIcon size={14} />
                                    Add a task
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setCreateColumnOpen(true)}
                        className="w-80 shrink-0 border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-400 transition flex flex-col items-center justify-center p-8 h-30 rounded text-slate-500 cursor-pointer"
                    >
                        <PlusIcon size={20} className="mb-2 text-slate-400" />
                        <span className="text-sm font-semibold">Add another column</span>
                    </button>
                </div>
            </section >

            {/* CREATE COLUMN MODAL */}
            {
                createColumnOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                        <div className="w-full max-w-sm border border-slate-300 bg-white p-5 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-column-title">
                            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
                                <div>
                                    <h2 id="create-column-title" className="text-lg font-semibold tracking-tight text-slate-900">Add Column</h2>
                                </div>
                                <button
                                    type="button"
                                    className="text-slate-400 transition hover:text-slate-900"
                                    onClick={() => setCreateColumnOpen(false)}
                                >
                                    <XIcon size={18} />
                                </button>
                            </div>
                            <form className="flex flex-col gap-4" onSubmit={handleCreateColumn}>
                                <label className="flex flex-col gap-1.5 text-left text-sm text-slate-700">
                                    <span className="font-semibold text-xs">Name</span>
                                    <input
                                        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                        type="text"
                                        placeholder="e.g. To Do, In Progress"
                                        required
                                        autoFocus
                                        value={newColumnData.name}
                                        onChange={(e) => setNewColumnData(prev => ({ ...prev, name: e.target.value }))}
                                    />
                                </label>
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        className="border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white hover:text-slate-900 w-full cursor-pointer"
                                        type="submit"
                                    >
                                        Create Column
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* CREATE TASK MODAL */}
            {
                createTaskColumnId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-3 py-4" role="presentation">
                        <div className="w-full max-w-sm border border-slate-300 bg-white p-5 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="create-task-title">
                            <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
                                <div>
                                    <h2 id="create-task-title" className="text-lg font-semibold tracking-tight text-slate-900">Add Task</h2>
                                </div>
                                <button
                                    type="button"
                                    className="text-slate-400 transition hover:text-slate-900"
                                    onClick={() => setCreateTaskColumnId(null)}
                                >
                                    <XIcon size={18} />
                                </button>
                            </div>
                            <form className="flex flex-col gap-4" onSubmit={handleCreateTask}>
                                <label className="flex flex-col gap-1.5 text-left text-sm text-slate-700">
                                    <span className="font-semibold text-xs">Title</span>
                                    <input
                                        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900"
                                        type="text"
                                        placeholder="Enter task name"
                                        required
                                        autoFocus
                                        value={newTaskData.title}
                                        onChange={(e) => setNewTaskData(prev => ({ ...prev, title: e.target.value }))}
                                    />
                                </label>
                                <label className="flex flex-col gap-1.5 text-left text-sm text-slate-700">
                                    <span className="font-semibold text-xs text-slate-500">Description (Optional)</span>
                                    <textarea
                                        className="w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-900 h-20 resize-none"
                                        placeholder="Add more details to this task..."
                                        value={newTaskData.description}
                                        onChange={(e) => setNewTaskData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </label>
                                <div className="flex items-center gap-2 pt-2">
                                    <button
                                        className="border border-slate-900 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white hover:text-slate-900 w-full cursor-pointer"
                                        type="submit"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </main >
    );
}

export default BoardPage;
