import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";

type Props = {
  title: string;
  status: "info" | "warning" | "success" | "error";
};

const useMessage = () => {
  const toast = useToast();

  const showMessage = useCallback((props: Props) => {
    const { title, status } = props;
    toast({
      title,
      status,
      position: "top",
      duration: 2000,
      isClosable: true,
    });
  }, []);

  return { showMessage };
};

export default useMessage;
