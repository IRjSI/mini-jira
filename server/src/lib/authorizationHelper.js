const isOrganizationOwner = (organization, userId) => {
    return organization.owner.toString() === userId.toString();
};

const isAuthorizedForProject = (project, organization, userId) => {
    return (
        project.createdBy.toString() === userId.toString() ||
        isOrganizationOwner(organization, userId)
    );
};

export {
    isOrganizationOwner,
    isAuthorizedForProject,
};