"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const subscriptions = [
      {
        id: 1,
        en_name: "free",
        ar_name: "مجاني",
        duration: 14,
        duration_unit: "days",
        price: 0,
        discount: 0,
        en_description:
          "Multiple interactive menu, full description of products with pictures, easy and direct updating of menus, order management, the ability to upload and display the restaurant's logo, customer service, and more future services",
        ar_description:
          "قائمة طعام تفاعلية و متعددة ، وصف كامل للمنتجات مع صور ، تحديث سهل ومباشر للقوائم ، إدارة الطلبات ، إمكانية رفع وإظهار لوغو خاص بالمطعم ، خدمة العملاء ، والمزيد من الخدمات المستقبلية",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        en_name: "Basic",
        ar_name: "أساسي",
        duration: 1,
        duration_unit: "months",
        price: 149,
        discount: 0,
        en_description:
          "Multiple interactive menu, full description of products with pictures, easy and direct updating of menus, order management, the ability to upload and display the restaurant's logo, customer service, and more future services",
        ar_description:
          "قائمة طعام تفاعلية و متعددة ، وصف كامل للمنتجات مع صور ، تحديث سهل ومباشر للقوائم ، إدارة الطلبات ، إمكانية رفع وإظهار لوغو خاص بالمطعم ، خدمة العملاء ، والمزيد من الخدمات المستقبلية",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        en_name: "Basic",
        ar_name: "أساسي",
        duration: 3,
        duration_unit: "months",
        price: 447,
        discount: 15,
        en_description:
          "Multiple interactive menu, full description of products with pictures, easy and direct updating of menus, order management, the ability to upload and display the restaurant's logo, customer service, and more future services",
        ar_description:
          "قائمة طعام تفاعلية و متعددة ، وصف كامل للمنتجات مع صور ، تحديث سهل ومباشر للقوائم ، إدارة الطلبات ، إمكانية رفع وإظهار لوغو خاص بالمطعم ، خدمة العملاء ، والمزيد من الخدمات المستقبلية",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        en_name: "Basic",
        ar_name: "أساسي",
        duration: 1,
        duration_unit: "year",
        price: 1788,
        discount: 20,
        en_description:
          "Multiple interactive menu, full description of products with pictures, easy and direct updating of menus, order management, the ability to upload and display the restaurant's logo, customer service, and more future services",
        ar_description:
          "قائمة طعام تفاعلية و متعددة ، وصف كامل للمنتجات مع صور ، تحديث سهل ومباشر للقوائم ، إدارة الطلبات ، إمكانية رفع وإظهار لوغو خاص بالمطعم ، خدمة العملاء ، والمزيد من الخدمات المستقبلية",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert("subscriptions", subscriptions);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("subscriptions");
  },
};
