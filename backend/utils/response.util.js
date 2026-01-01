export const sendResponse = (res, statusCode, success, data = null, message = null) => {
  const response = {
    success,
    ...(data && { data }),
    ...(message && { message }),
  };
  return res.status(statusCode).json(response);
};

export const sendSuccess = (res, statusCode = 200, data = null, message = null) => {
  return sendResponse(res, statusCode, true, data, message);
};

export const sendError = (res, statusCode = 500, message = 'Server Error') => {
  return sendResponse(res, statusCode, false, null, message);
};

