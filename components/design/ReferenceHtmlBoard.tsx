import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const referenceFiles = {
  appConcept: "on_connect_app_concept_board_v2.html",
  onboardingFlow: "on_connect_onboarding_flow.html"
} as const;

type ReferenceHtmlBoardProps = {
  type: keyof typeof referenceFiles;
};

export function ReferenceHtmlBoard({ type }: ReferenceHtmlBoardProps) {
  const filePath = resolve(process.cwd(), "../reference", referenceFiles[type]);
  const html = readFileSync(filePath, "utf8");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FBF6F0",
        padding: "24px",
        overflowX: "auto"
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
