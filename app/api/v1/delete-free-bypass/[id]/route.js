import { NextResponse } from "next/server";
import { removeDocument } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await removeDocument("free_bypasses", id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
