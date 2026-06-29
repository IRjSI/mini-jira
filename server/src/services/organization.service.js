import organizationRepository from "../repositories/organization.repository.js";
import ApiError from "../utils/ApiError.js";

const createOrganization = async (userId, { name, description = "" }) => {
    if (!name?.trim()) {
        throw new ApiError(400, "Organization name is required.");
    }

    const org = await organizationRepository.createOrganization({
        name,
        description,
        owner: userId,
        members: [userId],
    });

    return org;
};

const getOrganizations = async (page, limit) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    const organizations = await organizationRepository.findAllOrganizations();

    return organizations.slice((normalizedPage - 1) * normalizedLimit, normalizedPage * normalizedLimit);
};

const getOrganization = async (organizationId) => {
    const organization = await organizationRepository.findOrganizationById(
        organizationId
    );

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const updateOrganization = async (organizationId, updateData) => {
    const organization = await organizationRepository.updateOrganization(
        organizationId,
        updateData
    );

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const deleteOrganization = async (organizationId) => {
    const organization = await organizationRepository.deleteOrganization(organizationId);

    if (!organization) {
        throw new ApiError(404, "Organization not found.");
    }

    return organization;
};

const organizationService = {
    createOrganization,
    getOrganizations,
    getOrganization,
    updateOrganization,
    deleteOrganization,
};

export default organizationService;