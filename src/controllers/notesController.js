// src/controllers/notesController.js
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getAllNotes = async (req, res, next) => {
  const { page, perPage, tag, search } = req.query;

  const skip = (page - 1) * perPage;

  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const notesQuery = Note.find({ userId: req.user._id });

  try {
    const [totalNotes, notes] = await Promise.all([
      notesQuery.clone().countDocuments(),
      notesQuery.skip(skip).limit(perPage).lean(),
    ]);

    const totalPages = Math.ceil(totalNotes / perPage);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({
      _id: noteId,
      userId: req.user._id,
    });

    if (!note) {
      // Якщо ID валідний, але документ не знайдено
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    // Якщо ID невалідний (CastError), обробляємо як 404
    if (error.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(error);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      // Додаємо властивість userId
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOneAndDelete({
      _id: noteId,
      // Критерій пошуку по userId
      userId: req.user._id,
    });

    if (!note) {
      // Якщо ID валідний, але документ не знайдено
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    // Якщо ID невалідний (CastError), обробляємо як 404
    if (error.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(error);
  }
};

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!note) {
      // Якщо ID валідний, але документ не знайдено
      return next(createHttpError(404, 'Note not found'));
    }

    res.status(200).json(note);
  } catch (error) {
    // Якщо ID невалідний (CastError), обробляємо як 404
    if (error.name === 'CastError') {
      return next(createHttpError(404, 'Note not found'));
    }
    next(error);
  }
};
