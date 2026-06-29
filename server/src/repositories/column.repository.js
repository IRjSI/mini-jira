import ColumnModel from "../models/column.model.js"

const createColumn = async (columnData) => {
    return ColumnModel.create(columnData);
};

const findColumnById = async (columnId) => {
    return ColumnModel.findById(columnId);
};

const findColumnsByBoard = async (boardId) => {
    return ColumnModel.find({ board: boardId }).sort({ order: 1 });
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