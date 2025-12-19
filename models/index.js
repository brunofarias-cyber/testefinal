import sequelize from '../config/database.js';
import { UserModel } from './User.js';
import { ProjectModel } from './Project.js';
import { TaskModel } from './Task.js';
import { SubmissionModel } from './Submission.js';
import { AttendanceModel } from './Attendance.js';
import { NotificationModel } from './Notification.js';
import { OAuthTokenModel } from './OAuthToken.js';
import { GradeModel } from './Grade.js';

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
import { TeamMessageModel } from './TeamMessage.js';
import RubricaModel from './Rubrica.js';
import RubricaCriterioModel from './RubricaCriterio.js';
import RubricaNivelModel from './RubricaNivel.js';
import AvaliacaoEquipeModel from './AvaliacaoEquipe.js';
import AvaliacaoCriterioModel from './AvaliacaoCriterio.js';

// Co-Teaching Models
import { ProjectCollaboratorModel } from './ProjectCollaborator.js';
import { ProjectInviteModel } from './ProjectInvite.js';
import { CollaboratorPermissionModel } from './CollaboratorPermission.js';

// Inicializar models antigos
const User = UserModel(sequelize);
const Project = ProjectModel(sequelize);
const Task = TaskModel(sequelize);
const Submission = SubmissionModel(sequelize);
const Attendance = AttendanceModel(sequelize);
const Notification = NotificationModel(sequelize);
const OAuthToken = OAuthTokenModel(sequelize);
const Grade = GradeModel(sequelize);
const TheoreticalReference = TheoreticalReferenceModel(sequelize);
const StudentFeedback = StudentFeedbackModel(sequelize);
const EvaluationBenchmarks = EvaluationBenchmarksModel(sequelize);
const TutorInteraction = TutorInteractionModel(sequelize);
const Assignment = AssignmentModel(sequelize);
const Class = ClassModel(sequelize);
const Team = TeamModel(sequelize);
const TeamMessage = TeamMessageModel(sequelize);
const Rubrica = RubricaModel(sequelize);
const RubricaCriterio = RubricaCriterioModel(sequelize);
const RubricaNivel = RubricaNivelModel(sequelize);
const AvaliacaoEquipe = AvaliacaoEquipeModel(sequelize);
const AvaliacaoCriterio = AvaliacaoCriterioModel(sequelize);

const ProjectCollaborator = ProjectCollaboratorModel(sequelize);
const ProjectInvite = ProjectInviteModel(sequelize);
const CollaboratorPermission = CollaboratorPermissionModel(sequelize);

// ==========================================
// ASSOCIAÇÕES EXISTENTES
// ==========================================

User.hasMany(Project, { foreignKey: 'teacherId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });
// Alias para compatibilidade com a semântica "criadoPor"
Project.belongsTo(User, { foreignKey: 'teacherId', as: 'criadoPor' });

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

// Grade associations
User.hasMany(Grade, { foreignKey: 'studentId', as: 'gradesReceived' });
Grade.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Grade, { foreignKey: 'teacherId', as: 'gradesGiven' });
Grade.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

Project.hasMany(Grade, { foreignKey: 'projectId', as: 'grades' });
Grade.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

Project.hasMany(Notification, { foreignKey: 'relatedProjectId', as: 'notifications' });
Notification.belongsTo(Project, { foreignKey: 'relatedProjectId', as: 'project' });

// ==========================================
// ASSOCIAÇÕES CO-TEACHING
// ==========================================

// Project <-> ProjectCollaborator
Project.hasMany(ProjectCollaborator, { foreignKey: 'projectId', as: 'collaborators' });
ProjectCollaborator.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User <-> ProjectCollaborator (Professor)
User.hasMany(ProjectCollaborator, { foreignKey: 'professorId', as: 'collaborations' });
ProjectCollaborator.belongsTo(User, { foreignKey: 'professorId', as: 'professor' });

// User <-> ProjectCollaborator (Added By)
User.hasMany(ProjectCollaborator, { foreignKey: 'addedById', as: 'collaboratorsAdded' });
ProjectCollaborator.belongsTo(User, { foreignKey: 'addedById', as: 'addedBy' });

// ProjectInvite Relations
Project.hasMany(ProjectInvite, { foreignKey: 'projectId', as: 'invites' });
ProjectInvite.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(ProjectInvite, { foreignKey: 'invitedById', as: 'sentInvites' });
ProjectInvite.belongsTo(User, { foreignKey: 'invitedById', as: 'invitedBy' });

// CollaboratorPermission Relations
ProjectCollaborator.hasMany(CollaboratorPermission, { foreignKey: 'collaboratorId', as: 'permissions' });
CollaboratorPermission.belongsTo(ProjectCollaborator, { foreignKey: 'collaboratorId', as: 'collaborator' });

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
    OAuthToken,

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
    ProjectCollaborator,
    ProjectInvite,
    CollaboratorPermission,

    sequelize
};

export default {
    User,
    Project,
    Task,
    Submission,
    Attendance,
    Notification,
    OAuthToken,
    Grade,
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
    TeamMessage,
    Rubrica,
    RubricaCriterio,
    RubricaNivel,
    AvaliacaoEquipe,
    AvaliacaoCriterio,
    ProjectCollaborator,
    ProjectInvite,
    CollaboratorPermission,
    sequelize
};
