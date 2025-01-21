"use client";
import { getSocket } from "@/components/Elements/Socket";
import { sortListItemObjectByUpdatedDateDSC } from "@/components/Helpers";
import { Dispatch, SetStateAction, useEffect } from "react";
import { IElement } from "../../../../types/types";

export default function UseListSocket(
  setListItems: Dispatch<SetStateAction<IElement[] | null>>
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("add_item", (packet: any) => {
      setListItems((prevListItems) => {
        const { payload } = packet;
        const updatedListUnsorted = prevListItems
          ? [...prevListItems, payload.item[0]]
          : [payload.item[0]];

        const newLiveElementsSorted = updatedListUnsorted
          .filter((item) => item.statusOpen === true)
          .sort(sortListItemObjectByUpdatedDateDSC);
        const newCrossedElementsSorted = updatedListUnsorted
          .filter((item) => item.statusOpen === false)
          .sort(sortListItemObjectByUpdatedDateDSC);

        const newListElements = [
          ...newLiveElementsSorted,
          ...newCrossedElementsSorted,
        ];

        return newListElements;
      });
    });
    socket.on("delete_item", (packet: any) => {
      setListItems((prevListItems) => {
        const { payload } = packet;
        const updatedItems = prevListItems
          ? prevListItems.filter((item) => item.id !== payload.item.id)
          : null;
        return updatedItems || [];
      });
    });
    socket.on("change_item_status", (packet: any) => {
      setListItems((prevListItems) => {
        const { payload } = packet;
        if (prevListItems) {
          const filteredList = prevListItems.filter(
            (element) => element.id !== payload.item[0].id
          );
          const updatedListUnsorted = [...filteredList, payload.item[0]];

          const newLiveElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === true)
            .sort(sortListItemObjectByUpdatedDateDSC);
          const newCrossedElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === false)
            .sort(sortListItemObjectByUpdatedDateDSC);

          const newListElements = [
            ...newLiveElementsSorted,
            ...newCrossedElementsSorted,
          ];

          return newListElements;
        } else {
          return [];
        }
      });
    });
    socket.on("update_item_content", (packet: any) => {
      // TODO : refacto the way I transform the data before displaying it
      const { payload } = packet;
      setListItems((prevListItems) => {
        if (prevListItems) {
          const filteredList = prevListItems.filter(
            (element) => element.id !== payload.item[0].id
          );
          const updatedListUnsorted = [...filteredList, payload.item[0]];

          const newLiveElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === true)
            .sort(sortListItemObjectByUpdatedDateDSC);
          const newCrossedElementsSorted = updatedListUnsorted
            .filter((item) => item.statusOpen === false)
            .sort(sortListItemObjectByUpdatedDateDSC);

          const newListElements = [
            ...newLiveElementsSorted,
            ...newCrossedElementsSorted,
          ];

          return newListElements;
        } else {
          return [];
        }
      });
    });

    return () => {
      socket.off("add_item");
      socket.off("delete_item");
      socket.off("change_item_status");
      socket.off("update_item_content");
    };
  }, [setListItems]);
}
