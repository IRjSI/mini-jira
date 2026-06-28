const isOrganizationOwner = (organization, userId) => {
    return organization.owner.toString() === userId.toString();
};

const isAuthorizedForProject = (project, organization, userId) => {
    return (
        project.createdBy.toString() === userId.toString() ||
        isOrganizationOwner(organization, userId)
    );
};

const isAuthorizedForColumn = (board, project, userId) => {
    return (
        board.createdBy.toString() === userId.toString() ||
        isAuthorizedForProject(project, userId)
    );
};

const canManageProject = (project, organization, userId) => {
    return (
        project.createdBy.toString() === userId.toString() ||
        organization.owner.toString() === userId.toString()
    );
};

export {
    isOrganizationOwner,
    isAuthorizedForProject,
    isAuthorizedForColumn,
    canManageProject,
};