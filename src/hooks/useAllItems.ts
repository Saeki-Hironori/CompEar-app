import React, { useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { itemsState } from "@/components/atoms/recoil/items-state";
import { Item } from "../types/Item";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase/firebase";

const useAllItems = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useRecoilState<Item[]>(itemsState);

  const itemsRef = collection(db, "items");

  const getItems = useCallback(async () => {
    setLoading(true);
    const querySnapshot = await getDocs(itemsRef);
    const newArray: Item[] = [];

    querySnapshot.forEach((doc) => {
      const array = doc.data(); //firestoreのデータには型付けれない？
      newArray.push(array);
    });
    newArray.sort((a, b) => a.id - b.id);
    setItems(newArray);
  }, []);

  return { getItems, loading, items, setItems };
};

export default useAllItems;
