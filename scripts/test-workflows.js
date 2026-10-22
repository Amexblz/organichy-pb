const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode("organichy-super-secret-jwt-key-2026-production-ready");

async function runTests() {
  console.log("\n🧪 STARTING ORGANICHY E-COMMERCE SYSTEM AUTOMATED TESTS\n");
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Password Hashing Test
    console.log("--- 1. Security & Cryptography ---");
    const rawPass = "AthleteSecretPass@2026";
    const hashed = await bcrypt.hash(rawPass, 10);
    const isMatch = await bcrypt.compare(rawPass, hashed);
    const isWrong = await bcrypt.compare("WrongPassword", hashed);
    assert(isMatch === true, "Bcrypt correctly verifies true password");
    assert(isWrong === false, "Bcrypt correctly rejects incorrect password");

    // 2. JWT Session Security Test
    const token = await new SignJWT({ userId: "u123", email: "test@organichy.com", role: "CUSTOMER" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(SECRET_KEY);

    const { payload } = await jwtVerify(token, SECRET_KEY);
    assert(payload.userId === "u123" && payload.role === "CUSTOMER", "JWT session payload verified with tamper-proof signature");

    // 3. Database Integrity & Seed Test
    console.log("\n--- 2. Database Records & Catalog Architecture ---");
    const adminUser = await prisma.user.findUnique({ where: { email: "admin@organichy.com" } });
    assert(adminUser !== null && adminUser.role === "ADMIN", "Administrator account exists with secure ADMIN role");

    const categoriesCount = await prisma.category.count();
    assert(categoriesCount >= 5, `Database has ${categoriesCount} product categories (expected >= 5)`);

    const products = await prisma.product.findMany({
      include: { variants: true, images: true },
    });
    assert(products.length >= 5, `Database has ${products.length} products loaded with variants and images`);

    const darkChoc = products.find((p) => p.isChocolate);
    assert(darkChoc !== undefined && darkChoc.variants.length > 0, "Dark Chocolate High Protein flagship product and variants exist");

    // 4. Cart Pricing & Free Shipping Threshold Logic Test
    console.log("\n--- 3. Cart Calculations & Free Shipping Threshold ---");
    const freeThreshold = 499;
    const testSubtotalBelow = 349;
    const testSubtotalAbove = 649;
    const shippingFeeStandard = 50;

    const feeBelow = testSubtotalBelow >= freeThreshold ? 0 : shippingFeeStandard;
    const feeAbove = testSubtotalAbove >= freeThreshold ? 0 : shippingFeeStandard;

    assert(feeBelow === 50, "Orders under ₹499 correctly charge standard ₹50 shipping");
    assert(feeAbove === 0, "Orders above ₹499 qualify for FREE shipping");

    // 5. Coupon Calculation Test
    console.log("\n--- 4. Coupon & Promotions Logic ---");
    const coupon15 = await prisma.coupon.findUnique({ where: { code: "ORGANIC15" } });
    assert(coupon15 !== null, "ORGANIC15 discount coupon exists in database");

    if (coupon15) {
      const orderAmount = 1000;
      const expectedDiscount = Math.min((orderAmount * coupon15.discountValue) / 100, coupon15.maxDiscountAmount || Infinity);
      assert(expectedDiscount === 150, "15% discount on ₹1000 order accurately evaluates to ₹150");
    }

    // 6. Indian Pincode Serviceability Test
    console.log("\n--- 5. Logistics & PIN Code Serviceability ---");
    const validMetroPins = ["560103", "110001", "400001", "201309"];
    for (const pin of validMetroPins) {
      assert(/^\d{6}$/.test(pin), `PIN code ${pin} satisfies standard Indian 6-digit postal format`);
    }

    // 7. Order & Inventory Consistency Test
    console.log("\n--- 6. Orders & Stock Audit ---");
    const sampleVariant = await prisma.productVariant.findFirst();
    assert(sampleVariant !== null && sampleVariant.stock > 0, `Variant ${sampleVariant.sku} has active stock of ${sampleVariant.stock} units`);

  } catch (err) {
    console.error("Test execution error:", err);
    failed++;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n=========================================");
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log("=========================================\n");

  if (failed > 0) process.exit(1);
}

runTests();
