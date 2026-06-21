import { NextResponse } from "next/server";
import { uploadFile, updateDocument, getDocument, removeFile } from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    const formData = await req.formData();
    const file = formData.get("file");
    
    let fileUrl = null;
    const oldData = await getDocument("free_bypasses", id);
    
    if (!oldData) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    if (file && file.name !== "nofile.txt" && file.size > 0) {
      fileUrl = await uploadFile(file, "free_bypasses");
      if (oldData.bypass_url) {
        await removeFile(oldData.bypass_url);
      }
    } else {
      fileUrl = oldData.bypass_url;
    }

    const updateData = {
      bypass_name: formData.get("panel_name") || "",
      username: formData.get("username") || "",
      password: formData.get("password") || "",
      message: formData.get("message") || "",
      video_url: formData.get("video_url") || "",
      download_link: formData.get("download_link") || "",
      bypass_url: fileUrl,
      react_enabled: formData.get("react_enabled") !== "false"
    };

    await updateDocument("free_bypasses", id, updateData);
    
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
