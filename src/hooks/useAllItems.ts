import React, { useState, useCallback } from "react";
import { Item } from "../types/Item";
import useMessage from "./useMessage";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/components/firebase/firebase";

const useAllItems = () => {
  const { showMessage } = useMessage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Array<Item>>([]);

  const itemsRef = collection(db, "items");

  const getItems = useCallback(async () => {
    setLoading(true);
    const newArray: Item[] = [];
    const querySnapshot = await getDocs(itemsRef);
    querySnapshot.forEach((doc) => {
      const array = doc.data(); //firestoreのデータには型付けれない？
      newArray.push(array);
    });
    setItems(newArray);
    newArray.sort((a, b) => a.id - b.id);
  }, []);

  return { getItems, loading, items };
};

export default useAllItems;
