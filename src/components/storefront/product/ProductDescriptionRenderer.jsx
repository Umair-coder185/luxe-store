import React from "react";

function formatInlineMarkdown(text) {
  if (!text) return null;
  // Splits by **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong
          key={index}
          className="font-semibold text-[#1c1812] bg-[#f5efe2]/85 px-1.5 py-0.5 rounded-md border-b border-[#cfb374]"
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function formatBulletText(text) {
  if (!text) return null;

  // If the bullet starts with **Lead**: rest or Lead Phrase: rest (up to 45 chars before colon/dash)
  const colonMatch = text.match(/^(\*\*[^*]+\*\*|[A-Za-z0-9\s&/'()-]{2,42}):\s+(.+)$/);
  if (colonMatch) {
    const rawLead = colonMatch[1].replace(/^\*\*|\*\*$/g, "");
    const rest = colonMatch[2];
    return (
      <>
        <span className="font-semibold text-[#1c1812] tracking-tight mr-1.5">
          {rawLead}:
        </span>
        <span className="text-neutral-700">{formatInlineMarkdown(rest)}</span>
      </>
    );
  }

  const dashMatch = text.match(/^(\*\*[^*]+\*\*|[A-Za-z0-9\s&/'()-]{2,38})\s+[–—-]\s+(.+)$/);
  if (dashMatch) {
    const rawLead = dashMatch[1].replace(/^\*\*|\*\*$/g, "");
    const rest = dashMatch[2];
    return (
      <>
        <span className="font-semibold text-[#1c1812] tracking-tight mr-1.5">
          {rawLead} —
        </span>
        <span className="text-neutral-700">{formatInlineMarkdown(rest)}</span>
      </>
    );
  }

  return <span className="text-neutral-700">{formatInlineMarkdown(text)}</span>;
}

function isImplicitHeading(trimmed, prevLineEmpty, nextLineExists) {
  if (!trimmed || trimmed.length > 85) return false;
  // Already markdown heading or special callout or bullet
  if (/^(#{1,6}\s|[✅🧵🎯🌿🌟•\-*▪◆✔✓]|\d+[.)]\s|✨|💼)/.test(trimmed)) {
    return false;
  }
  // Short line ending with a colon (e.g., "Key Features:", "Why It's Essential:", "Material & Care:")
  if (trimmed.endsWith(":") && trimmed.length <= 65 && !trimmed.includes(".")) {
    return true;
  }
  // Standalone short title line preceded by an empty line and followed by content, without sentence punctuation
  if (
    prevLineEmpty &&
    nextLineExists &&
    trimmed.length >= 4 &&
    trimmed.length <= 60 &&
    !/[.,;!]$/.test(trimmed) &&
    /^[A-Z0-9"“'(]/.test(trimmed)
  ) {
    return true;
  }
  return false;
}

export default function ProductDescriptionRenderer({ content }) {
  if (!content || !content.trim()) return null;

  const lines = content.split("\n");
  const blocks = [];
  let currentChecklist = [];
  let keyIndex = 0;
  let isFirstParagraph = true;

  function flushChecklist() {
    if (currentChecklist.length > 0) {
      blocks.push(
        <ul
          key={`checklist-${keyIndex++}`}
          className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3.5 list-none p-0"
        >
          {currentChecklist.map((item, i) => {
            const isCustomIcon = item.icon && item.icon !== "•" && item.icon !== "✓";
            return (
              <li
                key={i}
                className="group relative flex items-start gap-3.5 p-4 rounded-xl bg-gradient-to-br from-[#fcfaf5] via-white to-[#f6efe0]/70 border border-[#e7dcc6] hover:border-[#b89348] shadow-xs hover:shadow-md transition-all duration-300"
              >
                <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#f5efe2] border border-[#dccaa6] text-[#8c6928] text-xs font-bold shadow-2xs group-hover:bg-[#1c1812] group-hover:text-[#e8c97a] group-hover:border-[#1c1812] transition-colors duration-300">
                  {isCustomIcon ? (
                    item.icon
                  ) : (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </span>
                <div className="text-sm leading-relaxed pt-0.5">
                  {formatBulletText(item.text)}
                </div>
              </li>
            );
          })}
        </ul>
      );
      currentChecklist = [];
    }
  }

  function pushHighlightedH2(rawTitle) {
    const cleanTitle = rawTitle.replace(/:$/, "").trim();
    blocks.push(
      <div
        key={`h2-${keyIndex++}`}
        className="mt-8 mb-4 first:mt-0 flex items-center gap-3.5 py-2.5 px-4 rounded-r-xl border-l-4 border-[#b89348] bg-gradient-to-r from-[#f5efe2]/90 via-[#faf6ee]/50 to-transparent"
      >
        <span className="text-[#b89348] text-sm shrink-0" aria-hidden="true">
          ✦
        </span>
        <h2 className="text-lg md:text-xl font-serif font-semibold text-[#1c1812] tracking-tight leading-snug">
          {formatInlineMarkdown(cleanTitle)}
        </h2>
      </div>
    );
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushChecklist();
      continue;
    }

    const prevLineEmpty = i === 0 || !lines[i - 1].trim();
    const nextLineExists = i + 1 < lines.length && Boolean(lines[i + 1].trim());

    // Any Markdown Heading (#, ##, ###, ####) -> Render as Highlighted H2
    if (/^#{1,4}\s+/.test(trimmed)) {
      flushChecklist();
      const title = trimmed.replace(/^#{1,4}\s+/, "");
      pushHighlightedH2(title);
      continue;
    }

    // Pro Tip Callout
    if (trimmed.startsWith("✨ Pro Tip:") || trimmed.startsWith("Pro Tip:")) {
      flushChecklist();
      const tipHeader = "Styling & Sizing Pro Tip";
      const tipText = trimmed.replace(/^✨?\s*Pro Tip:\s*/i, "");
      const nextTipLines = [];
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() &&
        !lines[i + 1].trim().startsWith("#") &&
        !lines[i + 1].trim().startsWith("💼")
      ) {
        nextTipLines.push(lines[++i].trim());
      }
      blocks.push(
        <div
          key={keyIndex++}
          className="my-6 p-5 bg-gradient-to-r from-amber-50/90 to-[#faf6ee] border-l-4 border-[#b89348] rounded-r-xl text-amber-950 text-sm leading-relaxed shadow-xs"
        >
          <div className="font-semibold flex items-center gap-2 text-[#7c5a1a] uppercase tracking-wider text-xs mb-1.5">
            <span>✨</span>
            <span>{tipHeader}</span>
          </div>
          <div className="text-neutral-800 text-sm leading-relaxed">
            {formatInlineMarkdown(tipText)}
            {nextTipLines.length > 0 && (
              <p className="mt-1">{formatInlineMarkdown(nextTipLines.join(" "))}</p>
            )}
          </div>
        </div>
      );
      continue;
    }

    // Please Note Callout
    if (
      trimmed.startsWith("💼 Please note:") ||
      trimmed.startsWith("Please note:") ||
      trimmed.startsWith("Note:")
    ) {
      flushChecklist();
      const noteText = trimmed.replace(/^💼?\s*Please note:\s*|^Note:\s*/i, "");
      const nextNoteLines = [];
      while (
        i + 1 < lines.length &&
        lines[i + 1].trim() &&
        !lines[i + 1].trim().startsWith("#") &&
        !lines[i + 1].trim().startsWith("✨")
      ) {
        nextNoteLines.push(lines[++i].trim());
      }
      blocks.push(
        <div
          key={keyIndex++}
          className="my-6 p-5 bg-neutral-100/90 border-l-4 border-neutral-700 rounded-r-xl text-neutral-800 text-sm leading-relaxed shadow-xs"
        >
          <div className="font-semibold flex items-center gap-2 text-neutral-900 uppercase tracking-wider text-xs mb-1.5">
            <span>💼</span>
            <span>Maison Care & Packaging Note</span>
          </div>
          <div className="text-neutral-700 text-sm leading-relaxed">
            {formatInlineMarkdown(noteText)}
            {nextNoteLines.length > 0 && (
              <p className="mt-1">{formatInlineMarkdown(nextNoteLines.join(" "))}</p>
            )}
          </div>
        </div>
      );
      continue;
    }

    // Implicit Heading detection (e.g. "Key Features:", "Why Choose This Piece", etc.)
    if (isImplicitHeading(trimmed, prevLineEmpty, nextLineExists)) {
      flushChecklist();
      pushHighlightedH2(trimmed);
      continue;
    }

    // Bullet points / Checkmarks: ✅, 🧵, 🎯, 🌿, 🌟, ✨, •, -, *, ▪, ◆, ✔, ✓, or numbered 1. / 1)
    const checkMatch = trimmed.match(/^([✅🧵🎯🌿🌟✨•\-*▪◆✔✓]|\d+[.)])\s*(.*)$/);
    if (checkMatch && checkMatch[2]) {
      const rawMarker = checkMatch[1];
      const icon =
        rawMarker === "-" ||
        rawMarker === "•" ||
        rawMarker === "*" ||
        rawMarker === "▪" ||
        rawMarker === "◆" ||
        /^\d+[.)]$/.test(rawMarker)
          ? "✓"
          : rawMarker;
      const text = checkMatch[2];
      currentChecklist.push({ icon, text });
      continue;
    }

    // Normal paragraph
    flushChecklist();
    const paragraphClass = isFirstParagraph
      ? "text-[#2b261e] text-base md:text-[17px] leading-relaxed mb-5 font-normal bg-[#faf6ee]/60 p-4 md:p-5 rounded-xl border border-[#ece2ce]"
      : "text-neutral-700 text-sm md:text-base leading-relaxed mb-4";
    isFirstParagraph = false;

    blocks.push(
      <p key={keyIndex++} className={paragraphClass}>
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushChecklist();

  return <div className="max-w-4xl product-description-body">{blocks}</div>;
}
