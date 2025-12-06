import api from "./api";
import { getVisitorId } from "../utils/visitorId";

export const trackProjectView = async (projectId: string) => {
  try {
    const visitorId = getVisitorId();
    
    await api.post("/track-view", {
      projectId,
      visitorId
    });
  } catch (error) {
    // Silently fail - don't break the app if tracking fails
    console.error("Failed to track project view:", error);
  }
};

