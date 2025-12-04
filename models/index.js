import sequelize from '../config/database.js';
import { UserModel } from './User.js';
import { ProjectModel } from './Project.js';
import { TaskModel } from './Task.js';
import { SubmissionModel } from './Submission.js';
import { AttendanceModel } from './Attendance.js';
import { NotificationModel } from './Notification.js';

// Inicializar models
const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);
const Submission = SubmissionModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Notification = NotificationModel(sequelize);

// Associações
User.hasMany(Project, { foreignKey: 'teacherId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

User.hasMany(Task, { foreignKey: 'assignedToId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Submission, { foreignKey: 'studentId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Project.hasMany(Submission, { foreignKey: 'projectId', as: 'submissions' });
Submission.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Submission, { foreignKey: 'gradedById', as: 'graded' });
Submission.belongsTo(User, { foreignKey: 'gradedById', as: 'gradedBy' });

User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendance' });
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

Project.hasMany(Notification, { foreignKey: 'relatedProjectId', as: 'notifications' });
Notification.belongsTo(Project, { foreignKey: 'relatedProjectId', as: 'project' });

export { User, Project, Task, Submission, Attendance, Notification, sequelize };
