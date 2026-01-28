'use client'

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginComponent from "@/components/Login";

function LoginWithParams() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo'); 

  return <LoginComponent tipoPredefinido={tipo} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D4F97]"></div>}>
      <LoginWithParams />
    </Suspense>
  );gi
}