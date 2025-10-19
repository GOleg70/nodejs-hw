import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';

// Фіксований список тегів (enum)
// const noteTags = [
//   'Work',
//   'Personal',
//   'Meeting',
//   'Shopping',
//   'Ideas',
//   'Travel',
//   'Finance',
//   'Health',
//   'Important',
//   'Todo',
// ];

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      default: 'Todo',
    },
    // Нова властивість
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

noteSchema.index({
  title: 'text',
  content: 'text',
});

export const Note = model('Note', noteSchema);
