import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Info,
  PlayCircle,
  UserRound,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import SidebarAdmin from "../components/admin/SidebarAdmin";
import { apiFetch } from "../lib/apiClient";

export default function AdminContentDetailsPage() {
  const { id } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch(`/admin/lecture-notes/${id}`);

        setContent(response?.data ?? response);
      } catch (fetchError) {
        setError(
          fetchError.message || "Unable to load this content."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchContent();
    }
  }, [id]);

  const data = useMemo(() => {
    if (!content) return null;

    return normalizeContent(content);
  }, [content]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
        <SidebarAdmin activeItem="Content" />

        <main className="lg:ml-64">
          <header className="flex h-16 items-center border-b border-gray-100 bg-white px-5 sm:px-8">
            <a
              href="/admin-content"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
          </header>

          <div className="flex min-h-[70vh] items-center justify-center">
            <p className="text-sm text-gray-500">
              Loading content...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
        <SidebarAdmin activeItem="Content" />

        <main className="lg:ml-64">
          <header className="flex h-16 items-center border-b border-gray-100 bg-white px-5 sm:px-8">
            <a
              href="/admin-content"
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-pf-purple"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <p className="text-sm font-medium text-red-700">
                {error || "Content not found."}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9FB] font-sans text-[#302C38]">
      <SidebarAdmin activeItem="Content" />

      <main className="lg:ml-64">
        {/* HEADER */}
        <header className="flex h-16 items-center justify-between border-b border-gray-100 bg-white px-5 sm:px-8">
          <div className="flex items-center gap-3">
            <a
              href="/admin-content"
              className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-pf-purple"
              aria-label="Back to content"
            >
              <ArrowLeft className="h-5 w-5" />
            </a>

            <p className="hidden text-sm text-gray-500 sm:block">
              Content / {data.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-semibold text-pf-purple-dark">
                Super Admin
              </p>

              <p className="text-[11px] text-gray-400">
                Platform Administrator
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pf-purple text-xs font-semibold text-white">
              SA
            </div>
          </div>
        </header>

        {/* PAGE */}
        <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8">
          {/* PAGE HEADER */}
          <section>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-pf-purple">
                    CONTENT DETAILS
                  </p>

                  <StatusBadge status={data.status} />
                </div>

                <h1 className="mt-1 max-w-3xl font-serif text-2xl font-medium text-pf-purple-dark sm:text-3xl">
                  {data.title}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Content ID:{" "}
                  <span className="font-medium text-gray-700">
                    {data.id}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.fileUrl && (
                  <a
                    href={data.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                )}

                <a
                  href="/admin-content"
                  className="inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-pf-purple-dark"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to content
                </a>
              </div>
            </div>
          </section>

          {/* MAIN GRID */}
          <section className="mt-7 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
            {/* LEFT */}
            <div className="space-y-6">
              {/* CONTENT PREVIEW */}
              <SectionCard
                title="Content preview"
                description="Preview the educational material uploaded by the teacher."
                icon={Eye}
              >
                <ContentViewer data={data} />
              </SectionCard>

              {/* DESCRIPTION */}
              <SectionCard
                title="Description"
                description="Information provided by the teacher about this content."
                icon={FileText}
              >
                <div className="rounded-xl bg-[#FAF9FB] p-5">
                  <p className="text-sm leading-7 text-gray-600">
                    {data.description || "No description provided."}
                  </p>
                </div>
              </SectionCard>

              {/* ACADEMIC INFORMATION */}
              <SectionCard
                title="Academic information"
                description="Where this content is used on the platform."
                icon={BookOpen}
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Subject"
                    value={data.subject}
                  />

                  <InfoBox
                    label="Level"
                    value={data.level}
                  />

                  <InfoBox
                    label="Class"
                    value={data.classrooms}
                  />

                  <InfoBox
                    label="Type"
                    value={data.type}
                  />

                  <InfoBox
                    label="Created"
                    value={data.createdAt}
                  />
                </div>
              </SectionCard>
            </div>

            {/* RIGHT */}
            <aside className="space-y-6">
              {/* TEACHER */}
              <SectionCard
                title="Teacher"
                description="Content owner."
                icon={UserRound}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pf-purple-light">
                    <UserRound className="h-5 w-5 text-pf-purple" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-pf-purple-dark">
                      {data.teacherName}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {data.teacherEmail || "No email"}
                    </p>
                  </div>
                </div>
              </SectionCard>

              {/* FILE INFORMATION */}
              <SectionCard
                title="File information"
                description="Technical information about the uploaded file."
                icon={Info}
              >
                <div className="space-y-4">
                  <DetailRow
                    label="File name"
                    value={data.fileName}
                  />

                  <DetailRow
                    label="Type"
                    value={data.mimeType}
                  />

                  <DetailRow
                    label="Size"
                    value={data.fileSize}
                  />


                  <DetailRow
                    label="Status"
                    value={data.status}
                  />
                </div>
              </SectionCard>

              {/* ADMIN ACTIONS */}
              <SectionCard
                title="Administrative actions"
                description="Manage the publication status of this content."
                icon={ClipboardCheck}
              >
                <div className="space-y-2">
                  {data.status === "Pending Review" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            id,
                            "approved",
                            setContent,
                            setError
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-xl border border-green-100 px-4 py-3 text-left text-xs font-medium text-green-600 transition hover:bg-green-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve content
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleStatusChange(
                            id,
                            "rejected",
                            setContent,
                            setError
                          )
                        }
                        className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-xs font-medium text-red-500 transition hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject content
                      </button>
                    </>
                  )}

                  {data.status === "Published" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          id,
                          "rejected",
                          setContent,
                          setError
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-red-100 px-4 py-3 text-left text-xs font-medium text-red-500 transition hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Unpublish content
                    </button>
                  )}

                  {data.status === "Rejected" && (
                    <button
                      type="button"
                      onClick={() =>
                        handleStatusChange(
                          id,
                          "approved",
                          setContent,
                          setError
                        )
                      }
                      className="flex w-full items-center gap-3 rounded-xl border border-green-100 px-4 py-3 text-left text-xs font-medium text-green-600 transition hover:bg-green-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Approve content
                    </button>
                  )}
                </div>
              </SectionCard>

              {/* NOTE */}
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />

                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Administrator note
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Make sure the material is appropriate for the
                      selected subject, level and class before
                      approving it.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ========================================================= */
