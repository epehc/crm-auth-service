 import {DataTypes, Model} from 'sequelize';
import sequelize from '../database/db'

 class User extends Model {}

 User.init(
     {
         id: {
             type: DataTypes.UUID,
             defaultValue: DataTypes.UUIDV4,
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
             defaultValue: ['user'],
         },
         google_id: {
             type: DataTypes.STRING,
         },
         password: {
             type: DataTypes.STRING,
         },
     },
     {
         sequelize,
         modelName: 'User',
         tableName: 'users',
         timestamps: true,
     }
 )

 export default User;