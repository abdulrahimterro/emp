"use strict";

const { hash } = require("bcrypt");
const uuid = require("uuid").v4;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurant = [
      {
        id: 2,
        en_name: "Alo_Chicken",
        ar_name: "الو تشكن",
        logo:
          "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.0-9/72901459_152113132828303_8882780370072764416_o.jpg?_nc_cat=105&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=avFfW0KJDikAX_2T5mq&_nc_ht=scontent-cdt1-1.xx&oh=614a4edd7d2c623454f00eb40a2f5b3c&oe=6080EE9D",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // password: AloPassword
    const password = await hash("AloPassword", 10);

    const users = [
      {
        id: 7,
        first_name: "restaurant",
        last_name: "owner",
        email: "owner@Alo.com",
        password,
        status: "active",
        phone: "+963938061161",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 1,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
      {
        id: 8,
        first_name: "manager",
        last_name: "manager",
        email: "manager@Alo.com",
        password,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 0,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
      {
        id: 9,
        first_name: "author",
        last_name: "author",
        email: "author@Alo.com",
        password,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 0,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
      {
        id: 10,
        first_name: "chef",
        last_name: "chef",
        email: "chef@Alo.com",
        password,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 0,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
      {
        id: 11,
        first_name: "accountant",
        last_name: "accountant",
        email: "accountant@Alo.com",
        password,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 0,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
      {
        id: 12,
        first_name: "waiter",
        last_name: "waiter",
        email: "waiter@Alo.com",
        password,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        verified: 1,
        is_super: 0,
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 2,
      },
    ];

    const menus = [
      {
        id: 2,
        en_name: "Main menu",
        ar_name: "القائمة الرئيسية",
        currency: "SYP",
        location: "in site",
        currency: "SYR",
        restaurant_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const tables = [];
    for (let i = 0; i < 10; i++) tables.push({ code: require("uuid").v4(), number: i + 1, restaurant_id: 2, menu_id: 2 });
    const userMenus = [];
    users.forEach((val) =>
      menus.forEach((v) => {
        userMenus.push({ user_id: val.id, menu_id: v.id });
      })
    );

    const categories = [
      {
        id: 3,
        en_name: "Sandwiches",
        ar_name: "سادندويتش",
        icon_id: 1,
        menu_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        en_name: "Meals",
        ar_name: "وجبات",
        icon_id: 1,
        menu_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const dishes = [
      {
        en_name: "francisco",
        ar_name: "فرانسيسكو",
        en_description: "Grilled chicken pieces with mushrooms, corn and cheese, with lettuce, potatoes and special sauce.",
        ar_description: "قطع دجاج مشوية مع فطر وذرة وجبنة مع الخس والبطاطا والصوص الخاص",
        code: "Alo01",
        price: 3000,
        discount: 0,
        status: "active",
        preparation_time: 15,
        calories: 250,
        restaurant_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "Zinger",
        ar_name: "زنجر",
        en_description: "Zinger sandwich has chicken layer ,egg layer and a veggie mayo layer.",
        ar_description: "طبقة دجاج وطبقة بيض وطبقة مايونيز",
        code: "Alo02",
        price: 2500,
        discount: 0,
        status: "active",
        preparation_time: 15,
        calories: 200,
        restaurant_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "filadelfia",
        ar_name: "فيلاديلفيا",
        en_description: "Grilled veal slices with pepper, corn, onion, potato, cheese and special sauce.",
        ar_description: "شرحات لحمة عجل مشوية مع فلفل وذرة وبصل وبطاطا وجبنة وصوص خاص",
        code: "Alo03",
        price: 4500,
        discount: 0,
        status: "active",
        preparation_time: 30,
        calories: 300,
        restaurant_id: 2,
        category_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "Fajita",
        ar_name: "غراند فاهيتا",
        en_description: "Grilled meat served as a taco on a flour or corn tortilla.",
        ar_description: "لحم مشوي مثل التاكو",
        code: "Alo04",
        price: 4500,
        discount: 0,
        status: "active",
        preparation_time: 10,
        calories: 100,
        restaurant_id: 2,
        category_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const dishImages = [
      {
        dish_id: 5,
        url: "https://www.seriouseats.com/images/2013/10/20130820-bite-me-sandwiches-san-francisco-1.jpg",
        default: true,
      },
      {
        dish_id: 5,
        url:
          "https://www.restaurantnews.com/wp-content/uploads/2019/04/San-Franciscos-Sandwich-King-Ikes-Love-Sandwiches-Going-National-feature.jpg",
        default: false,
      },
      {
        dish_id: 6,
        url: "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/74/6e/18/kfc-zinger-supreme-sandwich.jpg",
        default: true,
      },
      {
        dish_id: 6,
        url: "https://i.pinimg.com/originals/d1/3a/0a/d13a0af4b4be389da86f894ff27fd79e.png",
        default: false,
      },
      {
        dish_id: 7,
        url: "https://whatscookingamerica.net/wp-content/uploads/2015/03/PhiladelphiaCheeseSteak16.jpg",
        default: true,
      },
      {
        dish_id: 7,
        url: "https://valentinascorner.com/wp-content/uploads/2019/12/Philly-Cheese-Steak-3-1.jpg",
        default: false,
      },
      {
        dish_id: 8,
        url: "https://www.closetcooking.com/wp-content/uploads/2013/04/Chicken-Fajita-Grilled-Cheese-500-9047.jpg",
        default: true,
      },
      {
        dish_id: 8,
        url: "https://www.dinneratthezoo.com/wp-content/uploads/2015/10/fajita-chicken-cheesesteak-sandwiches-4-683x1024.jpg",
        default: false,
      },
    ];

    const userPermission = [
      { permission_id: 1, user_id: 7 },
      { permission_id: 2, user_id: 8 },
      { permission_id: 3, user_id: 9 },
      { permission_id: 4, user_id: 10 },
      { permission_id: 5, user_id: 11 },
      { permission_id: 6, user_id: 12 },
    ];

    const restaurantsSubscriptions = [
      {
        status: "active",
        price: 100,
        restaurant_id: 2,
        subscription_id: 3,
        payment_method: "free",
        created_at: "2021-01-01",
        expire_at: "2021-03-05",
      },
      {
        status: "active",
        price: 100,
        restaurant_id: 2,
        subscription_id: 3,
        payment_method: "free",
        created_at: new Date(),
        expire_at: "2021-08-05",
      },
    ];

    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert("restaurants", restaurant, { transaction });
      await queryInterface.bulkInsert("users", users, { transaction });
      await queryInterface.bulkInsert("menus", menus, { transaction });
      await queryInterface.bulkInsert("tables", tables, { transaction });
      await queryInterface.bulkInsert("categories", categories, { transaction });
      await queryInterface.bulkInsert("dishes", dishes, { transaction });
      await queryInterface.bulkInsert("user_permission", userPermission, { transaction });
      await queryInterface.bulkInsert("user_menu", userMenus, { transaction });
      await queryInterface.bulkInsert("restaurants_subscriptions", restaurantsSubscriptions, { transaction });
    });
    await queryInterface.bulkInsert("dish_images", dishImages);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("restaurants");
    await queryInterface.bulkDelete("users");
    await queryInterface.bulkDelete("menus");
    await queryInterface.bulkDelete("tables");
    await queryInterface.bulkDelete("categories");
    await queryInterface.bulkDelete("dishes");
    await queryInterface.bulkDelete("user_permission");
  },
};
