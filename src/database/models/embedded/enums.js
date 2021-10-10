module.exports = {
  category: {
    status: { active: "active", hidden: "hidden" },
  },

  dish: {
    status: { active: "active", disabled: "disabled" },
  },

  order: {
    status: {
      pending: "pending",
      cooking: "cooking",
      ready: "ready",
      served: "served",
      canceled: "canceled",
      outOfStock: "out of stock",
    },
  },

  permission: {
    enName: {
      owner: "owner",
      manager: "manager",
      author: "author",
      chef: "chef",
      accountant: "accountant",
      waiter: "waiter",
      client: "client",
    },
    arName: {
      owner: "مالك",
      manager: "مدير",
      author: "مؤلف",
      chef: "طاهي",
      accountant: "محاسب",
      waiter: "نادل",
      client: "زبون",
    },
  },

  restaurantsSubscription: {
    status: { active: "active", pending: "pending", expired: "expired", canceled: "canceled" },
    paymentMethod: { free: "free", paypal: "paypal", stripe: "card" },
  },

  subscription: { units: { days: "days", months: "months", years: "years", day: "day", month: "month", year: "year" } },

  table: {
    status: { active: "active", busy: "busy", checkout: "checkout", help: "help", outOfService: "out of service" },
    types: { inside: "inside", delivery: "delivery" },
  },

  user: {
    status: { pending: "pending", active: "active", fired: "fired", resigned: "resigned" },
    types: { employee: "employee", client: "client", superAdmin: "superAdmin" },
  },
};
