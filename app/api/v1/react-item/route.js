import { NextResponse } from "next/server";
import { incrementReacts } from "@/lib/db";

const VALID_COLLECTIONS = ["free_panels", "free_bypasses", "requirements"];

export async function POST(req) {
  try {
    const { id, type, amount } = await req.json();

    if (!id || !type) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    if (!VALID_COLLECTIONS.includes(type)) {
      return NextResponse.json({ success: false, message: "Invalid collection type" }, { status: 400 });
    }

    // Amount should be either 1 or -1
    const reactAmount = amount === -1 ? -1 : 1;

    await incrementReacts(type, id, reactAmount);

    return NextResponse.json({ success: true, message: "React updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
