import React from "react";
import ViewExamContent from "./ViewExamContent";

export default async function ViewExamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ViewExamContent id={id} />;
} 