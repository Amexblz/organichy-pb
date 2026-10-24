const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Organichy Peanut Butter database...");

  // 1. Clean existing records if any
  await prisma.phoneOtp.deleteMany();
  await prisma.advertisementVideo.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.couponUsage.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.cMSPage.deleteMany();
  await prisma.siteSettings.deleteMany();

  // 2. Passwords
  const adminPasswordHash = await bcrypt.hash("AdminPassword@123", 10);
  const customerPasswordHash = await bcrypt.hash("CustomerPassword@123", 10);

  // 3. Admin User
  const adminUser = await prisma.user.create({
    data: {
      name: "Organichy Admin",
      email: "admin@organichy.com",
      phone: "+91 98765 00000",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      isEmailVerified: true,
      profile: {
        create: {
          bio: "Lead Operations & E-commerce Manager",
        },
      },
    },
  });

  // 4. Demo Customer
  const customerUser = await prisma.user.create({
    data: {
      name: "Sourav Sharma",
      email: "customer@gmail.com",
      phone: "+91 98765 43210",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      isEmailVerified: true,
      profile: {
        create: {
          bio: "Fitness enthusiast & marathon runner",
          totalSpend: 2498.0,
          ordersCount: 2,
        },
      },
      addresses: {
        create: [
          {
            fullName: "Sourav Sharma",
            phone: "+91 98765 43210",
            addressLine1: "Flat 402, Green Glen Heights",
            addressLine2: "Outer Ring Road, Bellandur",
            landmark: "Near EcoSpace Tech Park",
            city: "Bengaluru",
            state: "Karnataka",
            pincode: "560103",
            isDefault: true,
            addressType: "HOME",
          },
          {
            fullName: "Sourav Sharma (Office)",
            phone: "+91 98765 43210",
            addressLine1: "Tower B, Level 6, Cyber City",
            addressLine2: "DLF Phase 2",
            landmark: "Opposite Cyber Hub",
            city: "Gurugram",
            state: "Haryana",
            pincode: "122002",
            isDefault: false,
            addressType: "WORK",
          },
        ],
      },
    },
  });

  // 5. Site Settings
  await prisma.siteSettings.create({
    data: {
      id: "default-settings",
      siteName: "Organichy Peanut Butter",
      logoUrl: "/images/branding/logo.png",
      announcementText: "🔥 EXTRA 15% OFF ON ORDERS ABOVE ₹799! CODE: ORGANIC15 | FREE EXPRESS SHIPPING ABOVE ₹499",
      announcementActive: true,
      contactEmail: "organichypb@gmail.com",
      contactPhone: "+91 7427446941",
      contactAddress: "Organichy Food, A-11 Shakti Nagar, Prem Nagar, Linepar, Moradabad - 244001 (U.P.), India",
      freeShippingThreshold: 499.0,
      standardShippingFee: 50.0,
      enableCod: true,
      enableRazorpay: true,
      currencySymbol: "₹",
      facebookUrl: "https://facebook.com",
      instagramUrl: "https://instagram.com/organichy_pb",
      youtubeUrl: "https://youtube.com",
      twitterUrl: "https://twitter.com",
    },
  });

  // 6. Categories
  const catPeanutButter = await prisma.category.create({
    data: {
      name: "Peanut Butter",
      slug: "peanut-butter",
      description: "Creamy, crunchy & slow roasted authentic peanut butters crafted with 100% natural Indian peanuts.",
      image: "/images/products/organichy-jar.png",
      isFeatured: true,
      displayOrder: 1,
      active: true,
    },
  });

  const catChocolate = await prisma.category.create({
    data: {
      name: "Chocolate Collection",
      slug: "chocolate-collection",
      description: "Decadent dark cocoa infused with rich protein-packed peanut crunch. The ultimate guilt-free indulgence.",
      image: "/images/products/organichy-tub-front.png",
      isFeatured: true,
      displayOrder: 2,
      active: true,
    },
  });

  const catHighProtein = await prisma.category.create({
    data: {
      name: "High Protein",
      slug: "high-protein",
      description: "Power-packed formulas delivering up to 32g pure protein per 100g to fuel intense workouts and recovery.",
      image: "/images/products/chocolate-crunchy-half-kg.png",
      isFeatured: true,
      displayOrder: 3,
      active: true,
    },
  });

  const catNatural = await prisma.category.create({
    data: {
      name: "Natural & Organic",
      slug: "natural-organic",
      description: "Zero added sugar, zero salt, zero hydrogenated palm oils. Just 100% pure roasted peanuts.",
      image: "/images/products/organichy-lid.png",
      isFeatured: true,
      displayOrder: 4,
      active: true,
    },
  });

  const catCombos = await prisma.category.create({
    data: {
      name: "Combos & Value Packs",
      slug: "combos",
      description: "Bundled savings for dedicated athletes and health-conscious families.",
      image: "/images/products/organichy-jar.png",
      isFeatured: true,
      displayOrder: 5,
      active: true,
    },
  });

  // 7. Products
  const prod1 = await prisma.product.create({
    data: {
      name: "Organichy Dark Chocolate Crunchy High Protein Peanut Butter",
      slug: "organichy-dark-chocolate-crunchy-peanut-butter",
      shortDescription: "32g Protein | Premium Dark Cocoa | Crunchy Roasted Peanut Bits | Zero Trans Fat",
      description: `Fuel your fitness journey with India's most decadent health staple! Organichy Dark Chocolate Crunchy Peanut Butter blends premium slow-roasted Gujarat runner peanuts with rich, imported dark cocoa and crunchy crushed peanut nibs.

Every spoonful delivers 32g of pure plant protein per 100g, energizing your morning workouts, post-gym smoothies, and healthy high-protein snacks. We never use palm oils, hydrogenated fats, or artificial preservatives.

Key Highlights:
- 32g Protein per 100g
- Rich dark chocolate taste without the guilt
- Real crunchy peanut granules in every bite
- Zero Palm Oil & Zero Cholesterol
- Gluten-free, non-GMO, and vegan friendly`,
      categoryId: catChocolate.id,
      basePrice: 349.0,
      baseMrp: 449.0,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      isChocolate: true,
      isHighProtein: true,
      texture: "Crunchy",
      flavor: "Dark Chocolate",
      ingredients: "Roasted Peanuts (85%), Dark Chocolate Solids & Cocoa Powder (10%), Brown Sugar, Emulsifier (INS 322), Sea Salt.",
      nutritionPer100g: JSON.stringify({
        energyKcal: 598,
        proteinG: 32.0,
        carbsG: 18.5,
        dietaryFiberG: 7.8,
        addedSugarG: 4.2,
        totalFatG: 46.0,
        saturatedFatG: 8.5,
        transFatG: 0.0,
        cholesterolMg: 0.0,
        sodiumMg: 140,
      }),
      benefits: `Supercharges Muscle Recovery: High natural BCAA and arginine content accelerates muscle repair.
Long-Lasting Satiety: Healthy unsaturated fats and high dietary fiber keep hunger cravings in check.
Clean Workout Energy: Sustained energy without the sugar crash of standard market spreads.`,
      directions: "Stir well before use as natural oil separation is a proof of purity! Spread over warm toast, blend into protein shakes, mix with morning oats, or spoon straight from the tub.",
      disclaimer: "Manufactured in a certified GMP and ISO compliant facility. Contains peanuts and soy lecithin.",
      active: true,
      rating: 4.9,
      reviewCount: 384,
      images: {
        create: [
          { url: "/images/products/organichy-tub-front.png", altText: "Organichy Dark Chocolate Crunchy Front Tub", isPrimary: true, displayOrder: 1 },
          { url: "/images/products/organichy-jar.png", altText: "Organichy Peanut Butter Jar Perspective", isPrimary: false, displayOrder: 2 },
          { url: "/images/products/chocolate-crunchy-half-kg.png", altText: "Chocolate Crunchy 500g Pack", isPrimary: false, displayOrder: 3 },
          { url: "/images/products/organichy-nutrition.png", altText: "Official Lab Nutrition Facts", isPrimary: false, displayOrder: 4 },
          { url: "/images/products/organichy-back.png", altText: "Real Ingredients & Goodness Back Label", isPrimary: false, displayOrder: 5 },
          { url: "/images/products/organichy-lid.png", altText: "Organichy Freshness Seal Lid", isPrimary: false, displayOrder: 6 },
        ],
      },
      variants: {
        create: [
          { weight: "500g", flavor: "Dark Chocolate", texture: "Crunchy", price: 349.0, mrp: 449.0, stock: 120, sku: "ORG-DC-CR-500G" },
          { weight: "1kg", flavor: "Dark Chocolate", texture: "Crunchy", price: 649.0, mrp: 799.0, stock: 85, sku: "ORG-DC-CR-1KG" },
          { weight: "1.25kg", flavor: "Dark Chocolate", texture: "Crunchy", price: 799.0, mrp: 999.0, stock: 45, sku: "ORG-DC-CR-1250G" },
          { weight: "2.5kg", flavor: "Dark Chocolate", texture: "Crunchy", price: 1499.0, mrp: 1899.0, stock: 25, sku: "ORG-DC-CR-2500G" },
        ],
      },
    },
  });

  const prod2 = await prisma.product.create({
    data: {
      name: "Organichy 100% Natural Unsweetened Crunchy Peanut Butter",
      slug: "organichy-natural-unsweetened-crunchy-peanut-butter",
      shortDescription: "Zero Added Sugar | 100% Roasted Peanuts | 30g Protein | Keto Friendly",
      description: `For the true purists. Only one single ingredient inside: 100% premium quality slow-roasted Indian peanuts.

Zero added sugar, zero salt, zero hydrogenated vegetable oil, zero preservatives. Ideal for strict keto dieters, bodybuilders, and anyone watching their glycemic index.`,
      categoryId: catNatural.id,
      basePrice: 289.0,
      baseMrp: 380.0,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      isNatural: true,
      isChocolate: false,
      isHighProtein: true,
      texture: "Crunchy",
      flavor: "Natural",
      ingredients: "100% Roasted Peanuts. That's all!",
      nutritionPer100g: JSON.stringify({
        energyKcal: 620,
        proteinG: 30.0,
        carbsG: 14.0,
        dietaryFiberG: 8.5,
        addedSugarG: 0.0,
        totalFatG: 50.0,
        saturatedFatG: 9.0,
        transFatG: 0.0,
        cholesterolMg: 0.0,
        sodiumMg: 12,
      }),
      benefits: `Keto & Diabetic Friendly: Zero added sugar ensures steady blood glucose.
Heart Health: High monounsaturated fatty acids support optimal cardiovascular wellness.`,
      directions: "Because there are zero stabilizers or palm oils, natural oil separation is completely normal. Stir thoroughly with a clean butter knife before use.",
      active: true,
      rating: 4.8,
      reviewCount: 240,
      images: {
        create: [
          { url: "/images/products/organichy-jar.png", altText: "Organichy 100% Natural Jar", isPrimary: true, displayOrder: 1 },
          { url: "/images/products/organichy-lid.png", altText: "Organichy Lid Seal", isPrimary: false, displayOrder: 2 },
          { url: "/images/products/organichy-back.png", altText: "Real Goodness Back Details", isPrimary: false, displayOrder: 3 },
        ],
      },
      variants: {
        create: [
          { weight: "500g", flavor: "Natural", texture: "Crunchy", price: 289.0, mrp: 380.0, stock: 150, sku: "ORG-NAT-CR-500G" },
          { weight: "1kg", flavor: "Natural", texture: "Crunchy", price: 549.0, mrp: 680.0, stock: 90, sku: "ORG-NAT-CR-1KG" },
          { weight: "2.5kg", flavor: "Natural", texture: "Crunchy", price: 1299.0, mrp: 1599.0, stock: 30, sku: "ORG-NAT-CR-2500G" },
        ],
      },
    },
  });

  const prod3 = await prisma.product.create({
    data: {
      name: "Organichy Classic Creamy Peanut Butter (Smooth)",
      slug: "organichy-classic-creamy-peanut-butter",
      shortDescription: "Ultra-Silky Smooth | Grade-A Roasted Peanuts | Balanced Sweetness",
      description: `Smooth, velvety, and effortless to spread! Organichy Classic Creamy Peanut Butter is micro-milled to achieve a luxurious melt-in-the-mouth texture. Lightly sweetened with organic brown sugar and balanced with a pinch of pink Himalayan rock salt.`,
      categoryId: catPeanutButter.id,
      basePrice: 299.0,
      baseMrp: 399.0,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      isNatural: false,
      isChocolate: false,
      isHighProtein: false,
      texture: "Smooth",
      flavor: "Classic",
      ingredients: "Roasted Peanuts (90%), Organic Brown Sugar, Himalayan Pink Salt, Soy Lecithin.",
      nutritionPer100g: JSON.stringify({
        energyKcal: 605,
        proteinG: 26.0,
        carbsG: 20.0,
        dietaryFiberG: 6.5,
        addedSugarG: 5.0,
        totalFatG: 48.0,
        saturatedFatG: 9.0,
        transFatG: 0.0,
        cholesterolMg: 0.0,
        sodiumMg: 160,
      }),
      benefits: `Effortless Spreading: Glides smoothly onto sandwich bread, apple slices, and pancakes.
Kid-Approved Taste: Delicious nutty flavor the whole family loves for school tiffin and quick snacks.`,
      directions: "Spread generously over sourdough bread or blend into morning fruit smoothies.",
      active: true,
      rating: 4.9,
      reviewCount: 195,
      images: {
        create: [
          { url: "/images/products/organichy-jar.png", altText: "Organichy Classic Creamy Jar", isPrimary: true, displayOrder: 1 },
          { url: "/images/products/organichy-tub-front.png", altText: "Organichy Tub Front", isPrimary: false, displayOrder: 2 },
        ],
      },
      variants: {
        create: [
          { weight: "500g", flavor: "Classic", texture: "Smooth", price: 299.0, mrp: 399.0, stock: 80, sku: "ORG-CLS-SM-500G" },
          { weight: "1kg", flavor: "Classic", texture: "Smooth", price: 579.0, mrp: 699.0, stock: 60, sku: "ORG-CLS-SM-1KG" },
        ],
      },
    },
  });

  const prod4 = await prisma.product.create({
    data: {
      name: "Organichy Dark Chocolate Smooth Peanut Butter",
      slug: "organichy-dark-chocolate-smooth-peanut-butter",
      shortDescription: "Decadent Pure Belgian Cocoa | Ultra Smooth & Creamy | 30g Protein",
      description: `For those who prefer a silky-smooth chocolate peanut experience! Blended with premium dark cocoa and slow-roasted runner peanuts until completely liquefied into a creamy gourmet spread. Perfect topping for crepes, protein pancakes, and warm waffles.`,
      categoryId: catChocolate.id,
      basePrice: 349.0,
      baseMrp: 449.0,
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      isChocolate: true,
      isHighProtein: true,
      texture: "Smooth",
      flavor: "Dark Chocolate",
      ingredients: "Roasted Peanuts (86%), Dark Cocoa Solids (9%), Brown Sugar, Himalayan Pink Salt, Soy Lecithin.",
      nutritionPer100g: JSON.stringify({
        energyKcal: 595,
        proteinG: 30.5,
        carbsG: 19.0,
        dietaryFiberG: 7.0,
        addedSugarG: 4.5,
        totalFatG: 45.0,
        saturatedFatG: 8.0,
        transFatG: 0.0,
        cholesterolMg: 0.0,
        sodiumMg: 135,
      }),
      benefits: `Guilt-Free Chocolate Fix: Replaces high-sugar hazelnut chocolate spreads with 5x more protein and 70% less sugar.
Pre-Workout Fuel: Fast-acting healthy fats and cocoa flavonoids for mental clarity and stamina.`,
      directions: "Drizzle over yogurt bowls, fruit salads, or enjoy straight with a warm spoon.",
      active: true,
      rating: 4.9,
      reviewCount: 167,
      images: {
        create: [
          { url: "/images/products/organichy-tub-front.png", altText: "Organichy Dark Chocolate Smooth Front", isPrimary: true, displayOrder: 1 },
          { url: "/images/products/chocolate-crunchy-half-kg.png", altText: "Organichy Half Kg Chocolate", isPrimary: false, displayOrder: 2 },
        ],
      },
      variants: {
        create: [
          { weight: "500g", flavor: "Dark Chocolate", texture: "Smooth", price: 349.0, mrp: 449.0, stock: 110, sku: "ORG-DC-SM-500G" },
          { weight: "1kg", flavor: "Dark Chocolate", texture: "Smooth", price: 649.0, mrp: 799.0, stock: 75, sku: "ORG-DC-SM-1KG" },
        ],
      },
    },
  });

  const prod5 = await prisma.product.create({
    data: {
      name: "Organichy Mega Fitness Duo Combo (1kg Dark Chocolate Crunchy + 1kg 100% Natural)",
      slug: "organichy-mega-fitness-duo-combo",
      shortDescription: "Best-Selling 2kg Bundle | Save ₹399 | Best of Both Worlds",
      description: `Can't decide between decadent Dark Chocolate and pure 100% Natural Unsweetened? Get both with our Best-Selling Mega Fitness Duo Pack!

Includes:
- 1 x Organichy Dark Chocolate Crunchy (1kg)
- 1 x Organichy 100% Natural Unsweetened Crunchy (1kg)

Total 2kg of clean, high-grade protein to fuel your entire month.`,
      categoryId: catCombos.id,
      basePrice: 1099.0,
      baseMrp: 1479.0,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      isChocolate: true,
      isHighProtein: true,
      texture: "Crunchy",
      flavor: "Combo (Dark Chocolate + Natural)",
      ingredients: "Tub 1: Roasted Peanuts, Cocoa, Brown Sugar. Tub 2: 100% Roasted Peanuts.",
      nutritionPer100g: JSON.stringify({
        energyKcal: 610,
        proteinG: 31.0,
        carbsG: 16.0,
        dietaryFiberG: 8.0,
        addedSugarG: 2.1,
        totalFatG: 48.0,
        saturatedFatG: 8.8,
        transFatG: 0.0,
        cholesterolMg: 0.0,
        sodiumMg: 75,
      }),
      benefits: `Maximum Value: Save extra ₹399 compared to purchasing individual units.
Diet Flexibility: Use 100% Natural for strict meal prep and Dark Chocolate for post-workout cravings.`,
      directions: "Ideal for daily fitness lovers and athlete households.",
      active: true,
      rating: 5.0,
      reviewCount: 312,
      images: {
        create: [
          { url: "/images/products/organichy-jar.png", altText: "Organichy Mega Fitness Duo Combo", isPrimary: true, displayOrder: 1 },
          { url: "/images/products/organichy-tub-front.png", altText: "Organichy Tub Front", isPrimary: false, displayOrder: 2 },
        ],
      },
      variants: {
        create: [
          { weight: "2kg (2 x 1kg)", flavor: "Combo", texture: "Crunchy", price: 1099.0, mrp: 1479.0, stock: 40, sku: "ORG-CMB-DUO-2KG" },
        ],
      },
    },
  });

  // 8. Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: prod1.id,
        userId: customerUser.id,
        userName: "Sourav Sharma",
        rating: 5,
        title: "Hands down the best chocolate peanut butter in India!",
        comment: "I have tried MyFitness, Pintola and Alpino, but Organichy has the cleanest taste and real chocolate crunch. No artificial oily aftertaste. Delivered in 2 days to Bengaluru!",
        isVerifiedPurchase: true,
        isApproved: true,
      },
      {
        productId: prod1.id,
        userId: customerUser.id,
        userName: "Dr. Vikram Sethi",
        rating: 5,
        title: "Outstanding macro profile & genuine ingredients",
        comment: "As a sports physician, I closely inspect trans-fat and sodium. Organichy delivers genuine 32g protein per 100g without using cheap palm stearin.",
        isVerifiedPurchase: true,
        isApproved: true,
      },
      {
        productId: prod2.id,
        userId: customerUser.id,
        userName: "Pooja Malhotra",
        rating: 5,
        title: "Pure roasted peanuts with incredible aroma",
        comment: "Zero sugar and zero salt is exactly what I needed for my contest prep. The peanut aroma when opening the lid is heavenly.",
        isVerifiedPurchase: true,
        isApproved: true,
      },
    ],
  });

  // 9. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "ORGANIC15",
        description: "Get 15% OFF on orders above ₹799",
        discountType: "PERCENTAGE",
        discountValue: 15.0,
        minOrderAmount: 799.0,
        maxDiscountAmount: 250.0,
        isActive: true,
        usageLimit: 500,
        usageCount: 14,
      },
      {
        code: "FITNESS100",
        description: "Flat ₹100 OFF on orders above ₹599",
        discountType: "FIXED",
        discountValue: 100.0,
        minOrderAmount: 599.0,
        isActive: true,
        usageLimit: 1000,
        usageCount: 38,
      },
      {
        code: "WELCOME10",
        description: "10% OFF Welcome discount for all new customers",
        discountType: "PERCENTAGE",
        discountValue: 10.0,
        minOrderAmount: 399.0,
        maxDiscountAmount: 150.0,
        isActive: true,
        usageLimit: 10000,
        usageCount: 82,
      },
    ],
  });

  // 10. Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "INDIA'S PUREST DARK CHOCOLATE PEANUT BUTTER",
        subtitle: "32g High Protein per 100g | 100% Roasted Peanuts | Zero Palm Oil & No Preservatives",
        image: "/images/products/organichy-tub-front.png",
        link: "/shop?flavor=Dark+Chocolate",
        ctaText: "SHOP DARK CHOCOLATE",
        badgeText: "⭐ 4.9/5 RATED BY 25,000+ ATHLETES",
        type: "HERO",
        displayOrder: 1,
        isActive: true,
      },
      {
        title: "100% NATURAL & UNSWEETENED",
        subtitle: "Only 1 Single Ingredient: Slow-Roasted Indian Peanuts. Zero Added Sugar, Zero Salt.",
        image: "/images/products/organichy-jar.png",
        link: "/shop?category=natural-organic",
        ctaText: "EXPLORE NATURAL",
        badgeText: "🌱 100% ORGANIC & KETO VERIFIED",
        type: "HERO",
        displayOrder: 2,
        isActive: true,
      },
      {
        title: "SUPER SAVER FITNESS DUO BUNDLES",
        subtitle: "Upgrade your monthly nutrition with 2kg Combos. Save up to 35% with Free Delivery.",
        image: "/images/products/chocolate-crunchy-half-kg.png",
        link: "/shop?category=combos",
        ctaText: "GRAB COMBO PACKS",
        badgeText: "⚡ LIMITED PERIOD DISCOUNT",
        type: "HERO",
        displayOrder: 3,
        isActive: true,
      },
    ],
  });

  // 11. CMS Pages
  await prisma.cMSPage.createMany({
    data: [
      {
        title: "About Organichy Peanut Butter",
        slug: "about-us",
        content: `### Welcome to Organichy PeaNut
At Organichy (Dr Health Xpert Pvt Ltd), we set out with a relentless mission: to strip away the industrial hydrogenated palm oils, artificial chemicals, and fillers that plague mainstream spreads, and deliver **pure, honest, high-performance nutrition**.

### Our Story
Founded by certified nutritionists and athletes, Organichy sources exclusively Grade-A runner peanuts directly from organic farms in Saurashtra, Gujarat. Peanuts are slow-roasted in small batches to preserve natural polyphenols, heart-healthy monounsaturated fats, and vital micronutrients.

### The 4 Pillars of Organichy Purity
1. **Zero Palm Oil Ever**: We never use cheap palm stearin or hydrogenated fats to artificially halt natural oil separation.
2. **True 32g Protein**: Our dark chocolate formulation delivers 32g of uncompromised muscle-building protein per 100g.
3. **No Hidden Sugars**: Lightly sweetened with organic unrefined brown sugar or 100% unsweetened for keto athletes.
4. **FSSAI, ISO & GMP Certified**: Manufactured in state-of-the-art sterile clean-rooms conforming to highest international export standards.`,
        metaTitle: "About Us | Organichy Peanut Butter",
        metaDescription: "Learn about Organichy's mission to craft India's purest 32g high-protein peanut butter with zero palm oil.",
        published: true,
      },
      {
        title: "Contact Customer Care",
        slug: "contact",
        content: `### We're Here to Help!
Have a question about your order, delivery timeline, or bulk gym queries? Our support team is ready to assist you.

- **Email**: care@organichy.com / support@organichy.com
- **Phone / WhatsApp Support**: +91 98765 43210 (Mon-Sat, 9:30 AM to 6:30 PM IST)
- **Corporate Office**: Dr Health Xpert Pvt Ltd, Industrial Area, Sector 62, Noida, Uttar Pradesh, 201309, India
- **Warehouse Fulfillment**: Bengaluru (South Hub) | Noida (North Hub) | Mumbai (West Hub)`,
        metaTitle: "Contact Us | Organichy Customer Support",
        metaDescription: "Get in touch with Organichy support team for orders, queries, and bulk orders.",
        published: true,
      },
      {
        title: "Frequently Asked Questions (FAQ)",
        slug: "faq",
        content: `### Frequently Asked Questions

#### Q1: Why is there oil on top of my peanut butter?
**A:** Natural oil separation is the ultimate proof of purity! Commercial brands add hydrogenated palm oil and chemical emulsifiers to keep the oil artificially bound. We don't. Simply stir the natural peanut oil back in with a clean knife. Storing the tub upside down or in a refrigerator also helps keep it thick and creamy.

#### Q2: What is the shelf life of Organichy Peanut Butter?
**A:** Our products have an unopened shelf life of 12 months from the date of manufacturing. Once opened, we recommend consuming within 3 months for optimal freshness.

#### Q3: How much protein does one serving provide?
**A:** Each 32g serving (approximately 2 tablespoons) delivers over 10g of clean, high-biological-value protein.

#### Q4: How long does delivery take?
**A:** Orders placed before 2 PM IST are dispatched the same day. Metro deliveries arrive within 2-3 business days; rest of India takes 3-5 business days.

#### Q5: Can I pay Cash on Delivery (COD)?
**A:** Yes! We offer Cash on Delivery (COD) across 19,000+ Indian pin codes, alongside secure online payments (UPI, Cards, Netbanking via Razorpay).`,
        metaTitle: "FAQ | Organichy Peanut Butter",
        metaDescription: "Common questions regarding Organichy ingredients, oil separation, protein content, and delivery.",
        published: true,
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy",
        content: `This Privacy Policy outlines how Dr Health Xpert Pvt Ltd ("Organichy") collects, uses, and protects your personal information when visiting organichy.com. We prioritize user privacy and strictly comply with the Information Technology Act, 2000 and Digital Personal Data Protection Act (DPDPA). We never sell your personal data to third-party advertisers.`,
        published: true,
      },
      {
        title: "Terms and Conditions",
        slug: "terms-conditions",
        content: `By accessing and using this website, you agree to be bound by our terms and conditions. All orders placed are subject to product availability and confirmation of order price.`,
        published: true,
      },
      {
        title: "Shipping Policy",
        slug: "shipping-policy",
        content: `We offer **FREE Shipping** on all orders above ₹499 across India. For orders below ₹499, a nominal standard shipping fee of ₹50 applies. All shipments are dispatched through premium logistics partners (Bluedart, Delhivery, ExpressBees) with live SMS and email tracking links provided upon dispatch.`,
        published: true,
      },
      {
        title: "Return and Refund Policy",
        slug: "return-refund-policy",
        content: `Due to food safety and hygiene protocols, food products once opened cannot be returned. However, if your order arrives damaged, leaked, or with defective packaging, contact our customer support team within 48 hours with unboxing photos or video, and we will initiate an instant free replacement or 100% refund to your original payment method.`,
        published: true,
      },
    ],
  });

  // 12. Create a demo order for Customer to verify account & admin workflows
  const variant1 = await prisma.productVariant.findFirst({
    where: { sku: "ORG-DC-CR-1KG" },
  });

  if (variant1) {
    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: "ORG-2026-8942",
        userId: customerUser.id,
        guestEmail: customerUser.email,
        guestPhone: customerUser.phone,
        subtotal: 649.0,
        discount: 97.35,
        shippingFee: 0.0,
        tax: 0.0,
        total: 551.65,
        couponCode: "ORGANIC15",
        status: "SHIPPED",
        paymentStatus: "PAID",
        paymentMethod: "RAZORPAY",
        trackingNumber: "DEL-8492019482",
        courierName: "Delhivery Air Express",
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        shippingAddressJson: JSON.stringify({
          fullName: "Sourav Sharma",
          phone: "+91 98765 43210",
          addressLine1: "Flat 402, Green Glen Heights",
          addressLine2: "Outer Ring Road, Bellandur",
          landmark: "Near EcoSpace Tech Park",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560103",
        }),
        items: {
          create: [
            {
              productId: prod1.id,
              variantId: variant1.id,
              productName: prod1.name,
              variantLabel: "1kg (Dark Chocolate / Crunchy)",
              sku: variant1.sku,
              unitPrice: 649.0,
              mrp: 799.0,
              quantity: 1,
              totalPrice: 649.0,
              image: "/images/products/organichy-tub-front.png",
            },
          ],
        },
        statusHistory: {
          create: [
            { status: "PENDING", comment: "Order placed online via Razorpay UPI", createdBy: "Customer" },
            { status: "PROCESSING", comment: "Payment confirmed. Sent to fulfillment warehouse", createdBy: "System" },
            { status: "PACKED", comment: "Quality inspected and bubble wrapped", createdBy: "Warehouse Admin" },
            { status: "SHIPPED", comment: "Handed over to Delhivery Air Express (AWB: DEL-8492019482)", createdBy: "Organichy Admin" },
          ],
        },
        payments: {
          create: {
            amount: 551.65,
            currency: "INR",
            provider: "RAZORPAY",
            transactionId: "pay_test_983149814",
            status: "COMPLETED",
          },
        },
        shipments: {
          create: {
            trackingNumber: "DEL-8492019482",
            courier: "Delhivery Air Express",
            status: "IN_TRANSIT",
            shippedAt: new Date(),
            trackingUrl: "https://www.delhivery.com/track/package/DEL-8492019482",
          },
        },
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        adminId: adminUser.id,
        adminEmail: adminUser.email,
        action: "ORDER_FULFILLMENT_UPDATE",
        entity: "Order",
        entityId: demoOrder.id,
        detailsJson: JSON.stringify({ newStatus: "SHIPPED", trackingNumber: "DEL-8492019482" }),
      },
    });
  }

  // Seed Advertisement Videos
  await prisma.advertisementVideo.createMany({
    data: [
      {
        title: "Slow Roasted Dark Crunchy Peanut Butter",
        description: "Watch our slow-roasting craft in Gujarat. 100% single-origin peanuts ground fresh.",
        videoUrl: "/uploads/videos/craft-stoneground-roast.mp4",
        productLink: "/shop",
        tagText: "BESTSELLER • 32G PROTEIN",
        displayOrder: 1,
        active: true,
      },
      {
        title: "Belgian Dark Chocolate Peanut Indulgence",
        description: "Real cocoa bean roast blended with fresh roasted peanuts. Pure melt-in-mouth bliss.",
        videoUrl: "/uploads/videos/creamy-velvety-drizzle.mp4",
        productLink: "/collections/chocolate-collection",
        tagText: "CHEF SPECIAL • KETO",
        displayOrder: 2,
        active: true,
      },
      {
        title: "100% Natural Zero Sugar Zero Salt Spread",
        description: "Only one single pure ingredient. Clean athlete fuel trusted by gym trainers.",
        videoUrl: "/uploads/videos/crunchy-organic-peanut-butter.mp4",
        productLink: "/shop",
        tagText: "CLEAN FUEL • 100% PURE",
        displayOrder: 3,
        active: true,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
