"use client";

import dynamic from "next/dynamic";

export const ILayout = dynamic(() => import("@/components/ILayout"), {
  ssr: false,
});

export const FormInput = dynamic(
  () => import("@/components/utils/FormUtils").then((d) => d.FormInput),
  {
    ssr: false,
  }
);

export const ViewFiles = dynamic(
  () => import("@/components/utils/LayoutUtils").then((d) => d.ViewFiles),
  {
    ssr: false,
  }
);
