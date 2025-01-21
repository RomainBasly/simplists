export async function handleNotificationStatusChange(
  notificationId: number,
  isNew: boolean
): Promise<any> {
  try {
    const response = await fetch(
      `/api/notifications/handleNotificationStatusChange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ notificationId, isNew }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
export async function handleDeleteNotification(
  notificationId: number
): Promise<any> {
  try {
    const response = await fetch(`/api/notifications/deleteNotification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ notificationId }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
