import React from "react";
import EditQuestionPaperPageClient from "./EditQuestionPaperPageClient";

// Server Component wrapper to handle params
export default async function EditQuestionPaperPageWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditQuestionPaperPageClient id={id} />;
} 