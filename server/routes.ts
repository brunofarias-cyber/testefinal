import type { Express, Request, Response } from "express";
import { db } from "./db";
import { users, projects, tasks, events, attendance, messages } from "./db/schema";
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
}