/* CONTENT VIEWER                                             */
/* ========================================================= */

function ContentViewer({ data }) {
  const mime = String(data.mimeType || "").toLowerCase();
  const url = data.fileUrl;

  if (!url) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-[#FAF9FB]">
        <FileText className="h-12 w-12 text-gray-300" />

        <p className="mt-4 text-sm font-medium text-gray-500">
          No file available
        </p>

        <p className="mt-1 text-xs text-gray-400">
          This content does not have a previewable file.
        </p>
      </div>
    );
  }

  /* PDF */
  if (mime.includes("pdf") || url.toLowerCase().includes(".pdf")) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
        <iframe
          src={url}
          title={data.title}
          className="h-[700px] w-full"
        />
      </div>
    );
  }

  /* IMAGE */
  if (mime.startsWith("image/")) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-xl border border-gray-200 bg-[#FAF9FB] p-5">
        <img
          src={url}
          alt={data.title}
          className="max-h-[700px] max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>
    );
  }

  /* VIDEO */
  if (mime.startsWith("video/")) {
    return (
      <div className="overflow-hidden rounded-xl bg-black">
        <video
          controls
          className="max-h-[700px] w-full"
          src={url}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  /* AUDIO */
  if (mime.startsWith("audio/")) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-xl bg-[#FAF9FB] p-8">
        <div className="w-full max-w-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pf-purple-light">
            <PlayCircle className="h-8 w-8 text-pf-purple" />
          </div>

          <p className="mt-4 text-center text-sm font-semibold text-pf-purple-dark">
            {data.title}
          </p>

          <audio
            controls
            src={url}
            className="mt-6 w-full"
          />
        </div>
      </div>
    );
  }

  /* DOCX / OTHER */
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-[#FAF9FB] p-8 text-center">
      <FileText className="h-14 w-14 text-pf-purple" />

      <h3 className="mt-4 font-serif text-lg text-pf-purple-dark">
        {data.fileName}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        This file format cannot be previewed directly in the
        browser.
      </p>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        download
        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-pf-purple px-4 py-2.5 text-xs font-medium text-white hover:bg-pf-purple-dark"
      >
        <Download className="h-4 w-4" />
        Download file
      </a>
    </div>
  );
}

/* ========================================================= */
/* SECTION CARD                                               */
/* ========================================================= */

function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pf-purple-light">
              <Icon className="h-4 w-4 text-pf-purple" />
            </div>
          )}

          <div>
            <h2 className="font-serif text-lg text-pf-purple-dark">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
}

