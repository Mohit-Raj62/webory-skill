import { NextResponse } from "next/server";
import { generatePayUHash } from "@/lib/payu";
import { cookies } from "next/headers";

const PAYU_KEY = process.env.PAYU_KEY || "your_merchant_key";
const PAYU_SALT = process.env.PAYU_SALT || "your_salt";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { txnid, amount, productinfo, firstname, email, udf1, udf2, udf3 } =
      body;

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const hash = generatePayUHash(
      {
        key: PAYU_KEY,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1, // userId
        udf2, // type: 'course' | 'internship'
        udf3, // resourceId
      },
      PAYU_SALT
    );

    return NextResponse.json({ hash, key: PAYU_KEY });
  } catch (error) {
    console.error("PayU Hash Generation Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
