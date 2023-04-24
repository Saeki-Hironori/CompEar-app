import { User } from "firebase/auth";
import React, { useCallback, useState } from "react";

type Props = {
  uid: string;
  users: Array<User>;
  onOpen: () => void;
};

// 選択したユーザー情報を特定し、モーダルを表示するカスタムフック
const useSelectUser = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const onSelectUser = useCallback((props: Props) => {
    const { uid, users, onOpen } = props;
    const targetUser = users.find((user) => user.uid === uid);
    setSelectedUser(targetUser!);
    onOpen();
  }, []);

  return { onSelectUser, selectedUser };
};

export default useSelectUser;
