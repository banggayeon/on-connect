import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { AppScreen } from "@/components/AppScreen";
import { InteractiveMockupShell, type MockupAction } from "@/components/design/InteractiveMockupShell";

const referenceFiles = {
  appConcept: "on_connect_app_concept_board_v2.html",
  onboardingFlow: "on_connect_onboarding_flow.html"
} as const;

type ReferenceMockupPageProps = {
  source: keyof typeof referenceFiles;
  marker: string;
  actions?: MockupAction[];
  scale?: AppScale;
  extraHtml?: string;
};

type AppScale = "child" | "parent";

function extractFirstDivAfterMarker(html: string, marker: string) {
  const markerIndex = html.indexOf(marker);

  if (markerIndex === -1) {
    throw new Error(`Reference marker not found: ${marker}`);
  }

  const start = html.indexOf("<div", markerIndex + marker.length);

  if (start === -1) {
    throw new Error(`No div found after reference marker: ${marker}`);
  }

  const tagPattern = /<\/?div\b[^>]*>/g;
  tagPattern.lastIndex = start;

  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0];

    if (tag.startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(start, tagPattern.lastIndex);
      }
    } else {
      depth += 1;
    }
  }

  throw new Error(`Could not extract mockup block: ${marker}`);
}

function extractBalancedDiv(html: string, start: number) {
  const tagPattern = /<\/?div\b[^>]*>/g;
  tagPattern.lastIndex = start;

  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html)) !== null) {
    const tag = match[0];

    if (tag.startsWith("</")) {
      depth -= 1;
      if (depth === 0) {
        return html.slice(start, tagPattern.lastIndex);
      }
    } else {
      depth += 1;
    }
  }

  throw new Error("Could not extract balanced div");
}

function removeFirstStatusBar(screenHtml: string) {
  const screenOpenEnd = screenHtml.indexOf(">") + 1;
  const firstDivStart = screenHtml.indexOf("<div", screenOpenEnd);

  if (firstDivStart === -1) {
    return screenHtml;
  }

  const firstDivHtml = extractBalancedDiv(screenHtml, firstDivStart);

  if (!firstDivHtml.includes("9:41")) {
    return screenHtml;
  }

  return `${screenHtml.slice(0, firstDivStart)}${screenHtml.slice(firstDivStart + firstDivHtml.length)}`;
}

function scaleNumber(value: number, property: string, scale: AppScale) {
  const parentBoost = scale === "parent" ? 1.16 : 1;

  if (property === "font-size") {
    if (value <= 7) return Math.round(13 * parentBoost);
    if (value <= 8) return Math.round(14 * parentBoost);
    if (value <= 9) return Math.round(16 * parentBoost);
    if (value <= 10) return Math.round(17 * parentBoost);
    if (value <= 11) return Math.round(18 * parentBoost);
    if (value <= 12) return Math.round(20 * parentBoost);
    if (value <= 13) return scale === "parent" ? 22 : 27;
    if (value <= 16) return scale === "parent" ? 34 : 32;
    if (value <= 22) return Math.round(48 * parentBoost);
    if (value <= 26) return Math.round(52 * parentBoost);

    return Math.round(value * 1.85 * parentBoost);
  }

  if (property === "border-radius") {
    if (value <= 6) return 10;
    if (value <= 8) return 12;
    if (value <= 10) return 16;
    if (value <= 12) return 20;
    if (value <= 14) return 22;
    if (value <= 16) return 24;

    return Math.round(value * 1.35);
  }

  if (property === "gap") {
    if (value <= 3) return 8;
    if (value <= 4) return 10;
    if (value <= 6) return 14;
    if (value <= 8) return 16;
    if (value <= 10) return 18;

    return Math.round(value * 1.55);
  }

  if (property.startsWith("margin")) {
    if (value <= 2) return 4;
    if (value <= 4) return 8;
    if (value <= 6) return 12;
    if (value <= 8) return 14;
    if (value <= 10) return 16;
    if (value <= 12) return 18;
    if (value <= 14) return 22;
    if (value <= 16) return 24;

    return Math.round(value * 1.6);
  }

  if (property.startsWith("padding")) {
    if (value <= 5) return 10;
    if (value <= 7) return 14;
    if (value <= 8) return 16;
    if (value <= 9) return 18;
    if (value <= 10) return 20;
    if (value <= 12) return 22;
    if (value <= 14) return 24;
    if (value <= 16) return 28;

    return Math.round(value * 1.55);
  }

  if (property === "width" || property === "height") {
    if (value <= 3) return 6;
    if (value <= 4) return 8;
    if (value <= 6) return 12;
    if (value <= 8) return 14;
    if (value <= 12) return 20;
    if (value <= 14) return 24;
    if (value <= 16) return 30;
    if (value <= 18) return 34;
    if (value <= 22) return 42;
    if (value <= 24) return 46;
    if (value <= 28) return 56;
    if (value <= 32) return 62;
    if (value <= 60) return Math.round(value * 1.55);

    return value;
  }

  return value;
}

