// src/validations/notesValidation.js

import { Joi, Segments } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string()
      .custom(objectIdValidator, 'MongoDB ID validation')
      .required(),
  }),
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().trim().allow(''),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string.',
      'string.min': 'Title must have at least {#limit} character.',
      'any.required': 'Title is required.',
    }),

    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string.',
    }),

    tag: Joi.string()
      .valid(...TAGS)
      .default('Todo')
      .messages({
        'string.base': 'Tag must be a string.',
        'any.only': `Tag must be one of the following: ${TAGS.join(', ')}`,
      }),
  }),
};

export const updateNoteSchema = {
  ...noteIdSchema,
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
  }).min(1),
};
