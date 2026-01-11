const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    // Return the Promise so callers can await and tests won't race
    return Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
