 import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db'
 import {UserRole} from "@epehc/sharedutilities/enums/userRole";


 class Usuario extends Model {
     public id!: string;
     public name!: string;
     public email!: string;
     public roles!: UserRole[];
     public google_id!: string;
 }

 Usuario.init(
     {
         id: {
             type: DataTypes.STRING,
             primaryKey: true,
         },
         name: {
             type: DataTypes.STRING,
             allowNull: false,
         },
         email: {
             type: DataTypes.STRING,
             allowNull: false,
             unique: true,
         },
         roles: {
             type: DataTypes.ARRAY(DataTypes.STRING),
             defaultValue: [UserRole.Admin, UserRole.Reclutador],
         },
         createdAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
         },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: new Date(),
        },
     },
     {
         sequelize,
         modelName: 'Usuario',
         tableName: 'users',
         timestamps: true,
     }
 )

 export default Usuario;