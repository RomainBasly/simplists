// "use client";
// import { useRouter } from "next/navigation";
// import { UseCheckAccessTokenHealth } from "../Token/checkAccessTokenHealth";
// import { useState, useCallback, useEffect } from "react";
// import { sortByDateAndByType } from "@/components/Utils/common";
// import { INotificationsList } from "@/components/Materials/NotificationsList/types";

// export default function useNotificationsData() {
//   const router = useRouter();
//   const { checkToken } = UseCheckAccessTokenHealth();
//   const [notificationsList, setNotificationsList] =
//     useState<INotificationsList>([]);
//   const [liveNotificationsNumber, setLiveNotificationsNumber] =
//     useState<number>(0);
//   const [error, setError] = useState<string>("");

//   const fetchInitialData = useCallback(async () => {
//     try {
//       const token = await checkToken();
//       if (!token) {
//         router.push("/login");
//         return;
//       }
//       const response = await fetch(`/api/notifications/get-notifications`, {
//         credentials: "include",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to fetch lists of notifications");
//       }
//       const data = await response.json();
//       const sortedData = sortByDateAndByType(data);
//       setNotificationsList(sortedData);
//       const liveNotificationNumber = sortedData.filter(
//         (notification) => notification.isNew
//       ).length;
//       setLiveNotificationsNumber(liveNotificationNumber);
//     } catch (err) {
//       console.error(err);
//     }
//   }, [router, checkToken]);

//   useEffect(() => {
//     fetchInitialData();
//   }, [fetchInitialData]);

//   return {
//     notificationsList,
//     liveNotificationsNumber,
//     setNotificationsList,
//     error,
//     setError,
//   };
// }
