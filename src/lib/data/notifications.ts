import "server-only";

export interface NotificationRecord {
  id: string;
  userId: string;
  type: "NewMatch" | "EnquiryUpdate" | "PropertyUpdate" | "WatchlistRun";
  status: "Unread" | "Read";
  messageEn: string;
  messageEs: string | null;
  createdAt: string;
}

export async function getCustomerNotifications(
  _userId: string,
  _limit?: number,
): Promise<NotificationRecord[]> {
  return [];
}

export async function markNotificationRead(
  _userId: string,
  _notificationId: string,
): Promise<void> {
  // Mock implementation
}

export async function getUnreadNotificationCount(
  _userId: string,
): Promise<number> {
  return 0;
}
