const httpCodes = require("./http-codes");
const statusCodes = require("./status-codes");
const models = {
  allergy: "10",
  category: "11",
  categoryIcon: "12",
  client: "13",
  dish: "14",
  dishImage: "15",
  menu: "16",
  order: "17",
  payment: "18",
  restaurant: "19",
  restaurantSubscription: "20",
  subscription: "21",
  table: "22",
  user: "23",
  userInvite: "24",
  permission: "25",
};

module.exports = {
  ...require("./general-errors"),
  // Allergy errors
  Allergy_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.allergy + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Allergy not found.",
  },
  // UserInvite errors
  InviteToken_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.userInvite + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Invite token not found.",
  },
  // Category errors
  Category_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.category + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Category not found.",
  },
  // CategoryIcon errors
  CategoryIcon_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.categoryIcon + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Category Icon not found.",
  },
  // Client errors
  Client_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.client + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Client not found.",
  },
  // Dish errors
  Dish_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.dish + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Dish not found.",
  },
  // DishImage errors
  DishImage_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.dishImage + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Dish image not found.",
  },
  DishImage_EXCEED_LIMIT: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.dish + statusCodes.INVALID_OPERATION + "01",
    msg: "Dish exceeded the limit of images",
  },
  // Menu errors
  Menu_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.menu + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Menu not found.",
  },
  Menu_Grant_Permission: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.menu + statusCodes.INVALID_OPERATION + "01",
    msg: "Invalid menu grant/revoke permissions.",
  },
  // Order errors
  Order_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.order + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Order not found.",
  },
  Duplicated_Dish_id: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.order + statusCodes.INVALID_OPERATION + "01",
    msg: "Duplicate dish id.",
  },
  Order_Multiple_Menus: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.order + statusCodes.INVALID_OPERATION + "02",
    msg: "All dishes must be from the same menu.",
  },
  Order_Dish_Not_Found: (ids) => ({
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.order + statusCodes.INVALID_OPERATION + "03",
    msg: `Dishes [${ids}] Not Found`,
    args: { dishes: ids },
  }),
  Order_Invalid_Update: (status) => ({
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.order + statusCodes.INVALID_OPERATION + "04",
    msg: `Can't update while order status is ${status}.`,
    args: { status },
  }),
  // Payment errors
  Payment_Failed: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.payment + statusCodes.INVALID_OPERATION + "01",
    msg: "Payment failed.",
  },
  // Restaurant errors
  Restaurant_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.restaurant + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Restaurant not found.",
  },
  // Restaurant Subscriptions errors
  RestaurantSubscription_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.restaurantSubscription + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Restaurant subscription not found.",
  },
  RestaurantSubscription_Spam: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.restaurantSubscription + statusCodes.INVALID_OPERATION + "01",
    msg: "Expiration date should be less than 14 days to be able to buy the same subscription again.",
  },
  // Subscription errors
  Subscription_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.subscription + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "subscription not found.",
  },
  // Table errors
  Table_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.table + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Table not found.",
  },
  // User errors
  User_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.user + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "User not found.",
  },
  User_Email_Verified: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.user + statusCodes.INVALID_OPERATION + "01",
    msg: "Email has has been verified.",
  },
  User_Self_Update: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.user + statusCodes.INVALID_OPERATION + "02",
    msg: "User can't update his data from this API.",
  },
  // Permission errors
  Permission_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.permission + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "Permission not found.",
  },
  Invalid_Request_Permission: {
    httpStatus: httpCodes.UNAUTHORIZED,
    code: models.permission + statusCodes.INVALID_OPERATION + "01",
    msg: "You are not allowed to do this request.",
  },
  Invalid_Permission_Grant: {
    httpStatus: httpCodes.UNAUTHORIZED,
    code: models.permission + statusCodes.INVALID_OPERATION + "02",
    msg: "Invalid permission grant/revoke permissions.",
  },
  //FAQs errors
  Faq_Not_Found: {
    httpStatus: httpCodes.BAD_REQUEST,
    code: models.database + statusCodes.ITEM_NOT_FOUND + "01",
    msg: "FAQ not found.",
  },
};
