"use client";

import { useRouter } from "next/navigation";

export type MockupAction = {
  text: string;
  href: string;
  storage?: {
    key: string;
    value: string;
  };
};

type InteractiveMockupShellProps = {
  html: string;
  actions?: MockupAction[];
};

export function InteractiveMockupShell({ html, actions = [] }: InteractiveMockupShellProps) {
  const router = useRouter();

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;

    if (!target || actions.length === 0) {
      return;
    }

    let node: HTMLElement | null = target;

    while (node && node !== event.currentTarget) {
      const nodeText = node.textContent ?? "";
      const normalizedNodeText = nodeText.replace(/\s+/g, " ").trim();
      const action = actions.find(({ text }) => {
        const normalizedText = text.replace(/\s+/g, " ").trim();

        return normalizedNodeText.includes(normalizedText) && normalizedNodeText.length <= normalizedText.length + 90;
      });

      if (action) {
        if (action.storage) {
          window.localStorage.setItem(action.storage.key, action.storage.value);
        }

        router.push(action.href);
        return;
      }

      node = node.parentElement;
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh"
      }}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
