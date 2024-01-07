import { ApiError } from "./ApiError.js"

export const getValidationDone = (requiredFields,requestBody) => {
    const missingFields = [];
    for (const field of requiredFields) {
        if(!requestBody[field]) missingFields.push(field);
    }

    const errorMessage = `required fields: ${missingFields.join(', ')}`;
    if(missingFields.length > 0) throw new ApiError(400,errorMessage);

    return true;
}

export const getValidationDoneForFiles = (requiredFields, files) => {
    const missingFields = [];
    for (const field of requiredFields) {
      if (!files || !files[field] || files[field].length === 0) missingFields.push(field);
    }
  
    const errorMessage = `required fields: ${missingFields.join(', ')}`;
    if (missingFields.length > 0) throw new ApiError(400, errorMessage);
  
    return true;
  };
