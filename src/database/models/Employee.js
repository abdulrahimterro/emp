const { DataTypes } = require("sequelize");
const { BaseModel } = require("./embedded");
const sequelize = require("../sequelize");

class Employee extends BaseModel {
    static initialize() {
        Employee.init(
            {
                name: { type: DataTypes.STRING(150), allowNull: false },
                status: { type: DataTypes.STRING(50), allowNull: false },
                position: { type: DataTypes.STRING(150), allowNull: false },
                bonus: { type: DataTypes.STRING(50), allowNull: true },
                bonus_percent: { type: DataTypes.STRING(50), allowNull: true },
                bonus_from: { type: DataTypes.STRING(50), allowNull: true },
                salary: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
                salaryPerHour: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
                salaryOverTimePerHour: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
                nationality: { type: DataTypes.STRING(100), allowNull: true },
                dob: { type: DataTypes.DATE(), allowNull: true },
                telephone: { type: DataTypes.STRING(100), allowNull: true },
                mobile: { type: DataTypes.STRING(100), allowNull: true },
                email: { type: DataTypes.STRING(100), allowNull: true },
                sex: { type: DataTypes.STRING(100), allowNull: true },
                emp_type: { type: DataTypes.STRING(100), allowNull: true },
                joining_date: { type: DataTypes.DATE(), allowNull: true },
                visa_status: { type: DataTypes.STRING(100), allowNull: true },
                visa_expiry: { type: DataTypes.DATE(), allowNull: true },
                passport_no: { type: DataTypes.STRING(100), allowNull: true },
                passport_issue: { type: DataTypes.DATE(), allowNull: true },
                passport_expiry: { type: DataTypes.DATE(), allowNull: true },
                labor_cardno: { type: DataTypes.STRING(100), allowNull: true },
                labor_issue: { type: DataTypes.DATE(), allowNull: true },
                labor_expiry: { type: DataTypes.DATE(), allowNull: true },
                remind_before: { type: DataTypes.BIGINT(), allowNull: true },
                photo: 'VARBINARY(MAX)',
                created_by: { type: DataTypes.STRING(50), allowNull: true },
                created_date: { type: DataTypes.DATE(), allowNull: true },
                EmployeeCard_No: { type: DataTypes.STRING(50), allowNull: true },
                Commission_Collected_Invoice_Flag: { type: DataTypes.BOOLEAN(), allowNull: true },
                Opening_Balance: { type: DataTypes.DECIMAL(18, 2), allowNull: true },
                Opening_Balance_Date: { type: DataTypes.DATE(), allowNull: true },
                Department_Id: { type: DataTypes.BIGINT(), allowNull: true },
                IsCoordinator: { type: DataTypes.BOOLEAN(), allowNull: true },
                IsManager: { type: DataTypes.BOOLEAN(), allowNull: true },
                FAV: { type: DataTypes.BOOLEAN(), allowNull: true },

            },
            {
                sequelize,
                timestamps: false,
                name: { singular: "Employee", plural: "Employee" },
                underscored: true,
            }
        );
    }
    static associate() { }
}

module.exports = Employee;
