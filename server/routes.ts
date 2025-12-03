import type { Express, Request, Response } from "express";
import { db } from "./db";
import { users, projects, tasks, events, attendance, messages, submissions, notifications } from "./db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function registerRoutes(app: Express) {
    // Auth routes
    app.post("/api/auth/register", async (req: Request, res: Response) => {
        try {
            const { username, password, role, name, email } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const [user] = await db.insert(users).values({
                username,
                password: hashedPassword,
                role: role || "student",
                name,
                email,
            }).returning();

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);

            res.json({ user: { ...user, password: undefined }, token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.post("/api/auth/login", async (req: Request, res: Response) => {
        try {
            const { username, password } = req.body;

            const [user] = await db.select().from(users).where(eq(users.username, username));

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);

            res.json({ user: { ...user, password: undefined }, token });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    // Projects routes
    app.get("/api/projects", async (req: Request, res: Response) => {
        try {
            const allProjects = await db.select().from(projects);
            res.json(allProjects);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/projects", async (req: Request, res: Response) => {
        try {
            const [project] = await db.insert(projects).values(req.body).returning();
            res.json(project);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get("/api/projects/:id", async (req: Request, res: Response) => {
        try {
            const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
            if (!project) {
                return res.status(404).json({ error: "Project not found" });
            }
            res.json(project);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/projects/:id", async (req: Request, res: Response) => {
        try {
            const [project] = await db.update(projects)
                .set(req.body)
                .where(eq(projects.id, parseInt(req.params.id)))
                .returning();
            res.json(project);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.delete("/api/projects/:id", async (req: Request, res: Response) => {
        try {
            await db.delete(projects).where(eq(projects.id, parseInt(req.params.id)));
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Tasks routes
    app.get("/api/projects/:projectId/tasks", async (req: Request, res: Response) => {
        try {
            const projectTasks = await db.select().from(tasks)
                .where(eq(tasks.projectId, parseInt(req.params.projectId)));
            res.json(projectTasks);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/tasks", async (req: Request, res: Response) => {
        try {
            const [task] = await db.insert(tasks).values(req.body).returning();
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.put("/api/tasks/:id", async (req: Request, res: Response) => {
        try {
            const [task] = await db.update(tasks)
                .set(req.body)
                .where(eq(tasks.id, parseInt(req.params.id)))
                .returning();
            res.json(task);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
        try {
            await db.delete(tasks).where(eq(tasks.id, parseInt(req.params.id)));
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // Events routes
    app.get("/api/events", async (req: Request, res: Response) => {
        try {
            const allEvents = await db.select().from(events);
            res.json(allEvents);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/events", async (req: Request, res: Response) => {
        try {
            const [event] = await db.insert(events).values(req.body).returning();
            res.json(event);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    // Attendance routes
    app.get("/api/attendance", async (req: Request, res: Response) => {
        try {
            const { date, classRoom } = req.query;
            let query = db.select().from(attendance);

            if (date && classRoom) {
                const records = await query.where(
                    and(
                        eq(attendance.date, date as string),
                        eq(attendance.classRoom, classRoom as string)
                    )
                );
                return res.json(records);
            }

            const allRecords = await query;
            res.json(allRecords);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/attendance", async (req: Request, res: Response) => {
        try {
            const [record] = await db.insert(attendance).values(req.body).returning();
            res.json(record);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    // Messages routes
    app.get("/api/messages", async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;

            if (userId) {
                const userMessages = await db.select().from(messages)
                    .where(
                        and(
                            eq(messages.receiverId, parseInt(userId as string))
                        )
                    );
                return res.json(userMessages);
            }

            const allMessages = await db.select().from(messages);
            res.json(allMessages);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/messages", async (req: Request, res: Response) => {
        try {
            const [message] = await db.insert(messages).values(req.body).returning();
            res.json(message);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    // Users routes
    app.get("/api/users", async (req: Request, res: Response) => {
        try {
            const { role } = req.query;

            if (role) {
                const roleUsers = await db.select().from(users).where(eq(users.role, role as string));
                return res.json(roleUsers.map(u => ({ ...u, password: undefined })));
            }

            const allUsers = await db.select().from(users);
            res.json(allUsers.map(u => ({ ...u, password: undefined })));
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // ========== SUBMISSIONS ROUTES ==========

    app.post("/api/submissions", async (req: Request, res: Response) => {
        try {
            const [submission] = await db.insert(submissions).values(req.body).returning();

            // Create notification for teacher
            const [project] = await db.select().from(projects).where(eq(projects.id, req.body.projectId));
            if (project?.teacherId) {
                await db.insert(notifications).values({
                    recipientId: project.teacherId,
                    type: "message",
                    title: "Nova submissão",
                    message: "Um aluno enviou trabalho",
                    relatedProjectId: req.body.projectId,
                });
            }

            res.status(201).json(submission);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.get("/api/submissions/project/:projectId", async (req: Request, res: Response) => {
        try {
            const projectSubmissions = await db.select().from(submissions)
                .where(eq(submissions.projectId, parseInt(req.params.projectId)));
            res.json(projectSubmissions);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.post("/api/submissions/:id/grade", async (req: Request, res: Response) => {
        try {
            const [submission] = await db.update(submissions)
                .set({
                    grade: req.body.grade,
                    feedback: req.body.feedback,
                    gradedBy: req.body.gradedBy,
                    gradedAt: new Date(),
                })
                .where(eq(submissions.id, parseInt(req.params.id)))
                .returning();

            // Create notification for student
            await db.insert(notifications).values({
                recipientId: submission.studentId,
                type: "feedback",
                title: "Feedback recebido",
                message: "Seu trabalho foi avaliado",
                relatedProjectId: submission.projectId,
            });

            res.json(submission);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    // ========== NOTIFICATIONS ROUTES ==========

    app.get("/api/notifications", async (req: Request, res: Response) => {
        try {
            const { userId } = req.query;
            if (!userId) {
                return res.status(400).json({ error: "userId is required" });
            }

            const userNotifications = await db.select().from(notifications)
                .where(eq(notifications.recipientId, parseInt(userId as string)))
                .orderBy(notifications.createdAt);
            res.json(userNotifications);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    app.put("/api/notifications/:id/read", async (req: Request, res: Response) => {
        try {
            const [notification] = await db.update(notifications)
                .set({ read: true })
                .where(eq(notifications.id, parseInt(req.params.id)))
                .returning();
            res.json(notification);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    });

    app.delete("/api/notifications/:id", async (req: Request, res: Response) => {
        try {
            await db.delete(notifications).where(eq(notifications.id, parseInt(req.params.id)));
            res.json({ success: true });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });

    // ========== ANALYTICS ROUTES ==========

    app.get("/api/analytics/performance/:studentId", async (req: Request, res: Response) => {
        try {
            const studentId = parseInt(req.params.studentId);

            // Get submissions
            const studentSubmissions = await db.select().from(submissions)
                .where(eq(submissions.studentId, studentId));

            const avgGrade = studentSubmissions.length > 0
                ? studentSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / studentSubmissions.length
                : 0;

            // Get attendance
            const studentAttendance = await db.select().from(attendance)
                .where(eq(attendance.studentId, studentId));

            const presentCount = studentAttendance.filter(a => a.status === "Presente").length;
            const attendancePercentage = studentAttendance.length > 0
                ? (presentCount / studentAttendance.length) * 100
                : 0;

            res.json({
                averageGrade: avgGrade.toFixed(1),
                attendancePercentage: attendancePercentage.toFixed(1),
                submissionCount: studentSubmissions.length,
                attendanceRecords: studentAttendance.length,
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    });
}
