import OrganizationModel from '../models/organization.model.js';

const createOrganization = async (organizationData) => {
    return OrganizationModel.create(organizationData);
};

const findAllOrganizations = async () => {
    return OrganizationModel.find();
};

const findOrganizationByOwner = async (owner) => {
    return OrganizationModel.find({ owner });
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
    findOrganizationByOwner,
    updateOrganization,
    deleteOrganization,
};

export default organizationRepository;
