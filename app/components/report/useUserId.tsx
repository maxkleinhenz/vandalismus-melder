import { useEffect, useState } from "react";

export default function useUserId() {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    let u = localStorage.getItem("userId");
    if (!u) {
      u = crypto.randomUUID();
      localStorage.setItem("userId", u);
    }

    setUserId(u);
  }, []);

  return userId;
}
