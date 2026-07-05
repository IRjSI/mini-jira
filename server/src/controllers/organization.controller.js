import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import organizationService from "../services/organization.service.js";

const createOrganization = asyncHandler(async (req, res) => {
    const organization = await organizationService.createOrganization(
        req.user._id,
        req.body
    );

    res.status(201).json(
        new ApiResponse(
            201,
            "Organization created successfully.",
            organization
        )
    );
});

const getOrganizations = asyncHandler(async (req, res) => {
    const organizations = await organizationService.getOrganizations(req.user._id, req.query.page, req.query.limit);

    res.status(200).json(
        new ApiResponse(
            200,
            "Organizations fetched successfully.",
            organizations
        )
    );
});

const getOrganization = asyncHandler(async (req, res) => {
    const organization = await organizationService.getOrganization(
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Organization fetched successfully.",
            organization
        )
    );
});

const updateOrganization = asyncHandler(async (req, res) => {
    const organization = await organizationService.updateOrganization(
        req.params.id,
        req.body
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Organization updated successfully.",
            organization
        )
    );
});

const deleteOrganization = asyncHandler(async (req, res) => {
    await organizationService.deleteOrganization(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Organization deleted successfully.",
            null
        )
    );
});

const bootstrapOrganization = asyncHandler(async (req, res) => {
    const bootstrapResult = await organizationService.bootstrapOrganization(
        req.user._id,
        req.params.id
    );

    res.status(200).json(
        new ApiResponse(
            200,
            "Organization bootstrapped successfully.",
            bootstrapResult
        )
    );
});

export default {
    createOrganization,
    getOrganizations,
    getOrganization,
    updateOrganization,
    deleteOrganization,
    bootstrapOrganization,
};