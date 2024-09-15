import { IList } from "../Materials/UserLists";

export const MockData: IList = {
  "app-lists": {
    id: "b4d2290e-6e67-4df4-a4ab-59faf056d7e5",
    listName: "Your List Name", // Add appropriate list name
    thematic: "Your Thematic", // Add appropriate thematic
    description: "On va bien manger",
    beneficiaries: [
      {
        "app-users": {
          userName: "User Name", // Add appropriate user name
          user_id: "user_id_here", // Add appropriate user ID
        },
      },
    ],
    items: [
      {
        id: "25",
        updated_at: "2024-06-01T11:31:08.800907",
        content: "lala",
        statusOpen: true,
      },
      {
        id: "26",
        updated_at: "2024-06-01T11:36:14.04821",
        content: "pâté",
        statusOpen: true,
      },
      {
        id: "27",
        updated_at: "2024-06-01T11:36:26.379138",
        content: "lêlê",
        statusOpen: true,
      },
      {
        id: "28",
        updated_at: "2024-06-01T11:36:39.737413",
        content: "iolol",
        statusOpen: true,
      },
    ],
  },
};
