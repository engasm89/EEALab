"use client";

import { useRef, useState } from "react";

export function AdminAssetUploader({ projectId }: { projectId: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setStatus("uploading");
    setMessage(null);

    const metaRes = await fetch("/api/admin/assets/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,
        projectId,
        contentType: file.type || "application/octet-stream",
      }),
    });
    if (!metaRes.ok) {
      setStatus("error");
      setMessage(await metaRes.text());
      return;
    }

    const meta = (await metaRes.json()) as { signedUrl: string; token: string; path: string; publicUrl: string };
    const uploadRes = await fetch(meta.signedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type || "application/octet-stream" },
      body: file,
    });
    if (!uploadRes.ok) {
      setStatus("error");
      setMessage("Upload failed");
      return;
    }

    const assetRes = await fetch("/api/admin/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: projectId,
        asset_type: "screenshot",
        url: meta.publicUrl,
        caption: file.name,
        sort_order: 0,
      }),
    });
    if (!assetRes.ok) {
      setStatus("error");
      setMessage(await assetRes.text());
      return;
    }

    setStatus("success");
    setMessage("Asset uploaded and attached.");
  }

  return (
    <div className="rounded-xl border border-white/10 bg-background/20 p-4">
      <div className="text-sm font-semibold">Upload Asset</div>
      <p className="mt-1 text-xs text-muted">Upload image/video and attach to project assets.</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => void handleFiles(e.target.files)}
          className="hidden"
          accept="image/*,video/*"
        />
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-background"
        >
          {status === "uploading" ? "Uploading..." : "Choose file"}
        </button>
      </div>
      {message ? <p className="mt-2 text-xs text-muted">{message}</p> : null}
    </div>
  );
}

