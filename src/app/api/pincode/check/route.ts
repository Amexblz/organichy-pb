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

    const prefix = cleanPin.substring(0, 3);
    const metroInfo = METRO_PINCODES[prefix];

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
      location: metroInfo ? `${metroInfo.city}, ${metroInfo.state}` : "India",
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
