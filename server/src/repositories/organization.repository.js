import OrganizationModel from '../models/organization.model.js';

const createOrganization = async (organizationData) => {
    return OrganizationModel.create(organizationData);
};

const findAllOrganizations = async (page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return OrganizationModel
        .find()
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const findOrganizationById = async (id) => {
    return OrganizationModel.findById(id);
};

const findOrganizationByOwner = async (owner, page = 1, limit = 10) => {
    const normalizedPage = Number.isFinite(Number(page)) && Number(page) > 0 ? Number(page) : 1;
    const normalizedLimit = Number.isFinite(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;

    return OrganizationModel
        .find({ owner })
        .skip((normalizedPage - 1) * normalizedLimit)
        .limit(normalizedLimit)
        .sort({ createdAt: -1 });
};

const updateOrganization = async (id, updateData) => {
    return OrganizationModel.findByIdAndUpdate(
        id,
        updateData,
        {
            new: true,
        }
    );
};

const deleteOrganization = async (id) => {
    return OrganizationModel.findByIdAndDelete(id);
};

const organizationRepository = {
    createOrganization,
    findAllOrganizations,
    findOrganizationById,
    findOrganizationByOwner,
    updateOrganization,
    deleteOrganization,
};

export default organizationRepository;
