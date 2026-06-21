import { NextResponse } from "next/server";
import { uploadFile, updateDocument, getDocument, removeFile } from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    const formData = await req.formData();
    const file = formData.get("file");
    
    let fileUrl = null;
    const oldData = await getDocument("free_panels", id);
    
    if (!oldData) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    if (file && file.name !== "nofile.txt" && file.size > 0) {
      fileUrl = await uploadFile(file, "free_panels");
      if (oldData.panel_url) {
        await removeFile(oldData.panel_url);
      }
    } else {
      fileUrl = oldData.panel_url;
    }

    let links = [];
    try { links = JSON.parse(formData.get("links") || "[]"); } catch {}
    const updateData = {
      panel_name: formData.get("panel_name") || "",
      username: formData.get("username") || "",
      password: formData.get("password") || "",
      message: formData.get("message") || "",
      video_url: formData.get("video_url") || "",
      download_link: formData.get("download_link") || "",
      links: links,
      panel_url: fileUrl,
      react_enabled: formData.get("react_enabled") !== "false"
    };

    await updateDocument("free_panels", id, updateData);
    
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
