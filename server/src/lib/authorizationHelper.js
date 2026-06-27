const isOrganizationOwner = (organization, userId) => {
    return organization.owner.toString() === userId.toString();
};

export {
    isOrganizationOwner,
};