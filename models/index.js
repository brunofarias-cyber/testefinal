import sequelize from '../config/database.js';
import { UserModel } from './User.js';
import { ProjectModel } from './Project.js';
import { TaskModel } from './Task.js';
import { SubmissionModel } from './Submission.js';
import { AttendanceModel } from './Attendance.js';
import { NotificationModel } from './Notification.js';

// BNCC Models
import BnccGeneralCompetency from './BnccGeneralCompetency.js';
import BnccDiscipline from './BnccDiscipline.js';
import BnccSkill from './BnccSkill.js';
import SkillGeneralCompetency from './SkillGeneralCompetency.js';
import ProjectSkill from './ProjectSkill.js';
import SkillIndicator from './SkillIndicator.js';
import StudentSkillEvaluation from './StudentSkillEvaluation.js';
import StudentSkillSummary from './StudentSkillSummary.js';
import BnccNotification from './BnccNotification.js';
import StudentSkillShare from './StudentSkillShare.js';
import TheoreticalReferenceModel from './TheoreticalReference.js';
import StudentFeedbackModel from './StudentFeedback.js';
import EvaluationBenchmarksModel from './EvaluationBenchmarks.js';
import TutorInteractionModel from './TutorInteraction.js';
import AssignmentModel from './Assignment.js';
import ClassModel from './Class.js';
import TeamModel from './Team.js';
import RubricaModel from './Rubrica.js';
import RubricaCriterioModel from './RubricaCriterio.js';
import RubricaNivelModel from './RubricaNivel.js';
import AvaliacaoEquipeModel from './AvaliacaoEquipe.js';
import AvaliacaoCriterioModel from './AvaliacaoCriterio.js';

// Inicializar models antigos
const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);
const Submission = SubmissionModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Notification = NotificationModel(sequelize);
const TheoreticalReference = TheoreticalReferenceModel(sequelize);
const StudentFeedback = StudentFeedbackModel(sequelize);
const EvaluationBenchmarks = EvaluationBenchmarksModel(sequelize);
const TutorInteraction = TutorInteractionModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const Class = ClassModel(sequelize);
const Team = TeamModel(sequelize);
const Rubrica = RubricaModel(sequelize);
const RubricaCriterio = RubricaCriterioModel(sequelize);
const RubricaNivel = RubricaNivelModel(sequelize);
const AvaliacaoEquipe = AvaliacaoEquipeModel(sequelize);
const AvaliacaoCriterio = AvaliacaoCriterioModel(sequelize);

// ==========================================
// ASSOCIAÇÕES EXISTENTES
// ==========================================

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

// ==========================================
// ASSOCIAÇÕES BNCC
// ==========================================

// BnccDiscipline → BnccSkill (One-to-Many)
BnccDiscipline.hasMany(BnccSkill, {
    foreignKey: 'disciplineId',
    as: 'skills'
});
BnccSkill.belongsTo(BnccDiscipline, {
    foreignKey: 'disciplineId',
    as: 'discipline'
});

// BnccSkill ↔ BnccGeneralCompetency (Many-to-Many)
BnccSkill.belongsToMany(BnccGeneralCompetency, {
    through: SkillGeneralCompetency,
    foreignKey: 'skillId',
    otherKey: 'competencyId',
    as: 'competencies'
});
BnccGeneralCompetency.belongsToMany(BnccSkill, {
    through: SkillGeneralCompetency,
    foreignKey: 'competencyId',
    otherKey: 'skillId',
    as: 'skills'
});

// Project → ProjectSkill (One-to-Many)
Project.hasMany(ProjectSkill, {
    foreignKey: 'projectId',
    as: 'projectSkills'
});
ProjectSkill.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// Project → SkillIndicator (One-to-Many)
Project.hasMany(SkillIndicator, {
    foreignKey: 'projectId',
    as: 'skillIndicators'
});
SkillIndicator.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// Project → StudentSkillEvaluation (One-to-Many)
Project.hasMany(StudentSkillEvaluation, {
    foreignKey: 'projectId',
    as: 'skillEvaluations'
});
StudentSkillEvaluation.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// Project → StudentSkillSummary (One-to-Many)
Project.hasMany(StudentSkillSummary, {
    foreignKey: 'projectId',
    as: 'skillSummaries'
});
StudentSkillSummary.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
});

// User (Student) → StudentSkillEvaluation (One-to-Many)
User.hasMany(StudentSkillEvaluation, {
    foreignKey: 'studentId',
    as: 'skillEvaluations'
});
StudentSkillEvaluation.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
});

// User (Student) → StudentSkillSummary (One-to-Many)
User.hasMany(StudentSkillSummary, {
    foreignKey: 'studentId',
    as: 'skillSummaries'
});
StudentSkillSummary.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student'
});

export {
    // Existing models
    User,
    Project,
    Task,
    Submission,
    Attendance,
    Notification,

    // BNCC models
    BnccGeneralCompetency,
    BnccDiscipline,
    BnccSkill,
    SkillGeneralCompetency,
    ProjectSkill,
    SkillIndicator,
    StudentSkillEvaluation,
    StudentSkillSummary,
    BnccNotification,
    StudentSkillShare,
    TheoreticalReference,
    StudentFeedback,
    EvaluationBenchmarks,
    TutorInteraction,
    Assignment,
    Class,
    Team,
    Rubrica,
    RubricaCriterio,
    RubricaNivel,
    AvaliacaoEquipe,
    AvaliacaoCriterio,

    sequelize
};

export default {
    User,
    Project,
    Task,
    Submission,
    Attendance,
    Notification,
    BnccGeneralCompetency,
    BnccDiscipline,
    BnccSkill,
    SkillGeneralCompetency,
    ProjectSkill,
    SkillIndicator,
    StudentSkillEvaluation,
    StudentSkillSummary,
    BnccNotification,
    StudentSkillShare,
    TheoreticalReference,
    StudentFeedback,
    EvaluationBenchmarks,
    TutorInteraction,
    Assignment,
    Class,
    Team,
    Rubrica,
    RubricaCriterio,
    RubricaNivel,
    AvaliacaoEquipe,
    AvaliacaoCriterio,
    sequelize
};
