import type { ReactNode } from "react";
import Task1AuthGuard from "@/components/task1/auth-guard";
import Task1Shell from "@/components/task1/shell";

export default function Task1ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <Task1AuthGuard>
      <Task1Shell>{children}</Task1Shell>
    </Task1AuthGuard>
  );
}
