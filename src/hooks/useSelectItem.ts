import React, { useCallback, useState } from "react";
import { Item } from "@/types/Item";

type Props = {
  id: number;
  items: Array<Item>;
};

// 選択したユーザー情報を特定し、モーダルを表示するカスタムフック
const useSelectItem = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const onSelectItem = useCallback((props: Props) => {
    const { id, items } = props;
    const targetItem = items.find((item) => item.id === id);
    setSelectedItem(targetItem!);
  }, []);

  return { onSelectItem, selectedItem };
};

export default useSelectItem;
