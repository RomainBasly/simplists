import { useRouter } from "next/navigation";
import { UseCheckAccessTokenHealth } from "../Token/checkAccessTokenHealth";
import {
  sortListItemObjectByUpdatedDateDSC,
  sortListItemsByAlphabeticContent,
} from "@/components/Helpers";

import { useState, useCallback, useEffect } from "react";
import { IElement, IList, IResponse } from "../../../../types/types";

export default function useListData(listId: string | null) {
  const router = useRouter();
  const { checkToken } = UseCheckAccessTokenHealth();
  const [listTop, setListTop] = useState<IList | null>(null);
  const [listItems, setListItems] = useState<IElement[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchListInitialData = useCallback(async () => {
    try {
      const token = await checkToken();
      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      const response = await fetch(`/api/lists/getListItems?listId=${listId}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch lists items");
      }
      const data: IResponse = await response.json();

      if (data) {
        // Todo - externalize this part to a devoted function
        if (data[0]["app-lists"].items) {
          const LIVE = data[0]["app-lists"].items
            .filter((item) => item.statusOpen === true)
            .sort(sortListItemObjectByUpdatedDateDSC);
          const CROSSED = data[0]["app-lists"].items.filter(
            (item) => item.statusOpen === false
          );

          CROSSED.sort(sortListItemsByAlphabeticContent);

          const sortedItems = [...LIVE, ...CROSSED];
          setListItems(sortedItems);
        }

        const topElements: IList = {
          ...data[0],
          "app-lists": {
            ...data[0]["app-lists"],
          },
        };
        setListTop(topElements);
        setLoading(false);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching list items:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
      setLoading(false);
      router.push("/");
      // prévoir le cas où ce n'est pas où la personne n'est pas autorisée
    }
  }, [router, checkToken, listId]);

  useEffect(() => {
    if (listId) {
      fetchListInitialData();
    }
  }, [listId, fetchListInitialData]);

  return {
    loading,
    error,
    listTop,
    listItems,
    setListItems,
  };
}
