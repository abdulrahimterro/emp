"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const faqs = [
      {
        en_question: "WHAT IS BrandsMenu ?",
        ar_question: " ؟ BrandsMenu ماهي براندز منيو ",
        en_answer:
          "<p><em>Digital Mobile Menu<em><br>BRANDSMENU is the best way to display your menus with any mobile devices without downloading any application.<br>Simply scan the QR code using the smartphone camera directly on the iOS device or the QR scanner on Android device, then you will have your Digital QR menu automatically attractively.</p>",
        ar_answer:
          "براندز منيو تمنحك أفضل طريقة لمشاركة قوائم الطعام مع عمالئك بواسطة أجهزتهم المحمولة دون الحاجة لتحميل أي تطبيق. عند مسح رمز ال كيو ار  باستخدام كميرا الهاتف الذكي بشكل مباشر ألجهزة األيفون أو باستخدام تطبيق قاريء رموز ال كيو ار  لألجهزة التي تعمل بنظام األندرويد سيحصلون على قائمة الطعام الرقمية على أجهزتهم المحمولة بالتصميم الخاص بك بشكل جذاب وأنيق.",
      },
      {
        en_question: "Dine-In Orders",
        ar_question: "الطلبات المحليّة",
        en_answer:
          "<p>Print the Digital Mobile Menu QR code on coasters to allow guests to check your menu when they’re at the restaurant. They can place their orders from their table without any help from the staff.</p>",
        ar_answer:
          "قم بطباعة رمز الـ كيو ار الخاص بقائمتك الرقمية للهاتف المحمول في أي مكان سواء الملصقات، قواعد االكواب الخشبية أو على الطاولة ليتسنى لزبائنك استعراض القائمة والطلب مباشرة دون الحاجة إلى المساعدة من النادل",
      },
      {
        en_question: "Menu Management",
        ar_question: "إدارة القوائم",
        en_answer:
          "<p><em>Create and manage multiple menus</em><br>With BRANDSMENU Menu’s user-friendly control panel, you can create as many menus as you like. The menu wizard helps you add categories and items, sort these and publish the ones you want to see on your digital menu. In a single tool upload photos and add description, then GET your digital menu</p>",
        ar_answer:
          "قم بإنشاء وإدراة عدة قوائم في وقت واحد ! باستخدام لوحة التحكم الخاصة بك في براندز منيو يمكنك إنشاء قوائم طعام متعددة وإضافة األصناف واألقسام وإدارتها بجميع التفاصيل لتكون جاهزة لنشرها في أي وقت على قائمتك الرقمية. أداة واحدة كافية لتحميل الصور واضافة الوصف لتحصل على قائمة الطعام الرقمية للهاتف المحمول بكل سهولة",
      },
      {
        en_question: "Order Management",
        ar_question: "إدارة الطلبات",
        en_answer:
          "<p><em>How to improve restaurant efficiency?</em><br>Streamlining the ordering process is crucial in improving restaurant efficiency and it starts with taking orders directly from your digital menu,<br>All the orders are sent directly to the control panel where you can easily manage them to start cook the deliciousness food with full progress tracking of orders based on their status. <br>Give your employees and tables IDs to track performance and monitor service!<br>Integrate BRANDSMENU Menu with your kitchen printer to send orders directly to the kitchen to be prepped.</p>",
        ar_answer:
          "كيف تزيد من كفاءة المطعم؟ إن تحويل عملية أخذ الطلبات لتكون بأسهل طريقة هو أمر بالغ األهمية لتحسين كفاءة المطعم والذي يبدأ من إنشاء الطلب عبر القائمة الرقمية. جميع الطلبات يتم إرسالها إلى لوحة التحكم ليتم إدارتها مباشرة للبدء في تجهيز األطعمة الشهية ومتابعة حالة تقدم الطلبات. قم بتحديد معرفات خاصة للطاوالت والنوادل لمراقبة مدى الكفاءة واإلنتاجية والخدمة المقدمة بشكل منفصل. كما بامكانك ربط النظام مع طابعة المطبخ ليتم طباعة جميع الطلبات المقدمة بشكل تلقائي من الطابعة ليتم تحضيرها على الفور",
      },
      {
        en_question: "Theme Management - Your Brand",
        ar_question: "الهوية والعالمة التجارية",
        en_answer:
          "Design your menu to reflect your ideas and businessThe menu should reflect the same ideas and branding of the restaurant. With BRANDSMENU Menu’s customizable themes, you can create your own look for your digital menu. All colors and background images can be changed and designed however you like! You can use a photo or even a video for the homepage background of your digital menu.",
        ar_answer:
          "قم بتصميم القائمة لتبرز أفكارك وعالمتك التجاريّة من أهم الأساسيات التي عملنا عليها هي ان تكون قائمة الطعام تعكس روح المطعم والعلامة التجارية وبفضل قائمة براندز منيو يمكنكم إنشاء التصاميم وتخصيصها كما يحلو لكم لتحقيق ذلك. جميع الألوان والخلفيات قابلة للتعديل ويمكن إضافة الصور للصفحة الرئيسيّة وبذلك تصبح القائمة متناسبة ومتناغمة مع أجواء المطعم",
      },
      {
        en_question: "Cross – Sell",
        ar_question: "البيع المتقاطع",
        en_answer:
          "How to increase your revenue with Cross –Sell?! Increase your revenue with cross-selling. Cross selling is one of the most effective ways of boosting sales for restaurants. SAY goodbye to the ineffective, traditional way of asking the waiters always and every time to “Would you like a drink with that?” because it's depend on his skills to provide the best item with the meal chosen. SO What if your menu could actually show what you have to offer for each items? Sell more with cross-selling When your customers are looking at a certain dish, BRANDSMENU shows them your suggestions and pairings about that item. Nobody could say “no” to delicious fries with their burger to have best Experience or a great glass of coconut puree with an incredible sushi dinner? Show your choice of side dishes, appetizers, desserts and drinks to make the most of cross selling and increase your revenue just with your digital menu.",
        ar_answer:
          "كيف تقوم بزيادة األرباح مع خالل البيع المتقاطع ؟! البيع المتقاطع هو أحد فنون ومهارات التسويق ويعتبر من أهم وأكثر الطرق فعاليّة لزيادة المبيعات في المطعم. الآن وداعا لطريقة التقليديّة الغير فعالة بسؤال النادل في كل مرة ”هل تريدون طلب شراب مع ا الوجبة؟ ألنها تعتمد على مهارة النادل على التذكر وإمكانيته لتقديم اقتراحات تناسب الصنف المختار, ولكن ماذا لو أن قائمة طعامكم قادرة على عرض أصناف مقترحة لكل األصناف ولجميع الزبائن بشكل تلقائي؟ قم بزيادة المبيعات عبر البيع المتقاطع عندما يستعرض الزبائن أطباق معيّنة على قوائم الطعام تقوم قائمة براندز منيو بعرض أصناف مقترحة تم ربطها مسبقا من قبلكم من خالل إدارة القوائ م. على سبيل المثال في حال تم طلب طبق الهبمرغر سيتم مباشرة عرض طبق البطاطس المقلية المتبّلة بالبهارات الخاصة كإقتراح للاستمتاع بوجبة متكاملة وشهية. أواقتراح كوب من الموهيتو المحضر من الفواكه الطازجة بجانب طبق شرائح اللحم المشوي؟ قم بعرض مجموعة مختارة من االطباق الجانبيّة والمقبلات والحلويات والمشروبات واحصل على زيادة في المبيعات باستخدام قائمتك الرقميّة",
      },
      {
        en_question: "Safety & Interactive Dine-In Menus",
        ar_question: "قوائم طعام آمنة وتفاعلية",
        en_answer:
          "Digital menus for a safer dining experience! No need for traditional menus even printed or Tablet menus which need to cleaned with alcohol-based solutions every time, before and after serving each guest. BRANDSMENU Digital mobile Menu allow you to offer a safe menu experience for your guests",
        ar_answer:
          "قوائم رقمية لتجربة طعام أكثر أمانًا! ال حاجة بعد الآن لقوائم الطعام التقليدية سواء الورقية أو قوائم األجهزة اللوحية التي يجب تنظيفها بمحلول كحولي في كل مرة قبل وبعد خدمة كل ضيف. قائمة براندز منيو الرقمية للهاتف المحمول تقدم لك أفضل تجربة آمنة لضيوفك",
      },
      {
        en_question: "Made in Arabic and totaly supports English",
        ar_question: "مطور باللغة العربية ويدعم الانكليزية بشكل كامل",
        en_answer:
          "BRANDSMENU is the first and only Digital Mobile Menu management platform, developed with Arabic as its first language and totally supports English",
        ar_answer:
          "براندز منيو هو الموقع الأول والوحيد لإدارة قائمة الطعام الرقمية للهاتف المحمول التي تم تطويرها باللغة العربية كلغة أساسية مع ددعم كامل للغة الانكليزية",
      },
      {
        en_question: "client best experience",
        ar_question: "افضل تجربة للزبون",
        en_answer:
          "BrandsMenu gives your client the best experience by ordering his meal in split way for every client on the table and he can ask for help from the waiter and then he can pay with any payment method that he prefer all that just by using your menu easy and beautiful multi-language interface that you provide to your clients.",
        ar_answer:
          " براندز مينيو يقدم لزبنائك افضل تجربة عن طريق طلب وجبته بشكل منفصل لكل زبون على الطاولة على حدى كما بلإمكان طلب مساعدة النادل والدفع بلطريقة التي يحبذها الزبون وكل ذلك من خلال واجهة المنيو الجميلة والسهلة ومتعددة اللغات التي ستقدمها للزبائن ",
      },
    ];

    await queryInterface.bulkInsert("faqs", faqs);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("faqs");
  },
};
