import { NextResponse } from "next/server";

const METRO_PINCODES: Record<string, { city: string; state: string; days: number }> = {
  "110": { city: "New Delhi", state: "Delhi", days: 2 },
  "122": { city: "Gurugram", state: "Haryana", days: 2 },
  "201": { city: "Noida", state: "Uttar Pradesh", days: 2 },
  "400": { city: "Mumbai", state: "Maharashtra", days: 2 },
  "560": { city: "Bengaluru", state: "Karnataka", days: 2 },
  "500": { city: "Hyderabad", state: "Telangana", days: 2 },
  "600": { city: "Chennai", state: "Tamil Nadu", days: 3 },
  "700": { city: "Kolkata", state: "West Bengal", days: 3 },
  "380": { city: "Ahmedabad", state: "Gujarat", days: 2 },
  "411": { city: "Pune", state: "Maharashtra", days: 2 },
};

export async function POST(req: Request) {
  try {
    const { pincode } = await req.json();

    const cleanPin = (pincode || "").toString().trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return NextResponse.json(
        { serviceable: false, error: "Please enter a valid 6-digit Indian PIN code." },
        { status: 400 }
      );
    }

    let detectedCity = "";
    let detectedState = "";

    // 1. Try real-time official India Post PIN Lookup with 3s timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const po = data[0].PostOffice[0];
          detectedCity = po.District || po.Name || "";
          detectedState = po.State || "";
        }
      }
    } catch (e) {
      // Fallback to local table if offline or slow
    }

    // 2. Fallback to local metro lookup if external API didn't resolve
    const prefix = cleanPin.substring(0, 3);
    const metroInfo = METRO_PINCODES[prefix];

    if (!detectedCity && metroInfo) {
      detectedCity = metroInfo.city;
      detectedState = metroInfo.state;
    }

    const days = metroInfo ? metroInfo.days : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + days);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(estDate);

    return NextResponse.json({
      serviceable: true,
      pincode: cleanPin,
      city: detectedCity,
      state: detectedState,
      location: detectedCity ? `${detectedCity}, ${detectedState}` : (metroInfo ? `${metroInfo.city}, ${metroInfo.state}` : "India"),
      estimatedDeliveryDays: days,
      estimatedDeliveryDate: formattedDate,
      codAvailable: true,
      prepaidAvailable: true,
      expressShippingAvailable: true,
      message: `Delivery available! Expected by ${formattedDate}`,
    });
  } catch (error) {
    return NextResponse.json(
      { serviceable: false, error: "Unable to verify PIN code right now." },
      { status: 500 }
    );
  }
}
