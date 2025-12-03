import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
    password: text("password").notNull(),
    role: text("role").notNull().default("student"), // student, teacher, coordinator
    name: text("name").notNull(),
    email: text("email").unique(),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    subject: text("subject").notNull(),
    status: text("status").notNull().default("Planejamento"),
    progress: integer("progress").default(0),
    students: integer("students").default(0),
    nextDeadline: timestamp("next_deadline"),
    deadlineLabel: text("deadline_label"),
    theme: text("theme").default("blue"),
    teacherId: integer("teacher_id").references(() => users.id),
    delayed: boolean("delayed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id).notNull(),
    title: text("title").notNull(),
    status: text("status").default("todo"), // todo, in-progress, done
    assignee: text("assignee"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
    id: serial("id").primaryKey(),
    date: text("date").notNull(),
    title: text("title").notNull(),
    type: text("type").notNull(), // deadline, meeting
    projectId: integer("project_id").references(() => projects.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attendance = pgTable("attendance", {
    id: serial("id").primaryKey(),
    studentId: integer("student_id").references(() => users.id).notNull(),
    date: text("date").notNull(),
    status: text("status").notNull(), // Presente, Ausente
    classRoom: text("class_room").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rubrics = pgTable("rubrics", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id),
    criteria: text("criteria").notNull(),
    weight: integer("weight").notNull(),
    levels: jsonb("levels").notNull(), // Array of strings
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
    id: serial("id").primaryKey(),
    senderId: integer("sender_id").references(() => users.id).notNull(),
    receiverId: integer("receiver_id").references(() => users.id).notNull(),
    text: text("text").notNull(),
    read: boolean("read").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertProjectSchema = createInsertSchema(projects);
export const selectProjectSchema = createSelectSchema(projects);
export const insertTaskSchema = createInsertSchema(tasks);
export const selectTaskSchema = createSelectSchema(tasks);
export const insertEventSchema = createInsertSchema(events);
export const selectEventSchema = createSelectSchema(events);
