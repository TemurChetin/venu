"use client";
import { useInView } from "@/hooks/useInView";

export function LazySection({
  children,
  skeleton,
}: {
  children: React.ReactNode;
  skeleton: React.ReactNode;
}) {
  const { ref, isInView } = useInView();

  return <div ref={ref}>{isInView ? children : skeleton}</div>;
}
