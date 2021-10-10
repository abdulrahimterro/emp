"use strict";

const { hash } = require("bcrypt");
const uuid = require("uuid").v4;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const restaurant = [
      {
        id: 1,
        en_name: "Dominos",
        ar_name: "دومينوز",
        logo: "https://i.pinimg.com/originals/04/83/d1/0483d14533e9d19e635923cdc21ee439.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    // password: domPassword
    const password = await hash("domPassword", 10);
    const users = [
      {
        id: 1,
        first_name: "restaurant",
        last_name: "owner",
        email: "owner@dominos.com",
        password,
        verified: 1,
        is_super: 1,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
      {
        id: 2,
        first_name: "manager",
        last_name: "manager",
        email: "manager@dominos.com",
        password,
        verified: 1,
        is_super: 0,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
      {
        id: 3,
        first_name: "author",
        last_name: "author",
        email: "author@dominos.com",
        password,
        verified: 1,
        is_super: 0,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
      {
        id: 4,
        first_name: "chef",
        last_name: "chef",
        email: "chef@dominos.com",
        password,
        verified: 1,
        is_super: 0,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
      {
        id: 5,
        first_name: "accountant",
        last_name: "accountant",
        email: "accountant@dominos.com",
        password,
        verified: 1,
        is_super: 0,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
      {
        id: 6,
        first_name: "waiter",
        last_name: "waiter",
        email: "waiter@dominos.com",
        password,
        verified: 1,
        is_super: 0,
        status: "active",
        phone: "+963962213470",
        birth_date: "1997/04/10",
        verify_code: uuid(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: 1,
      },
    ];

    const menus = [
      {
        id: 1,
        en_name: "Main menu",
        ar_name: "القائمة الرئيسية",
        currency: "SYP",
        location: "in site",
        currency: "SYR",
        restaurant_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const tables = [];
    for (let i = 0; i < 10; i++) tables.push({ code: require("uuid").v4(), number: i + 1, restaurant_id: 1, menu_id: 1 });
    const userMenus = [];
    users.forEach((val) =>
      menus.forEach((v) => {
        userMenus.push({ user_id: val.id, menu_id: v.id });
      })
    );

    const categories = [
      {
        id: 1,
        en_name: "Sandwiches",
        ar_name: "سادندويتش",
        icon_id: 1,
        menu_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        en_name: "Meals",
        ar_name: "وجبات",
        icon_id: 1,
        menu_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const dishes = [
      {
        en_name: "Santa Fe",
        ar_name: "سانتافيه",
        en_description: "These Santa Fe Sandwiches are a quick and easy way to make your next lunch hour something special.",
        ar_description: "سريعة التحضير",
        code: "santaFe01",
        price: 3000,
        discount: 0.15,
        status: "active",
        preparation_time: 15,
        calories: 35,
        restaurant_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "Zinger",
        ar_name: "زنجر",
        en_description:
          "Zinger sandwich has chicken layer ,egg layer and a veggie mayo layer..that makes a wholesome meal for breakfast.",
        ar_description: "طبقة دجاج وطبقة بيض وطبقة مايونيز",
        code: "zinger01",
        price: 3000,
        discount: 0,
        status: "active",
        preparation_time: 15,
        calories: 45,
        restaurant_id: 1,
        category_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "Chitza",
        ar_name: "تشيتزا",
        en_description: "Chicken + Pizza.",
        ar_description: "نص بيتزا ونص جاج",
        code: "chitza01",
        price: 4500,
        discount: 0,
        status: "active",
        preparation_time: 20,
        calories: 100,
        restaurant_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        en_name: "Grande Fajita",
        ar_name: "غراند فاهيتا",
        en_description: "Grilled meat served as a taco on a flour or corn tortilla.",
        ar_description: "لحم مشوي مثل التاكو",
        code: "fajita01",
        price: 4500,
        discount: 0,
        status: "active",
        preparation_time: 10,
        calories: 100,
        restaurant_id: 1,
        category_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    const dishImages = [
      {
        dish_id: 1,
        url: "https://carlsjr.com/-/media/project/cke/carlsjr/products/chicken/cj_site_705x742_santafechicken_sandwich.jpg",
        default: true,
      },
      {
        dish_id: 1,
        url: "https://www.tasteandtellblog.com/wp-content/uploads/2020/02/Santa-Fe-Grilled-Chicken-Sandwich-1-600x480.jpg",
        default: false,
      },
      {
        dish_id: 2,
        url: "https://i.pinimg.com/originals/d1/3a/0a/d13a0af4b4be389da86f894ff27fd79e.png",
        default: true,
      },
      {
        dish_id: 2,
        url: "https://media-cdn.tripadvisor.com/media/photo-m/1280/13/74/6e/18/kfc-zinger-supreme-sandwich.jpg",
        default: false,
      },
      {
        dish_id: 3,
        url: "https://www.budgetbytes.com/wp-content/uploads/2020/06/BBQ-Chicken-Pizza-one-slice.jpg",
        default: true,
      },
      { dish_id: 3, url: "https://recipe-graphics.grocerywebsite.com/0_GraphicsRecipes/8164_4k.jpg", default: false },
      {
        dish_id: 4,
        url: "https://keviniscooking.com/wp-content/uploads/2018/07/Grilled-Steak-Fajitas-square.jpg",
        default: true,
      },
      {
        dish_id: 4,
        url: "https://irepo.primecp.com/2016/12/312667/Grande-Chicken-Fajitas_MASTER_ID-2024669.jpg?v=2024669",
        default: false,
      },
    ];

    const userPermission = [
      { permission_id: 1, user_id: 1 },
      { permission_id: 2, user_id: 2 },
      { permission_id: 3, user_id: 3 },
      { permission_id: 4, user_id: 4 },
      { permission_id: 5, user_id: 5 },
      { permission_id: 6, user_id: 6 },
    ];

    const restaurantsSubscriptions = [
      {
        status: "active",
        price: 100,
        restaurant_id: 1,
        subscription_id: 3,
        payment_method: "free",
        created_at: "2021-01-01",
        expire_at: "2021-03-05",
      },
      {
        status: "active",
        price: 100,
        restaurant_id: 1,
        subscription_id: 4,
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
