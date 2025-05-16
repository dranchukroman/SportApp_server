export function getMissingFields(allFields, requiredFields) {
    return requiredFields.filter(field => !allFields[field])
}