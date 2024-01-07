"use client";

import { useTransition } from "react";

function ImperativeServerAction({ title, action, ...props }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await action();
          } catch (e) {
            alert(e.message);
          }
        });
      }}
      {...props}
    >
      {title}
    </button>
  );
}

export default ImperativeServerAction;
