import React, { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { allItemsState } from "@/components/atoms/recoil/allItems-state";
import { Item } from "../types/Item";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase/firebase";

const useAllItems = () => {
  const [loading, setLoading] = useState(true);
  const [allItems, setAllItems] = useRecoilState<Item[]>(allItemsState);

  const itemsRef = collection(db, "items");

  const getAllItems = useCallback(async () => {
    setLoading(true);
    const querySnapshot = await getDocs(itemsRef);
    const newArray: Item[] = [];

    querySnapshot.forEach((doc) => {
      const array = doc.data();
      newArray.push(array as Item); //arrayがDocumentDataになるのでasで型付け
    });
    newArray.sort((a, b) => a.id - b.id);
    setAllItems(newArray);
  }, []);

  return { getAllItems, loading, setLoading };
};

export default useAllItems;
