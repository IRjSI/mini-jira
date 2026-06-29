import BoardModel from "../models/board.model.js";

const createBoard = async (boardData) => {
    return BoardModel.create(boardData);
};

const findBoardById = async (id) => {
    return BoardModel.findById(id);
};

const findBoardsByProject = async (projectId, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return BoardModel
        .find({ project: projectId })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const updateBoard = async (id, updateData) => {
    return BoardModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
        }
    );
};

const deleteBoard = async (id) => {
    return BoardModel.findByIdAndDelete(id);
};

const boardRepository = {
    createBoard,
    findBoardById,
    findBoardsByProject,
    updateBoard,
    deleteBoard,
};

export default boardRepository;
