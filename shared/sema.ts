// ŞEMA.TS - Veritabanı tabloları ve Zod şemaları
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Maksimum soru sayısı limitleri (TYT ve AYT için)
export const SUBJECT_LIMITS: Record<string, Record<string, number>> = {
  TYT: {
    'Türkçe': 40,
    'Sosyal Bilimler': 20,
    'Matematik': 30,
    'Geometri': 10,
    'Fen Bilimleri': 20,
    'Fizik': 7,
    'Kimya': 7,
    'Biyoloji': 6
  },
  AYT: {
    'Matematik': 30,
    'Geometri': 10,
    'Fizik': 14,
    'Kimya': 13,
    'Biyoloji': 13
  }
};

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  category: text("category", { enum: ["genel", "turkce", "sosyal", "matematik", "fizik", "kimya", "biyoloji", "tyt-geometri", "ayt-geometri", "ayt-matematik", "ayt-fizik", "ayt-kimya", "ayt-biyoloji"] }).notNull().default("genel"),
  color: text("color").default("#8B5CF6"),
  completed: boolean("completed").notNull().default(false),
  completedAt: text("completed_at"),
  archived: boolean("archived").notNull().default(false),
  archivedAt: text("archived_at"),
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: text("deleted_at"),
  dueDate: text("due_date"),
  recurrenceType: text("recurrence_type", { enum: ["none", "weekly", "monthly"] }).notNull().default("none"),
  recurrenceEndDate: text("recurrence_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moods = pgTable("moods", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  mood: text("mood").notNull(),
  moodBg: text("mood_bg"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: text("target_value").notNull(),
  currentValue: text("current_value").notNull().default("0"),
  unit: text("unit").notNull(),
  category: text("category", { enum: ["tyt", "ayt", "siralama", "genel"] }).notNull().default("genel"),
  timeframe: text("timeframe", { enum: ["günlük", "haftalık", "aylık", "yıllık"] }).notNull().default("aylık"),
  targetDate: text("target_date"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionLogs = pgTable("question_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exam_type: text("exam_type", { enum: ["TYT", "AYT"] }).notNull(),
  subject: text("subject").notNull(),
  topic: text("topic"),
  correct_count: text("correct_count").notNull(),
  wrong_count: text("wrong_count").notNull(),
  blank_count: text("blank_count").notNull().default("0"),
  wrong_topics: text("wrong_topics").array().default([]),
  wrong_topics_json: text("wrong_topics_json"),
  time_spent_minutes: integer("time_spent_minutes"),
  study_date: text("study_date").notNull(),
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: text("deleted_at"),
  archived: boolean("archived").notNull().default(false),
  archivedAt: text("archived_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exam_name: text("exam_name").notNull(),
  display_name: text("display_name"),
  exam_date: text("exam_date").notNull(),
  exam_type: text("exam_type", { enum: ["TYT", "AYT"] }),
  exam_scope: text("exam_scope", { enum: ["full", "branch"] }),
  selected_subject: text("selected_subject"),
  tyt_net: text("tyt_net").notNull().default("0"),
  ayt_net: text("ayt_net").notNull().default("0"),
  subjects_data: text("subjects_data"),
  ranking: text("ranking"),
  notes: text("notes"),
  time_spent_minutes: integer("time_spent_minutes"),
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: text("deleted_at"),
  archived: boolean("archived").notNull().default(false),
  archivedAt: text("archived_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examSubjectNets = pgTable("exam_subject_nets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  exam_id: varchar("exam_id").notNull(),
  exam_type: text("exam_type", { enum: ["TYT", "AYT"] }).notNull(),
  subject: text("subject").notNull(),
  net_score: text("net_score").notNull(),
  correct_count: text("correct_count").notNull().default("0"),
  wrong_count: text("wrong_count").notNull().default("0"),
  blank_count: text("blank_count").notNull().default("0"),
  wrong_topics_json: text("wrong_topics_json"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const flashcards = pgTable("flashcards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  examType: text("exam_type", { enum: ["TYT", "AYT"] }).notNull().default("TYT"),
  subject: text("subject", { enum: ["turkce", "matematik", "fizik", "kimya", "biyoloji", "tarih", "cografya", "felsefe", "genel"] }).notNull().default("genel"),
  topic: text("topic"),
  difficulty: text("difficulty", { enum: ["easy", "medium", "hard"] }).notNull().default("medium"),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review").defaultNow(),
  reviewCount: text("review_count").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const studyHours = pgTable("study_hours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  study_date: text("study_date").notNull(),
  hours: integer("hours").notNull().default(0),
  minutes: integer("minutes").notNull().default(0),
  seconds: integer("seconds").notNull().default(0),
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: text("deleted_at"),
  archived: boolean("archived").notNull().default(false),
  archivedAt: text("archived_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const setupCompleted = pgTable("setup_completed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  completed: boolean("completed").notNull().default(false),
  completedAt: text("completed_at"),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const installations = pgTable("installations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userName: text("user_name"),
  userEmail: text("user_email"),
  ipAddress: text("ip_address"),
  location: text("location"),
  computerSpecs: text("computer_specs"),
  operatingSystem: text("operating_system"),
  browserInfo: text("browser_info"),
  installDate: text("install_date").notNull(),
  lastActivity: text("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTaskSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  category: z.enum(["genel", "turkce", "sosyal", "matematik", "fizik", "kimya", "biyoloji", "tyt-geometri", "ayt-geometri", "ayt-matematik", "ayt-fizik", "ayt-kimya", "ayt-biyoloji"]).default("genel"),
  color: z.string().optional(),
  completed: z.boolean().optional(),
  archived: z.boolean().optional(),
  deleted: z.boolean().optional(),
  dueDate: z.string().nullable().optional(),
  recurrenceType: z.enum(["none", "weekly", "monthly"]).default("none"),
  recurrenceEndDate: z.string().nullable().optional(),
});

export const insertMoodSchema = z.object({
  mood: z.string(),
  moodBg: z.string().nullable().optional(),
  note: z.string().nullable().optional(),
});

export const insertGoalSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  targetValue: z.string(),
  currentValue: z.string().optional(),
  unit: z.string(),
  category: z.enum(["tyt", "ayt", "siralama", "genel"]).default("genel"),
  timeframe: z.enum(["günlük", "haftalık", "aylık", "yıllık"]).default("aylık"),
  targetDate: z.string().nullable().optional(),
  completed: z.boolean().optional(),
});

export const insertQuestionLogSchema = z.object({
  exam_type: z.enum(["TYT", "AYT"]),
  subject: z.string(),
  topic: z.string().nullable().optional(),
  correct_count: z.string(),
  wrong_count: z.string(),
  blank_count: z.string().optional(),
  wrong_topics: z.array(z.string()).optional(),
  wrong_topics_json: z.string().nullable().optional(),
  time_spent_minutes: z.number().nullable().optional(),
  study_date: z.string(),
  deleted: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const insertExamResultSchema = z.object({
  exam_name: z.string(),
  display_name: z.string().optional(),
  exam_date: z.string(),
  exam_type: z.enum(["TYT", "AYT"]).optional(),
  exam_scope: z.enum(["full", "branch"]).optional(),
  selected_subject: z.string().optional(),
  tyt_net: z.string().optional(),
  ayt_net: z.string().optional(),
  subjects_data: z.string().nullable().optional(),
  ranking: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  time_spent_minutes: z.number().nullable().optional(),
  deleted: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const insertFlashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  examType: z.enum(["TYT", "AYT"]).default("TYT"),
  subject: z.enum(["turkce", "matematik", "fizik", "kimya", "biyoloji", "tarih", "cografya", "felsefe", "genel"]).default("genel"),
  topic: z.string().nullable().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  lastReviewed: z.date().nullable().optional(),
  nextReview: z.date().optional(),
});

export const insertExamSubjectNetSchema = z.object({
  exam_id: z.string(),
  exam_type: z.enum(["TYT", "AYT"]),
  subject: z.string(),
  net_score: z.string(),
  correct_count: z.string().optional(),
  wrong_count: z.string().optional(),
  blank_count: z.string().optional(),
  wrong_topics_json: z.string().nullable().optional(),
});

export const insertStudyHoursSchema = z.object({
  study_date: z.string(),
  hours: z.number().default(0),
  minutes: z.number().default(0),
  seconds: z.number().default(0),
  deleted: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export const insertInstallationSchema = z.object({
  userName: z.string().nullable().optional(),
  userEmail: z.string().nullable().optional(),
  ipAddress: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  computerSpecs: z.string().nullable().optional(),
  operatingSystem: z.string().nullable().optional(),
  browserInfo: z.string().nullable().optional(),
  installDate: z.string(),
  lastActivity: z.string().nullable().optional(),
});

export const insertSetupCompletedSchema = z.object({
  completed: z.boolean().default(false),
  termsAccepted: z.boolean().default(false),
  completedAt: z.string().nullable().optional(),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertMood = z.infer<typeof insertMoodSchema>;
export type Mood = typeof moods.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertQuestionLog = z.infer<typeof insertQuestionLogSchema>;
export type QuestionLog = typeof questionLogs.$inferSelect;
export type InsertExamResult = z.infer<typeof insertExamResultSchema>;
export type ExamResult = typeof examResults.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
export type InsertExamSubjectNet = z.infer<typeof insertExamSubjectNetSchema>;
export type ExamSubjectNet = typeof examSubjectNets.$inferSelect;
export type InsertStudyHours = z.infer<typeof insertStudyHoursSchema>;
export type StudyHours = typeof studyHours.$inferSelect;
export type SetupCompleted = typeof setupCompleted.$inferSelect;
export type InsertSetupCompleted = z.infer<typeof insertSetupCompletedSchema>;
export type InsertInstallation = z.infer<typeof insertInstallationSchema>;
export type Installation = typeof installations.$inferSelect;

// CANKIR