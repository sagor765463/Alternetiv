import { NextResponse } from "next/server";
import { uploadFile, updateDocument, getDocument, removeFile } from "@/lib/db";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });

    const formData = await req.formData();
    const file = formData.get("file");
    
    let fileUrl = null;
    const oldData = await getDocument("requirements", id);
    
    if (!oldData) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    if (file && file.name !== "nofile.txt" && file.size > 0) {
      fileUrl = await uploadFile(file, "requirements");
      if (oldData.req_url) {
        await removeFile(oldData.req_url);
      }
    } else {
      fileUrl = oldData.req_url;
    }

    const updateData = {
      req_name: formData.get("req_name") || "",
      message: formData.get("message") || "",
      video_url: formData.get("video_url") || "",
      req_url: fileUrl,
      react_enabled: formData.get("react_enabled") !== "false"
    };

    await updateDocument("requirements", id, updateData);
    
    return NextResponse.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
