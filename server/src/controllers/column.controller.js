import columnRepository from "../repositories/column.repository.js";
import columnService from "../services/column.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const createColumn = asyncHandler(async (req, res) => {
    const column = await columnService.createColumn(
        req.user._id,
        req.params.boardId,
        req.body
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Column created successfully.",
            column
        )
    );
});

const findColumnById = asyncHandler(async (req, res) => {
    const column = await columnService.findColumnById(
        req.user._id,
        req.params.columnId
    );
    
    res.status(200).json(
        new ApiResponse(
            200,
            "Column fetched successfully.",
            column
        )
    );
});

const findColumnsByBoard = asyncHandler(async (req, res) => {
    const columns = await columnService.findColumnsByBoard(
        req.user._id,
        req.params.boardId,
        req.query.page,
        req.query.limit
    );
    
    res.status(200).json(
        new ApiResponse(
            200,
            "Columns fetched successfully.",
            columns
        )
    );
});

const updateColumn = asyncHandler(async (req, res) => {
    const column = await columnService.updateColumn(
        req.user._id,
        req.params.columnId,
        req.body
    );
    
    res.status(200).json(
        new ApiResponse(
            200,
            "Column updated successfully.",
            column
        )
    );
});

const deleteColumn = asyncHandler(async (req, res) => {
    await columnService.deleteColumn(
        req.user._id,
        req.params.columnId
    );
    
    res.status(200).json(
        new ApiResponse(
            200,
            "Column deleted successfully.",
            null
        )
    );
});

export default {
    createColumn,
    findColumnById,
    findColumnsByBoard,
    updateColumn,
    deleteColumn,
};