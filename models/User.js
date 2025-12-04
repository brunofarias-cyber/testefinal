import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            lowercase: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            set(value) {
                const salt = bcrypt.genSaltSync(10);
                this.setDataValue('password', bcrypt.hashSync(value, salt));
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('student', 'teacher', 'coordinator'),
            defaultValue: 'student',
            allowNull: false
        },
        school: {
            type: DataTypes.STRING
        },
        class: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING,
            defaultValue: null
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        googleRefreshToken: {
            type: DataTypes.TEXT,
        },
        lastSyncAt: {
            type: DataTypes.DATE,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: true,
        tableName: 'users',
        hooks: {
            beforeSave: (user) => {
                user.email = user.email.toLowerCase();
            }
        }
    });

    // Método para comparar senhas
    User.prototype.validPassword = function (password) {
        return bcrypt.compareSync(password, this.password);
    };

    // Não retornar senha em toJSON
    User.prototype.toJSON = function () {
        const values = Object.assign({}, this.get());
        delete values.password;
        return values;
    };

    return User;
};
