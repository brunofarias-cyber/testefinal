'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // 1. Adicionar coluna criado_por_id em projects (se não existir)
        const projectsTable = await queryInterface.describeTable('projects');
        if (!projectsTable.criadoPorId) {
            await queryInterface.addColumn('projects', 'criadoPorId', {
                type: Sequelize.UUID,
                allowNull: true, // Permitir NULL inicialmente para migração
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'RESTRICT'
            });
        }

        // 2. Criar tabela project_collaborators
        await queryInterface.createTable('project_collaborators', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            projetoId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'projeto_id',
                references: {
                    model: 'projects',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            professorId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'professor_id',
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            adicionadoPorId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'adicionado_por_id',
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'RESTRICT'
            },
            status: {
                type: Sequelize.ENUM('ativo', 'pendente', 'recusado'),
                defaultValue: 'ativo'
            },
            papel: {
                type: Sequelize.ENUM('co-professor', 'avaliador', 'assistente'),
                defaultValue: 'co-professor'
            },
            adicionadoEm: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                field: 'adicionado_em'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        // Criar índices para project_collaborators
        await queryInterface.addIndex('project_collaborators', ['projeto_id'], {
            name: 'idx_project_collaborators_projeto'
        });
        await queryInterface.addIndex('project_collaborators', ['professor_id'], {
            name: 'idx_project_collaborators_professor'
        });
        await queryInterface.addIndex('project_collaborators', ['status'], {
            name: 'idx_project_collaborators_status'
        });

        // Constraint único
        await queryInterface.addConstraint('project_collaborators', {
            fields: ['projeto_id', 'professor_id'],
            type: 'unique',
            name: 'unique_projeto_professor'
        });

        // 3. Criar tabela project_invites
        await queryInterface.createTable('project_invites', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            projetoId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'projeto_id',
                references: {
                    model: 'projects',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            emailConvidado: {
                type: Sequelize.STRING(255),
                allowNull: false,
                field: 'email_convidado'
            },
            convidadoPorId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'convidado_por_id',
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'RESTRICT'
            },
            token: {
                type: Sequelize.STRING(255),
                unique: true,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('pendente', 'aceito', 'recusado', 'expirado'),
                defaultValue: 'pendente'
            },
            criadoEm: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                field: 'criado_em'
            },
            expiresAt: {
                type: Sequelize.DATE,
                allowNull: true,
                field: 'expires_at'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        // Criar índices para project_invites
        await queryInterface.addIndex('project_invites', ['projeto_id'], {
            name: 'idx_project_invites_projeto'
        });
        await queryInterface.addIndex('project_invites', ['email_convidado'], {
            name: 'idx_project_invites_email'
        });
        await queryInterface.addIndex('project_invites', ['token'], {
            name: 'idx_project_invites_token'
        });
        await queryInterface.addIndex('project_invites', ['status'], {
            name: 'idx_project_invites_status'
        });

        // 4. Criar tabela collaborator_permissions
        await queryInterface.createTable('collaborator_permissions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true
            },
            collaboratorId: {
                type: Sequelize.UUID,
                allowNull: false,
                field: 'collaborator_id',
                references: {
                    model: 'project_collaborators',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            permission: {
                type: Sequelize.ENUM(
                    'view_project',
                    'edit_project',
                    'evaluate_teams',
                    'add_collaborators',
                    'manage_rubrics',
                    'view_feedback',
                    'edit_feedback',
                    'export_data',
                    'delete_evaluations'
                ),
                allowNull: false
            },
            grantedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
                field: 'granted_at'
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });

        // Criar índices para collaborator_permissions
        await queryInterface.addIndex('collaborator_permissions', ['collaborator_id'], {
            name: 'idx_collaborator_permissions_collaborator'
        });

        // Constraint único
        await queryInterface.addConstraint('collaborator_permissions', {
            fields: ['collaborator_id', 'permission'],
            type: 'unique',
            name: 'unique_collaborator_permission'
        });

        console.log('✅ Co-Teaching tables created successfully!');
    },

    down: async (queryInterface, Sequelize) => {
        // Remover tabelas na ordem inversa
        await queryInterface.dropTable('collaborator_permissions');
        await queryInterface.dropTable('project_invites');
        await queryInterface.dropTable('project_collaborators');

        // Remover coluna de projects
        const projectsTable = await queryInterface.describeTable('projects');
        if (projectsTable.criadoPorId) {
            await queryInterface.removeColumn('projects', 'criadoPorId');
        }

        console.log('✅ Co-Teaching tables removed successfully!');
    }
};
