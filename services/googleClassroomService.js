import { google } from 'googleapis';
import db from '../models/index.js';

const classroom = google.classroom('v1');

/**
 * Autentica com Google Classroom
 */
async function authenticateGoogleClassroom(refreshToken) {
    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_CALLBACK_URL
        );

        oauth2Client.setCredentials({ refresh_token: refreshToken });

        return oauth2Client;
    } catch (error) {
        console.error('Erro autenticação Google:', error);
        throw error;
    }
}

/**
 * Sincroniza turmas do Google Classroom
 */
async function syncClassrooms(userId, refreshToken) {
    try {
        const auth = await authenticateGoogleClassroom(refreshToken);

        const response = await classroom.courses.list({
            auth,
            pageSize: 10,
        });

        const courses = response.data.courses || [];
        const syncedClasses = [];

        for (const course of courses) {
            // Note: Class model needs to be created
            // Using a simple approach for now - could store in Project or separate Class table
            const classData = {
                name: course.name,
                description: course.description,
                googleId: course.id,
                section: course.section,
                room: course.room,
                ownerId: userId,
            };

            syncedClasses.push(classData);

            // Sincronizar alunos
            await syncStudentsFromClassroom(auth, course.id, userId);
        }

        return syncedClasses;
    } catch (error) {
        console.error('Erro sincronização:', error);
        throw error;
    }
}

/**
 * Sincroniza alunos de uma turma
 */
async function syncStudentsFromClassroom(auth, courseId, ownerId) {
    try {
        const response = await classroom.courses.students.list({
            auth,
            courseId,
            pageSize: 30,
        });

        const students = response.data.students || [];

        for (const student of students) {
            await db.User.findOrCreate({
                where: { email: student.profile.emailAddress },
                defaults: {
                    name: student.profile.name.fullName,
                    email: student.profile.emailAddress,
                    role: 'student',
                    password: 'google-auth', // Placeholder - should use OAuth
                },
            });
        }
    } catch (error) {
        console.error('Erro sincronização alunos:', error);
    }
}

/**
 * Sincroniza tarefas/trabalhos do Google Classroom
 */
async function syncAssignments(auth, courseId, projectId) {
    try {
        const response = await classroom.courses.courseWork.list({
            auth,
            courseId,
            pageSize: 20,
        });

        const works = response.data.courseWork || [];

        for (const work of works) {
            // Using Task model as it's the closest match
            await db.Task.findOrCreate({
                where: { title: work.title, projectId },
                defaults: {
                    title: work.title,
                    description: work.description || '',
                    dueDate: work.dueDate ? new Date(work.dueDate) : null,
                    projectId,
                    status: 'todo',
                    priority: 'normal',
                },
            });
        }
    } catch (error) {
        console.error('Erro sincronização tarefas:', error);
    }
}

/**
 * Sincroniza envios de tarefas (submissions)
 */
async function syncSubmissions(auth, courseId, courseWorkId, projectId) {
    try {
        const response = await classroom.courses.courseWork.studentSubmissions.list({
            auth,
            courseId,
            courseWorkId,
            pageSize: 30,
        });

        const submissions = response.data.studentSubmissions || [];

        for (const submission of submissions) {
            const googleStudent = await db.User.findOne({
                where: {
                    email: submission.userId,
                    role: 'student'
                },
            });

            if (googleStudent) {
                await db.Submission.findOrCreate({
                    where: {
                        studentId: googleStudent.id,
                        projectId
                    },
                    defaults: {
                        studentId: googleStudent.id,
                        projectId,
                        fileUrl: extractSubmissionContent(submission),
                        comment: `Sincronizado do Google Classroom`,
                        submittedAt: submission.updateTime
                            ? new Date(submission.updateTime)
                            : new Date(),
                    },
                });
            }
        }
    } catch (error) {
        console.error('Erro sincronização envios:', error);
    }
}

/**
 * Extrai conteúdo do envio
 */
function extractSubmissionContent(submission) {
    const attachments = submission.assignmentSubmission?.attachments || [];
    const content = attachments
        .map(a => `${a.driveFile?.title || 'Anexo'}`)
        .join(', ');

    return content || 'Envio sem anexos';
}

/**
 * Envia feedback para Google Classroom
 */
async function sendFeedbackToClassroom(
    auth,
    courseId,
    courseWorkId,
    submissionId,
    feedback,
    grade
) {
    try {
        await classroom.courses.courseWork.studentSubmissions.patch({
            auth,
            courseId,
            courseWorkId,
            id: submissionId,
            updateMask: 'assignedGrade,draftGrade',
            requestBody: {
                assignedGrade: grade || 100,
                draftGrade: grade || 100,
            },
        });

        // Adicionar comentário com feedback
        await classroom.courses.courseWork.studentSubmissions.modifyAttachments({
            auth,
            courseId,
            courseWorkId,
            id: submissionId,
            requestBody: {
                addAttachments: [
                    {
                        link: {
                            title: 'Feedback BProjetos',
                            url: feedback,
                        },
                    },
                ],
            },
        });

        return { success: true };
    } catch (error) {
        console.error('Erro envio feedback:', error);
        throw error;
    }
}

/**
 * Cria anúncio no Google Classroom
 */
async function createAnnouncement(auth, courseId, title, text) {
    try {
        const response = await classroom.courses.announcements.create({
            auth,
            courseId,
            requestBody: {
                text: `${title}\n\n${text}`,
                state: 'PUBLISHED',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Erro criar anúncio:', error);
        throw error;
    }
}


export {
    authenticateGoogleClassroom,
    syncClassrooms,
    syncStudentsFromClassroom,
    syncAssignments,
    syncSubmissions,
    sendFeedbackToClassroom,
    createAnnouncement,
};
