import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequestJson } from "@/lib/queryClient";
import type { User } from "@shared/schema";

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return null; // Return null instead of throwing an error
      }
      return apiRequestJson<User>("GET", "/api/auth/user");
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("authToken"), // Only run query if token exists
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Remove token from localStorage
      localStorage.removeItem("authToken");
      // Call logout endpoint (optional, mainly for server-side cleanup)
      await apiRequestJson("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      // Clear all queries to reset app state
      queryClient.clear();
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!localStorage.getItem("authToken"),
    isAdmin: user?.role === "admin",
    logout,
  };
}
