"use client";

import { useState, useEffect } from "react";
import { countdownDisplay } from "@/lib/utils";

export function useCountdown(endsAt: string) {
  const [state, setState] = useState(() => countdownDisplay(endsAt));

  useEffect(() => {
    const tick = () => setState(countdownDisplay(endsAt));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  return state;
}
