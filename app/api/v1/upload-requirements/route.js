import { NextResponse } from "next/server";
import { uploadFile, addDocument } from "@/lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileUrl = await uploadFile(file, "requirements");
    await addDocument("requirements", {
      req_name: formData.get("req_name") || "",
      req_url: fileUrl,
      reacts: 0,
      react_enabled: formData.get("react_enabled") !== "false"
    });
    return NextResponse.json({ success: true, message: "Uploaded successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
