import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liên hệ - XLab",
  description: "Liên hệ với XLab để được tư vấn về các giải pháp phần mềm",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 