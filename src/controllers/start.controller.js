import { ApiResponse } from '../utils/ApiResponse.js';

const startServer = (req, res) => {
  return res.status(200).json(new ApiResponse(200, null, 'Welcome to MOLO server'));
};

export { startServer };
