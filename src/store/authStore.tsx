import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiHandle, endpoints } from "@/api/api";

// Define the complete state type
type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  userInfo?: any | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserInfo: () => Promise<void>;
};

// API key from environment variables
const getApiKey = () => process.env.NEXT_PUBLIC_API_KEY || "";

// Zustand store with correct typing
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      loading: false,
      error: null,
      userInfo: null,

      // Login function
      login: async (username: string, password: string): Promise<boolean> => {
        try {
          set({ loading: true, error: null });

          const headers: HeadersInit = new Headers();
          headers.append("Content-Type", "application/json");

          const apiKey = getApiKey();
          headers.append("api-key", apiKey);

          console.log("Sending login request with api-key");

          const response = await fetch(`${apiHandle}${endpoints.login}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ username, password }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || "Login failed";
            set({ loading: false, error: errorMessage });
            return false;
          }

          // Đọc và xử lý dữ liệu từ login API - bỏ comment dòng này
          const data = await response.json();
          console.log("Login successful, setting isAuthenticated to true");

          // Cập nhật trạng thái xác thực trước
          set({
            isAuthenticated: true,
            loading: false,
          });

          // Sau khi đăng nhập thành công, gọi API lấy thông tin người dùng
          console.log("Fetching user information after login");

          const userHeaders: HeadersInit = new Headers();
          userHeaders.append("Content-Type", "application/json");
          userHeaders.append("api-key", getApiKey());

          // Nếu API login trả về token, thêm vào header
          if (data && data.token) {
            userHeaders.append("Authorization", `Bearer ${data.token}`);
          }

          const userResponse = await fetch(
            `${apiHandle}${endpoints.currentUser}`,
            { method: "GET", headers: userHeaders }
          );

          console.log("User info API response status:", userResponse.status);

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("User data received, updating state");
            set({ userInfo: userData });
          } else {
            console.error(
              "Failed to fetch user data:",
              await userResponse.text()
            );
          }

          return true;
        } catch (error) {
          console.error("Login error:", error);
          set({
            isAuthenticated: false,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "An unknown error occurred",
          });
          return false;
        }
      },

      // Fetch user information
      fetchUserInfo: async () => {
        if (!get().isAuthenticated) return;

        try {
          set({ loading: true });

          const headers: HeadersInit = new Headers();
          headers.append("Content-Type", "application/json");

          const apiKey = getApiKey();
          headers.append("api-key", apiKey);

          const response = await fetch(`${apiHandle}${endpoints.currentUser}`, {
            method: "GET",
            headers,
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userData = await response.json();
          set({ userInfo: userData, loading: false });
        } catch (error) {
          console.error("Error fetching user info:", error);
          set({ loading: false, error: "Failed to fetch user information" });
        }
      },

      // Logout function
      logout: async () => {
        try {
          set({ loading: true });

          const headers: HeadersInit = new Headers();
          const apiKey = getApiKey();
          if (apiKey) {
            headers.append("api-key", apiKey);
          }

          // Call logout API
          const response = await fetch(`${apiHandle}${endpoints.logout}`, {
            method: "POST",
            headers,
          });

          if (!response.ok) {
            console.warn(
              "Logout API call failed, but proceeding with local logout"
            );
          }

          // Update state
          set({
            isAuthenticated: false,
            userInfo: null,
            loading: false,
            error: null,
          });

          // Navigate to login page
          window.location.href = "/login";
        } catch (error) {
          console.error("Error during logout:", error);

          // Even if API fails, we should still log out locally
          set({
            isAuthenticated: false,
            userInfo: null,
            loading: false,
          });

          window.location.href = "/login";
        }
      },
    }),
    {
      name: "auth-storage",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,

      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userInfo: state.userInfo,
      }),
    }
  )
);

// Utility function for making authenticated requests
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
    "Content-Type": "application/json",
  };

  const apiKey = getApiKey();
  if (apiKey) {
    headers["api-key"] = apiKey;
  }

  try {
    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      return null;
    }

    return response;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
