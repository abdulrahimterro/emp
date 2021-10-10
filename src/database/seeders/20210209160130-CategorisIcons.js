"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const icons = [
      {
        id: 1,
        en_name: "french fries",
        ar_name: "بطاطس مقلية",
        url: "http://brandsmenu.com/api/assets/category/icons/french-fries.svg",
      },
      {
        id: 2,
        en_name: "chicken leg",
        ar_name: "أجنحة دجاج",
        url: "http://brandsmenu.com/api/assets/category/icons/chicken-leg.svg",
      },
      {
        id: 3,
        en_name: "burger",
        ar_name: "برغر",
        url: "http://brandsmenu.com/api/assets/category/icons/burger.svg",
      },
      {
        id: 4,
        en_name: "roast chicken",
        ar_name: "دجاج مقرمش",
        url: "http://brandsmenu.com/api/assets/category/icons/roast-chicken.svg",
      },
      {
        id: 5,
        en_name: "hot dog",
        ar_name: "نقانق",
        url: "http://brandsmenu.com/api/assets/category/icons/hot-dog.svg",
      },
      {
        id: 6,
        en_name: "noodles",
        ar_name: "حساء نودلز",
        url: "http://brandsmenu.com/api/assets/category/icons/noodles.svg",
      },
      {
        id: 7,
        en_name: "baguette",
        ar_name: "رغيف الخبز الفرنسي",
        url: "http://brandsmenu.com/api/assets/category/icons/baguette.svg",
      },
      { id: 8, en_name: "pizza", ar_name: "بيتزا", url: "http://brandsmenu.com/api/assets/category/icons/pizza.svg" },
      { id: 9, en_name: "taco", ar_name: "تاكو", url: "http://brandsmenu.com/api/assets/category/icons/taco.svg" },
      { id: 10, en_name: "donut", ar_name: "دونات", url: "http://brandsmenu.com/api/assets/category/icons/donut.svg" },
      { id: 11, en_name: "sushi", ar_name: "سوشي", url: "http://brandsmenu.com/api/assets/category/icons/sushi.svg" },
      { id: 12, en_name: "rice", ar_name: "ارز", url: "http://brandsmenu.com/api/assets/category/icons/rice.svg" },
      {
        id: 13,
        en_name: "pancakes",
        ar_name: "فطائر محلاة",
        url: "http://brandsmenu.com/api/assets/category/icons/pancakes.svg",
      },
      { id: 14, en_name: "steak", ar_name: "ستيك اللحم", url: "http://brandsmenu.com/api/assets/category/icons/steak.svg" },
      {
        id: 15,
        en_name: "ice cream",
        ar_name: "مثلجات",
        url: "http://brandsmenu.com/api/assets/category/icons/ice-cream.svg",
      },
      { id: 16, en_name: "coffee", ar_name: "قهوة", url: "http://brandsmenu.com/api/assets/category/icons/coffee.svg" },
      { id: 17, en_name: "Prawn", ar_name: "روبيان", url: "http://brandsmenu.com/api/assets/category/icons/Prawn.svg" },
      { id: 18, en_name: "tea", ar_name: "شاي", url: "http://brandsmenu.com/api/assets/category/icons/tea.svg" },
      {
        id: 19,
        en_name: "milkshake",
        ar_name: "مخفوق الحليب",
        url: "http://brandsmenu.com/api/assets/category/icons/milkshake.svg",
      },
      { id: 20, en_name: "cupcake", ar_name: "كاب كيك", url: "http://brandsmenu.com/api/assets/category/icons/cupcake.svg" },
    ];

    await queryInterface.bulkInsert("category_icons", icons);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("category_icons");
  },
};
