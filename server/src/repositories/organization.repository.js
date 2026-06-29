import OrganizationModel from '../models/organization.model.js';

const createOrganization = async (organizationData) => {
    return OrganizationModel.create(organizationData);
};

const findAllOrganizations = async (filter = {}) => {
    return OrganizationModel.find(filter).sort({ createdAt: -1 });
};

const findOrganizationById = async (id) => {
    return OrganizationModel.findById(id);
};

const findOrganizationByOwner = async (owner) => {
    return OrganizationModel.find({ owner }).sort({ createdAt: -1 });
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
