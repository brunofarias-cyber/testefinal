import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    username: text("username").unique().notNull(),
    password: text("password").notNull(),
    role: text("role").notNull().default("student"), // student, teacher, coordinator
    name: text("name").notNull(),
    email: text("email").unique(),
    school: text("school"),
    class: text("class"),
    isActive: boolean("is_active").default(true),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projects = pgTable("projects", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    subject: text("subject").notNull(),
    status: text("status").notNull().default("Planejamento"),
    description: text("description"),
    category: text("category"),
    difficulty: text("difficulty"), // Fácil, Médio, Difícil
    startDate: timestamp("start_date"),
    deadline: timestamp("deadline"),
    progress: integer("progress").default(0),
    students: integer("students").default(0),
    nextDeadline: timestamp("next_deadline"),
    deadlineLabel: text("deadline_label"),
    theme: text("theme").default("blue"),
    teacherId: integer("teacher_id").references(() => users.id),
    delayed: boolean("delayed").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id).notNull(),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status").default("todo"), // todo, in-progress, done
    assignee: text("assignee"),
    dueDate: timestamp("due_date"),
    priority: text("priority").default("normal"), // low, normal, high
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

// Submissions table
export const submissions = pgTable("submissions", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id).notNull(),
    studentId: integer("student_id").references(() => users.id).notNull(),
    fileUrl: text("file_url"),
    link: text("link"),
    comment: text("comment"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
    grade: integer("grade"),
    feedback: text("feedback"),
    gradedAt: timestamp("graded_at"),
    gradedBy: integer("graded_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
    id: serial("id").primaryKey(),
    recipientId: integer("recipient_id").references(() => users.id).notNull(),
    type: text("type").notNull(), // deadline, feedback, message, achievement, announcement
    title: text("title").notNull(),
    message: text("message").notNull(),
    relatedProjectId: integer("related_project_id").references(() => projects.id),
    read: boolean("read").default(false).notNull(),
    priority: text("priority").default("normal").notNull(), // low, normal, high
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project-Student junction table (many-to-many)
export const projectStudents = pgTable("project_students", {
    id: serial("id").primaryKey(),
    projectId: integer("project_id").references(() => projects.id).notNull(),
    studentId: integer("student_id").references(() => users.id).notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
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
export const insertSubmissionSchema = createInsertSchema(submissions);
export const selectSubmissionSchema = createSelectSchema(submissions);
export const insertNotificationSchema = createInsertSchema(notifications);
export const selectNotificationSchema = createSelectSchema(notifications);
