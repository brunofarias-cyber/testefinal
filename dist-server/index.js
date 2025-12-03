var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index-prod.ts
import express2 from "express";

// server/db/index.ts
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  attendance: () => attendance,
  events: () => events,
  insertEventSchema: () => insertEventSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertSubmissionSchema: () => insertSubmissionSchema,
  insertTaskSchema: () => insertTaskSchema,
  insertUserSchema: () => insertUserSchema,
  messages: () => messages,
  notifications: () => notifications,
  projectStudents: () => projectStudents,
  projects: () => projects,
  rubrics: () => rubrics,
  selectEventSchema: () => selectEventSchema,
  selectNotificationSchema: () => selectNotificationSchema,
  selectProjectSchema: () => selectProjectSchema,
  selectSubmissionSchema: () => selectSubmissionSchema,
  selectTaskSchema: () => selectTaskSchema,
  selectUserSchema: () => selectUserSchema,
  submissions: () => submissions,
  tasks: () => tasks,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  // student, teacher, coordinator
  name: text("name").notNull(),
  email: text("email").unique(),
  school: text("school"),
  class: text("class"),
  isActive: boolean("is_active").default(true),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("Planejamento"),
  description: text("description"),
  category: text("category"),
  difficulty: text("difficulty"),
  // Fácil, Médio, Difícil
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
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("todo"),
  // todo, in-progress, done
  assignee: text("assignee"),
  dueDate: timestamp("due_date"),
  priority: text("priority").default("normal"),
  // low, normal, high
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var events = pgTable("events", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  // deadline, meeting
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  // Presente, Ausente
  classRoom: text("class_room").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var rubrics = pgTable("rubrics", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  criteria: text("criteria").notNull(),
  weight: integer("weight").notNull(),
  levels: jsonb("levels").notNull(),
  // Array of strings
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").references(() => users.id).notNull(),
  receiverId: integer("receiver_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var submissions = pgTable("submissions", {
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
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  recipientId: integer("recipient_id").references(() => users.id).notNull(),
  type: text("type").notNull(),
  // deadline, feedback, message, achievement, announcement
  title: text("title").notNull(),
  message: text("message").notNull(),
  relatedProjectId: integer("related_project_id").references(() => projects.id),
  read: boolean("read").default(false).notNull(),
  priority: text("priority").default("normal").notNull(),
  // low, normal, high
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var projectStudents = pgTable("project_students", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users);
var selectUserSchema = createSelectSchema(users);
var insertProjectSchema = createInsertSchema(projects);
var selectProjectSchema = createSelectSchema(projects);
var insertTaskSchema = createInsertSchema(tasks);
var selectTaskSchema = createSelectSchema(tasks);
var insertEventSchema = createInsertSchema(events);
var selectEventSchema = createSelectSchema(events);
var insertSubmissionSchema = createInsertSchema(submissions);
var selectSubmissionSchema = createSelectSchema(submissions);
var insertNotificationSchema = createInsertSchema(notifications);
var selectNotificationSchema = createSelectSchema(notifications);

// server/db/index.ts
dotenv.config();
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool, { schema: schema_exports });

// server/routes.ts
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
function registerRoutes(app2) {
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, role, name, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const [user] = await db.insert(users).values({
        username: username || email.split("@")[0],
        password: hashedPassword,
        role: role || "student",
        name,
        email
      }).returning();
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
      res.json({ success: true, user: { ...user, password: void 0 }, token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password, username } = req.body;
      const loginField = email || username;
      const [user] = email ? await db.select().from(users).where(eq(users.email, email)) : await db.select().from(users).where(eq(users.username, username));
      if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ success: false, error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
      res.json({ success: true, user: { ...user, password: void 0 }, token });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  });
  app2.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await db.select().from(projects);
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/projects", async (req, res) => {
    try {
      const [project] = await db.insert(projects).values(req.body).returning();
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:id", async (req, res) => {
    try {
      const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/projects/:id", async (req, res) => {
    try {
      const [project] = await db.update(projects).set(req.body).where(eq(projects.id, parseInt(req.params.id))).returning();
      res.json(project);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/projects/:id", async (req, res) => {
    try {
      await db.delete(projects).where(eq(projects.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/projects/:projectId/tasks", async (req, res) => {
    try {
      const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, parseInt(req.params.projectId)));
      res.json(projectTasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/tasks", async (req, res) => {
    try {
      const [task] = await db.insert(tasks).values(req.body).returning();
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.put("/api/tasks/:id", async (req, res) => {
    try {
      const [task] = await db.update(tasks).set(req.body).where(eq(tasks.id, parseInt(req.params.id))).returning();
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/tasks/:id", async (req, res) => {
    try {
      await db.delete(tasks).where(eq(tasks.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/events", async (req, res) => {
    try {
      const allEvents = await db.select().from(events);
      res.json(allEvents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/events", async (req, res) => {
    try {
      const [event] = await db.insert(events).values(req.body).returning();
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/attendance", async (req, res) => {
    try {
      const { date, classRoom } = req.query;
      let query = db.select().from(attendance);
      if (date && classRoom) {
        const records = await query.where(
          and(
            eq(attendance.date, date),
            eq(attendance.classRoom, classRoom)
          )
        );
        return res.json(records);
      }
      const allRecords = await query;
      res.json(allRecords);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/attendance", async (req, res) => {
    try {
      const [record] = await db.insert(attendance).values(req.body).returning();
      res.json(record);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/messages", async (req, res) => {
    try {
      const { userId } = req.query;
      if (userId) {
        const userMessages = await db.select().from(messages).where(
          and(
            eq(messages.receiverId, parseInt(userId))
          )
        );
        return res.json(userMessages);
      }
      const allMessages = await db.select().from(messages);
      res.json(allMessages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/messages", async (req, res) => {
    try {
      const [message] = await db.insert(messages).values(req.body).returning();
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      if (role) {
        const roleUsers = await db.select().from(users).where(eq(users.role, role));
        return res.json(roleUsers.map((u) => ({ ...u, password: void 0 })));
      }
      const allUsers = await db.select().from(users);
      res.json(allUsers.map((u) => ({ ...u, password: void 0 })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/submissions", async (req, res) => {
    try {
      const [submission] = await db.insert(submissions).values(req.body).returning();
      const [project] = await db.select().from(projects).where(eq(projects.id, req.body.projectId));
      if (project?.teacherId) {
        await db.insert(notifications).values({
          recipientId: project.teacherId,
          type: "message",
          title: "Nova submiss\xE3o",
          message: "Um aluno enviou trabalho",
          relatedProjectId: req.body.projectId
        });
      }
      res.status(201).json(submission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/submissions/project/:projectId", async (req, res) => {
    try {
      const projectSubmissions = await db.select().from(submissions).where(eq(submissions.projectId, parseInt(req.params.projectId)));
      res.json(projectSubmissions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.post("/api/submissions/:id/grade", async (req, res) => {
    try {
      const [submission] = await db.update(submissions).set({
        grade: req.body.grade,
        feedback: req.body.feedback,
        gradedBy: req.body.gradedBy,
        gradedAt: /* @__PURE__ */ new Date()
      }).where(eq(submissions.id, parseInt(req.params.id))).returning();
      await db.insert(notifications).values({
        recipientId: submission.studentId,
        type: "feedback",
        title: "Feedback recebido",
        message: "Seu trabalho foi avaliado",
        relatedProjectId: submission.projectId
      });
      res.json(submission);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.get("/api/notifications", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      const userNotifications = await db.select().from(notifications).where(eq(notifications.recipientId, parseInt(userId))).orderBy(notifications.createdAt);
      res.json(userNotifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.put("/api/notifications/:id/read", async (req, res) => {
    try {
      const [notification] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, parseInt(req.params.id))).returning();
      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  app2.delete("/api/notifications/:id", async (req, res) => {
    try {
      await db.delete(notifications).where(eq(notifications.id, parseInt(req.params.id)));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/api/analytics/performance/:studentId", async (req, res) => {
    try {
      const studentId = parseInt(req.params.studentId);
      const studentSubmissions = await db.select().from(submissions).where(eq(submissions.studentId, studentId));
      const avgGrade = studentSubmissions.length > 0 ? studentSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / studentSubmissions.length : 0;
      const studentAttendance = await db.select().from(attendance).where(eq(attendance.studentId, studentId));
      const presentCount = studentAttendance.filter((a) => a.status === "Presente").length;
      const attendancePercentage = studentAttendance.length > 0 ? presentCount / studentAttendance.length * 100 : 0;
      res.json({
        averageGrade: avgGrade.toFixed(1),
        attendancePercentage: attendancePercentage.toFixed(1),
        submissionCount: studentSubmissions.length,
        attendanceRecords: studentAttendance.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
function serveStatic(app2) {
  const distPath = path.resolve(process.cwd(), "dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// server/index-prod.ts
import dotenv2 from "dotenv";
dotenv2.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      console.log(`${req.method} ${path2} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});
registerRoutes(app);
serveStatic(app);
var PORT = process.env.PORT || 5e3;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
