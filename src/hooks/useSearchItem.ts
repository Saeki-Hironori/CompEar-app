import { Item } from "@/types/Item";
import React, { useCallback, useState } from "react";

const useSearchItem = () => {
  const [searchedItems, setSearchedItems] = useState<Item | null>(null);

  const onSearchItem = useCallback((props: any) => {
    const { make } = props;
  }, []);

  return {};
};

export default useSearchItem;
