"use client";

import { useEffect, useState } from "react";

export default function TestContainer() {
  const [testState, setTestState] = useState("");

  useEffect(() => {
    setTestState("client Component Test");
  }, []);

  return <div className="size-[100px] bg-black text-white">{testState}</div>;
}
