const { assetsPath } = require("../../../configs");
const { Exception, errors, fileUtil } = require("../../utils");
const sequelize = require("../../database");
const { Op, literal } = require("sequelize");

const db = sequelize.models;

class Employee {
  constructor(data) {
    this.name = data.name;
    this.status = data.status;
    this.position = data.position;
    this.bonus = data.bonus;
    this.bonus_percent = data.bonus_percent;
    this.bonus_from = data.bonus_from;
    this.salary = data.salary;
    this.salaryPerHour = data.salaryPerHour;
    this.salaryOverTimePerHour = data.salaryOverTimePerHour;
    this.nationality = data.nationality;
    this.dob = data.dob;
    this.telephone = data.telephone;
    this.mobile = data.mobile;
    this.email = data.email;
    this.sex = data.sex;
    this.emp_type = data.emp_type;
    this.joining_date = data.joining_date;
    this.visa_status = data.visa_status;
    this.visa_expiry = data.visa_expiry;
    this.passport_no = data.passport_no;
    this.passport_issue = data.passport_issue;
    this.passport_expiry = data.passport_expiry;
    this.labor_cardno = data.labor_cardno;
    this.labor_issue = data.labor_issue;
    this.labor_expiry = data.labor_expiry;
    this.remind_before = data.remind_before;
    this.created_by = data.created_by;
    this.created_date = data.created_date;
    this.EmployeeCard_No = data.EmployeeCard_No;
    this.Commission_Collected_Invoice_Flag = data.Commission_Collected_Invoice_Flag;
    this.Opening_Balance = data.Opening_Balance;
    this.Opening_Balance_Date = data.Opening_Balance_Date;
    this.Department_Id = data.Department_Id;
    this.IsCoordinator = data.IsCoordinator;
    this.IsManager = data.IsManager;
    this.FAV = data.FAV;
    this.photo = data.photo ? null : undefined;
  }

  async create(user, file) {
    return await sequelize.transaction(async (transaction) => {
      this.created_by = user.name;

      if (file) this.photo = fileUtil.uri(assetsPath.employee.photo, file);

      const employee = await db.Employee.create(this);

      if (file) await fileUtil.save(this.image, file.buffer);

      return { data: { id: employee.id } };
    });
  }

  async update(user, id, file) {
    await sequelize.transaction(async (transaction) => {
      const employee = await db.Employee.findOne({ where: { id } });
      if (!employee) throw new Exception(errors.Menu_Not_Found);

      if (file) this.photo = fileUtil.uri(assetsPath.employee.photo, file);

      await db.Employee.update(this, { where: { id } });
      if ((this.photo || this.photo === null) && employee.photo) await fileUtil.delete(employee.photo);
      if (file) await fileUtil.save(this.photo, file.buffer);
    });
  }

  static async delete(user, id) {
    await sequelize.transaction(async (transaction) => {

      let categoryIds = await db.Category.findAll({ attributes: ["id"], where: { menuId: id } });
      categoryIds = categoryIds.map((val) => val.id);

      const employee = await db.Employee.destroy({ where: { id, restaurantId: user.restaurantId } });
      if (!employee) throw new Exception(errors.Menu_Not_Found);
    });
  }

  static async getById(user, id, lang) {

    const scope = user ? {} : { method: ["localization", { lang, exclude }] };
    const userConditions = user ? { restaurantId: user.restaurantId } : {};

    let result = await db.Menu.scope(scope).findOne({
      attributes: {
        exclude,
        include: [[literal("(SELECT COUNT(tables.id) FROM tables WHERE tables.menu_id = Menu.id)"), "tablesCount"]],
      },
      where: { id, ...userConditions },
      include: [
        {
          model: db.Category.scope({ method: ["localization", { lang, exclude }] }),
          include: db.CategoryIcon.scope({ method: ["localization", { lang }] }),
        },
      ],
    });
    if (!result) throw new Exception(errors.Menu_Not_Found);
    return { data: result };
  }

  static async getAll(user, filters, { offset, limit, total }, lang) {
    const exclude = ["restaurantId", "image", "location", "currency", "createdAt", "updatedAt", "deletedAt"];
    const conditions = (() => {
      const result = user ? { restaurantId: user.restaurantId, id: user.menus } : {};

      if (filters.name) conditions[`${lang}Name`] = { [Op.like]: `%${filters.name}%` };
      if (filters.restaurantId) conditions["restaurantId"] = filters.restaurantId;

      return result;
    })();

    const query = { attributes: { exclude }, where: conditions, offset, limit };

    const result = await db.Menu.scope({ method: ["localization", { lang, exclude }] }).customFind(query, total);
    return result;
  }

  static async getTables(user, id) {
    const result = await db.Table.findAll({
      attributes: ["code", "number"],
      where: { restaurantId: user.restaurantId, menuId: id },
      order: [["number", "asc"]],
    });
    return { data: result };
  }
}

module.exports = Employee;