function scaleStyleValue(property: string, value: string, scale: AppScale) {
  return value.replace(/(\d+(?:\.\d+)?)px/g, (_, rawValue: string) => {
    const nextValue = scaleNumber(Number(rawValue), property, scale);

    return `${nextValue}px`;
  });
}

function scaleInlineStyles(html: string, scale: AppScale) {
  return html.replace(/style="([^"]*)"/g, (_, styleText: string) => {
    const declarations = styleText
      .split(";")
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const separatorIndex = declaration.indexOf(":");

        if (separatorIndex === -1) {
          return declaration;
        }

        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();

        return `${property}: ${scaleStyleValue(property, value, scale)}`;
      });

    return `style="${declarations.join("; ")}"`;
  });
}

function normalizeAppScreenStyle(screenHtml: string, scale: AppScale) {
  const openEnd = screenHtml.indexOf(">");
  const openingTag = screenHtml.slice(0, openEnd + 1);
  const rest = screenHtml.slice(openEnd + 1);
  const screenPadding = scale === "parent" ? "padding: 32px 24px;" : "padding: 30px 22px;";
  const normalizedOpeningTag = openingTag
    .replace(/height:\s*360px;?/g, "min-height: 100vh;")
    .replace(/border-radius:\s*22px;?/g, "border-radius: 0;")
    .replace(/padding:\s*14px 12px;?/g, screenPadding)
    .replace(/padding:\s*16px 14px;?/g, screenPadding)
    .replace(/overflow:\s*hidden;?/g, "overflow: visible;")
    .replace(/display:\s*flex;\s*flex-direction:\s*column;?/g, "display: flex; flex-direction: column;");

  return `${normalizedOpeningTag}${scaleInlineStyles(rest, scale)}`;
}

function extractAppScreenFromMockup(mockupHtml: string, scale: AppScale) {
  const phoneFrameIndex = mockupHtml.indexOf("background: #2C2420");

  if (phoneFrameIndex === -1) {
    return scaleInlineStyles(mockupHtml, scale);
  }

  const frameStart = mockupHtml.lastIndexOf("<div", phoneFrameIndex);
  const frameOpenEnd = mockupHtml.indexOf(">", frameStart);
  const screenStart = mockupHtml.indexOf("<div", frameOpenEnd + 1);

  if (screenStart === -1) {
    return scaleInlineStyles(mockupHtml, scale);
  }

  const screenHtml = extractBalancedDiv(mockupHtml, screenStart);

  return normalizeAppScreenStyle(removeFirstStatusBar(screenHtml), scale);
}

export function getReferenceMockupHtml(source: keyof typeof referenceFiles, marker: string) {
  const filePath = resolve(process.cwd(), "../reference", referenceFiles[source]);
  const html = readFileSync(filePath, "utf8");

  return extractFirstDivAfterMarker(html, marker);
}

export function getReferenceAppScreenHtml(source: keyof typeof referenceFiles, marker: string, scale: AppScale = "child") {
  return extractAppScreenFromMockup(getReferenceMockupHtml(source, marker), scale);
}

export function appendHtmlToAppScreen(html: string, extraHtml?: string) {
  if (!extraHtml) {
    return html;
  }

  const closingIndex = html.lastIndexOf("</div>");

  if (closingIndex === -1) {
    return `${html}${extraHtml}`;
  }

  return `${html.slice(0, closingIndex)}${extraHtml}${html.slice(closingIndex)}`;
}

export function ReferenceMockupPage({ source, marker, actions, scale = "child", extraHtml }: ReferenceMockupPageProps) {
  const appScreenHtml = appendHtmlToAppScreen(getReferenceAppScreenHtml(source, marker, scale), extraHtml);

  return (
    <AppScreen>
      <InteractiveMockupShell html={appScreenHtml} actions={actions} />
    </AppScreen>
  );
}
