"use client";

import { useMemo, useState } from "react";
import { AppScreen } from "@/components/AppScreen";
import { careMessages } from "@/lib/mockData";

export function ChildSignalMockup({ html }: { html: string }) {
  const [reply, setReply] = useState(careMessages.latestReply.message);
  const [timeAgo, setTimeAgo] = useState(careMessages.latestReply.timeAgo);

  const renderedHtml = useMemo(() => {
    return html.replace('"잘 먹었어요!" · 8분 전', `"${reply}" · ${timeAgo}`);
  }, [html, reply, timeAgo]);

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;

    if (!target) {
      return;
    }

    let node: HTMLElement | null = target;

    while (node && node !== event.currentTarget) {
      const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
      const selectedReply = careMessages.quickReplies.find((quickReply) => text === quickReply);

      if (selectedReply) {
        setReply(selectedReply);
        setTimeAgo("방금 전");
        return;
      }

      node = node.parentElement;
    }
  }

  return (
    <AppScreen>
      <div
        style={{
          minHeight: "100vh"
        }}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </AppScreen>
  );
}
