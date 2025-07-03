    import { DataTypes } from 'sequelize'
    import sequelize from '../config/db.js'

    const Contract = sequelize.define('contract', {
        id_contra: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            allowNull: false
        },
        price: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        date_contra: {
            type: DataTypes.DATE,
            allowNull: false
        },
        details: {
            type: DataTypes.STRING,
            allowNull: false
        },
        provider: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    },  {
        tableName: 'contract',
        timestamps: false
    });

    

    export default Contract;