import { Schema, model } from 'mongoose';

// Фіксований список тегів (enum)
const noteTags = [
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
  'Ideas',
  'Travel',
  'Finance',
  'Health',
  'Important',
  'Todo',
];

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // Обов'язкове поле
      trim: true, // Обрізати пробіли на початку та в кінці
    },
    content: {
      type: String,
      default: '', // За замовчуванням порожній рядок
      trim: true, // Обрізати пробіли
    },
    tag: {
      type: String,
      enum: noteTags, // Приймає лише значення з масиву noteTags
      default: 'Todo', // За замовчуванням 'Todo'
    },
  },
  {
    timestamps: true, // Автоматично додає createdAt та updatedAt
    versionKey: false, // Приховує поле __v
    // collection: 'notes', // Рекомендовано явно вказати назву колекції
  },
);

// Експортуємо модель, назва моделі — 'Note' (Mongoose створить колекцію 'notes')
export const Note = model('Note', noteSchema);
