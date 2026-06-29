const getOrganizationRole = (organization, userId) => {
    if (String(organization.owner) === String(userId)) {
        return "owner";
    }

    const member = organization.members.find((member) => String(member.user) === String(userId));

    return member?.role ?? null;
};

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

const canManageProject = (organization, userId) => {
    const role = getOrganizationRole(
        organization,
        userId
    );

    return ["owner", "admin"].includes(role);
};

export {
    getOrganizationRole,
    isOrganizationOwner,
    isAuthorizedForProject,
    isAuthorizedForColumn,
    canManageProject,
};