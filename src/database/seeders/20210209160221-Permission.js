"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const permissions = [
      { id: 1, ar_role: "مالك", en_role: "owner", icon: "http://brandsmenu.com/api/assets/permission/owner.svg" },
      { id: 2, ar_role: "مدير", en_role: "manager", icon: "http://brandsmenu.com/api/assets/permission/maneger.svg" },
      { id: 3, ar_role: "مؤلف", en_role: "author", icon: "http://brandsmenu.com/api/assets/permission/author.svg" },
      { id: 4, ar_role: "طاهي", en_role: "chef", icon: "http://brandsmenu.com/api/assets/permission/chief.svg" },
      { id: 5, ar_role: "محاسب", en_role: "accountant", icon: "http://brandsmenu.com/api/assets/permission/accountant.svg" },
      { id: 6, ar_role: "نادل", en_role: "waiter", icon: "http://brandsmenu.com/api/assets/permission/waiter.svg" },
    ];
    await queryInterface.bulkInsert("permissions", permissions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("permissions");
  },
};
