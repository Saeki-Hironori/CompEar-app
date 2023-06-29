import React, { useState, useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { allItemsState } from "../../lib/recoil/allItems_state";
import { Item } from "../types/Item";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase/firebase";
import { itemsState } from "../../lib/recoil/items_state";

const useAllItems = () => {
  const [loading, setLoading] = useState(true);
  const setAllItems = useSetRecoilState<Item[]>(allItemsState);
  const setItems = useSetRecoilState<Item[]>(itemsState);

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
    setItems(newArray);
  }, []);

  return { getAllItems, loading, setLoading };
};

export default useAllItems;
