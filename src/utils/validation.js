import { ApiError } from "./ApiError.js"

export const getValidationDone = (requiredFields,reqestBody) => {
    const missingFields = [];
    for (const field of requiredFields) {
        if(!reqestBody[field]) missingFields.push(field);
    }

    const errorMessage = `required fields: ${missingFields.join(', ')}`;
    if(missingFields.length > 0) throw new ApiError(400,errorMessage);

    return true;
}