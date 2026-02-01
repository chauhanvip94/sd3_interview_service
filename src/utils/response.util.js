export const sendSuccessResponse = (response, data, statusCode = 200) => {
  response.status(statusCode).json({ success: true, data });
};
