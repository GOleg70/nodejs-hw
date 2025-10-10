// src/middleware/errorHandler.js

import { HttpError } from 'http-errors';
import { isCelebrateError } from 'celebrate';

export const errorHandler = (error, req, res, next) => {
  if (isCelebrateError(error)) {
    const errorBody =
      error.details.get('body') ||
      error.details.get('params') ||
      error.details.get('query');

    const details = errorBody ? errorBody.details : [];

    return res.status(400).json({
      message: 'Validation failed',
      details: details.map((err) => err.message),
    });
  }

  if (error.name === 'CastError') {
    console.error('CastError caught:', error.message);

    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  if (error instanceof HttpError) {
    return res.status(error.status).json({
      message: error.message || error.name,
    });
  }

  console.error(error);
  res.status(500).json({
    message: 'Internal Server Error',
  });
};
