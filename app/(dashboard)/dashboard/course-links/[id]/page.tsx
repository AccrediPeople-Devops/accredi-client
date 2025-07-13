import React, { use } from "react";
import CourseLinkDetails from "./CourseLinkDetails";

export default function CourseLinkDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <CourseLinkDetails id={id} />;
} 