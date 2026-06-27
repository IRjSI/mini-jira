import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import boardService from "../services/board.service.js";

const createBoard = asyncHandler(async (req, res) => {
    const board = await boardService.createBoard(
        req.user._id,
        req.params.projectId,
        req.body
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Board created successfully.",
            board
        )
    );
});

const getBoardsByProject = asyncHandler(async (req, res) => {
    const boards = await boardService.getBoardsByProject(
        req.user._id,
        req.params.projectId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Boards fetched successfully.",
            boards
        )
    );
});

const getBoard = asyncHandler(async (req, res) => {
    const board = await boardService.getBoard(
        req.user._id,
        req.params.boardId
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Board fetched successfully.",
            board
        )
    );
});

const updateBoard = asyncHandler(async (req, res) => {
    const board = await boardService.updateBoard(
        req.user._id,
        req.params.boardId,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Board updated successfully.",
            board
        )
    );
});

const deleteBoard = asyncHandler(async (req, res) => {
    await boardService.deleteBoard(req.user._id, req.params.boardId);

    res.status(200).json(
        new ApiResponse(
            200,
            "Board deleted successfully.",
            null
        )
    );
});

export default {
    createBoard,
    getBoardsByProject,
    getBoard,
    updateBoard,
    deleteBoard,
};
