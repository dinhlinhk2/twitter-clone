import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { axiosInstance } from "./utils/axios.js";

const defaultQueryFn = async ({ queryKey }) => {
  try {
    const { data } = await axiosInstance.get(
      `/${queryKey[0]}`,
    )
    return data
  } catch (error) {
    console.log(error);
    return null
  }
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      queryFn: defaultQueryFn
    }
  }
})
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
