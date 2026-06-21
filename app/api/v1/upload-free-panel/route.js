import { NextResponse } from "next/server";
import { uploadFile, addDocument } from "@/lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const fileUrl = await uploadFile(file, "free_panels");
    await addDocument("free_panels", {
      panel_name: formData.get("panel_name") || "",
      username: formData.get("username") || "",
      password: formData.get("password") || "",
      message: formData.get("message") || "",
      video_url: formData.get("video_url") || "",
      download_link: formData.get("download_link") || "",
      panel_url: fileUrl,
      reacts: 0,
      react_enabled: formData.get("react_enabled") !== "false"
    });
    return NextResponse.json({ success: true, message: "Uploaded successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
