import { axiosClient } from "@/lib/api";
import useNotificationStore from "@/store/NotificationStore";

export default async function getUnreadNotifications() {
  const { setUnreadCount } = useNotificationStore.getState();
  try {
    const result = await axiosClient.get("/notification/unread");
    setUnreadCount(result.data?.unreadCount || 0);
  } catch {}
}
