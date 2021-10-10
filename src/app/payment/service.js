const configs = require("../../../configs");
const { errors, Exception } = require("../../utils");
const sequelize = require("../../database");
const RestaurantsSubscription = require("../restaurant/subscriptions/service");
const stripe = require("stripe")(configs.stripe.secret);
const paypal = require("paypal-rest-sdk");

const db = sequelize.models;

paypal.configure({
  mode: configs.paypal.mode, //sandbox or live
  client_id: configs.paypal.clientId,
  client_secret: configs.paypal.clientSecret,
});

class Payment {
  constructor(data) {}

  static async stripe(user, { subscriptionId, stripeToken }) {
    await sequelize.transaction(async (trx) => {
      const paymentMethod = db.RestaurantsSubscription.PaymentMethod.stripe;
      const restaurantSub = await RestaurantsSubscription.create(user, subscriptionId, paymentMethod, stripeToken);

      await stripe.charges.create({ amount: restaurantSub.price * 100, source: stripeToken, currency: "usd" }).catch((err) => {
        throw new Exception(errors.Payment_Failed);
      });

      restaurantSub.status = db.RestaurantsSubscription.STATUS.active;
      await restaurantSub.save();
    });
  }

  static async paypalPay(user, { subscriptionId }) {
    return await sequelize.transaction(async (trx) => {
      const paymentMethod = db.RestaurantsSubscription.PaymentMethod.paypal;
      const restaurantSubscription = await RestaurantsSubscription.create(user, subscriptionId, paymentMethod);

      const payment = await new Promise(async (resolve, reject) => {
        const create_payment_json = {
          intent: "sale",
          payer: { payment_method: "paypal" },
          redirect_urls: {
            return_url: configs.domain + "/public/payment/paypal/success",
            cancel_url: configs.domain + `/public/payment/paypal/cancel?subscriptionId=${restaurantSubscription.id}`,
          },
          transactions: [
            {
              amount: { currency: "USD", total: restaurantSubscription.price },
              description: "Subscription at BrandsMenu.com",
            },
          ],
        };

        paypal.payment.create(create_payment_json, async function (err, payment) {
          if (err) resolve(false);
          const link = payment?.links.find((val) => val.rel === "approval_url");
          resolve({ link, token: payment?.id });
        });
      });
      if (!payment) throw new Exception(errors.Payment_Failed);

      restaurantSubscription.token = payment.token;
      await restaurantSubscription.save();

      return payment.link.href;
    });
  }

  static async paypalSuccess(payerId, paymentId) {
    return await sequelize.transaction(async (trx) => {
      const restaurantSubscription = await db.RestaurantsSubscription.findOne({ where: { token: paymentId } });
      if (!restaurantSubscription) return configs.paymentRedirect.failed;

      const payment = await new Promise(async (resolve, reject) => {
        const execute_payment_json = {
          payer_id: payerId,
          transactions: [{ amount: { currency: "USD", total: restaurantSubscription.price } }],
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (err, payment) {
          if (err) resolve(false);
          if (payment.state == "approved") resolve(true);
          else resolve(false);
        });
      });
      if (!payment) {
        await restaurantSubscription.destroy();
        return configs.paymentRedirect.failed;
      }

      restaurantSubscription.status = db.RestaurantsSubscription.STATUS.active;
      await restaurantSubscription.save();

      return configs.paymentRedirect.success;
    });
  }

  static async paypalCancel(subscriptionId) {
    await db.RestaurantsSubscription.destroy({ where: { id: subscriptionId } });
  }
}

module.exports = Payment;
