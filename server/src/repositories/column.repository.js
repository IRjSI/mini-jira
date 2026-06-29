import ColumnModel from "../models/column.model.js"

const createColumn = async (columnData) => {
    return ColumnModel.create(columnData);
};

const findColumnById = async (columnId) => {
    return ColumnModel.findById(columnId);
};

const findColumnsByBoard = async (boardId, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return ColumnModel
        .find({ board: boardId })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ order: 1 });
};

const updateColumn = async (id, updateData) => {
    return ColumnModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
        }
    );
};

const deleteColumn = async (id) => {
    return ColumnModel.findByIdAndDelete(id);
};


const columnRepository = {
    createColumn,
    findColumnById,
    findColumnsByBoard,
    updateColumn,
    deleteColumn,
};

export default columnRepository;