/* ========================================================= */
/* INFO BOX                                                    */
/* ========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl bg-[#FAF9FB] p-4">
      <p className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-pf-purple-dark">
        {value || "—"}
      </p>
    </div>
  );
}

/* ========================================================= */
/* DETAIL ROW                                                  */
/* ========================================================= */

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-gray-400">
        {label}
      </span>

      <span className="max-w-[60%] break-words text-right text-xs font-medium text-pf-purple-dark">
        {value || "—"}
      </span>
    </div>
  );
}

/* ========================================================= */
/* STATUS BADGE                                                */
/* ========================================================= */

function StatusBadge({ status }) {
  const styles = {
    Published: "bg-green-50 text-green-600",
    "Pending Review": "bg-amber-50 text-amber-600",
    Rejected: "bg-red-50 text-red-500",
    Draft: "bg-gray-100 text-gray-500",
  };

  const Icon =
    status === "Published"
      ? CheckCircle2
      : status === "Pending Review"
      ? ClipboardCheck
      : status === "Rejected"
      ? XCircle
      : FileText;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/* ========================================================= */
/* NORMALIZE CONTENT                                          */
/* ========================================================= */

function normalizeContent(content) {
  const subject = content?.subject ?? {};
  const teacher = content?.teacher ?? {};
  const teacherUser = teacher?.user ?? {};

  const levels = Array.isArray(subject?.levels)
    ? subject.levels
    : [];

  const statusLabels = {
    approved: "Published",
    pending: "Pending Review",
    rejected: "Rejected",
    draft: "Draft",
  };

  /*
   * Selon ton API, le fichier peut arriver sous différents noms.
   * On essaie plusieurs possibilités.
   */
  const fileUrl =
    content?.file_url ||
    content?.fileUrl ||
    content?.url ||
    content?.file?.url ||
    content?.media?.url ||
    null;

  const fileName =
    content?.file_name ||
    content?.fileName ||
    content?.file?.name ||
    extractFileName(fileUrl) ||
    "—";

  const mimeType =
    content?.mime_type ||
    content?.mimeType ||
    content?.file?.mime_type ||
    detectMimeType(fileName);

  return {
    id: content?.id,
    title: content?.title || "Untitled content",

    type:
      content?.type ||
      detectContentType(mimeType),

    status:
      statusLabels[content?.status] ||
      content?.status ||
      "Unknown",

    description:
      content?.description ||
      content?.content ||
      "",

    subject:
      subject?.name ||
      "—",

    level:
      levels
        .map((level) => level?.name)
        .filter(Boolean)
        .join(", ") ||
      content?.level?.name ||
      "—",

    classrooms:
      levels
        .flatMap((level) => level?.classrooms ?? [])
        .map((classroom) => classroom?.name)
        .filter(Boolean)
        .join(", ") ||
      "—",

    teacherName:
      [teacherUser?.first_name, teacherUser?.last_name]
        .filter(Boolean)
        .join(" ") ||
      "—",

    teacherEmail:
      teacherUser?.email ||
      "",

    createdAt:
      content?.created_at
        ? formatDate(content.created_at)
        : "—",

    fileUrl,
    fileName,
    mimeType,
  };
}

/* ========================================================= */
/* STATUS UPDATE                                              */
/* ========================================================= */

async function handleStatusChange(
  id,
  status,
  setContent,
  setError
) {
  try {
    setError("");

    /*
     * Adapte cette route si ton backend utilise
     * une autre route pour approve/reject.
     */
    const response = await apiFetch(
      `/admin/lecture-notes/${id}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    );

    const updated = response?.data ?? response;

    setContent((current) => ({
      ...current,
      ...(updated || {}),
      status,
    }));
  } catch (error) {
    setError(
      error.message ||
        "Unable to update content status."
    );
  }
}

/* ========================================================= */
/* HELPERS                                                     */
/* ========================================================= */

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function extractFileName(url) {
  if (!url) return null;

  try {
    const cleanUrl = url.split("?")[0];
    const parts = cleanUrl.split("/");

    return decodeURIComponent(
      parts[parts.length - 1]
    );
  } catch {
    return null;
  }
}

function detectMimeType(fileName) {
  const extension =
    fileName?.split(".").pop()?.toLowerCase();

  const types = {
    pdf: "application/pdf",

    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",

    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",

    mp3: "audio/mpeg",
    wav: "audio/wav",

    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };

  return types[extension] || "application/octet-stream";
}

function detectContentType(mimeType) {
  const mime = String(mimeType || "").toLowerCase();

  if (mime.includes("pdf")) {
    return "Document";
  }

  if (mime.startsWith("image/")) {
    return "Image";
  }

  if (mime.startsWith("video/")) {
    return "Video";
  }

  if (mime.startsWith("audio/")) {
    return "Audio";
  }

  return "Document";
}