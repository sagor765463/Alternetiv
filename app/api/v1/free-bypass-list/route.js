import { NextResponse } from "next/server";
import { getCollection } from "@/lib/db";

export async function GET() {
  try {
    const data = await getCollection("free_bypasses");
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
