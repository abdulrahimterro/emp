const { website, paymentRedirect } = require("../../../configs");
const Payment = require("./service");

module.exports = {
  stripe: async (req, res) => {
    const { subscriptionId } = req.query;
    const { user } = req;
    const { stripeToken } = req.body;
    /**
     *  body:{
     *  stripeToken: 'tok_1IbtMhFsvwyr1OnooJy82v6c',
     *  stripeTokenType: 'card',
     *  stripeEmail: 'gg@gmail.com'
     *  }
     */
    await Payment.stripe(user, { stripeToken, subscriptionId });
    res.redirect(website + paymentRedirect.success);
  },

  paypalPay: async (req, res) => {
    const { user } = req;
    const { subscriptionId } = req.query;
    const result = await Payment.paypalPay(user, { subscriptionId });
    res.redirect(result);
  },

  paypalSuccess: async (req, res) => {
    const { PayerID, paymentId } = req.query;
    const result = await Payment.paypalSuccess(PayerID, paymentId).catch((err) =>
      res.redirect(website + paymentRedirect.error)
    );
    if (result) res.redirect(website + result);
  },

  paypalCancel: async (req, res) => {
    const { subscriptionId } = req.query;
    await Payment.paypalCancel(subscriptionId);
    res.redirect(website + paymentRedirect.canceled);
  },
};
