"use client";

import { useQuery } from "@tanstack/react-query";
import { templatesApi } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates.all(),
    queryFn: templatesApi.getAll,
    staleTime: Infinity, // templates never change at runtime
  });
}
