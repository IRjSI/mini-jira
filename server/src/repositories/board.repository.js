import BoardModel from "../models/board.model.js";

const createBoard = async (boardData) => {
    return BoardModel.create(boardData);
};

const findBoardById = async (id) => {
    return BoardModel.findById(id);
};

const findBoardsByProject = async (projectId) => {
    return BoardModel.find({ project: projectId }).sort({ createdAt: -1 });
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
