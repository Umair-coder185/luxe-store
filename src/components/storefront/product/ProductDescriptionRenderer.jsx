import React from "react";

function formatInlineMarkdown(text) {
  if (!text) return null;
  // Splits by **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function ProductDescriptionRenderer({ content }) {
  if (!content || !content.trim()) return null;

  const lines = content.split("\n");
  const blocks = [];
  let currentChecklist = [];
  let keyIndex = 0;

  function flushChecklist() {
    if (currentChecklist.length > 0) {
      blocks.push(
        <div key={`checklist-${keyIndex++}`} className="my-5 grid grid-cols-1 gap-2.5">
          {currentChecklist.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-1 text-sm text-neutral-700 leading-relaxed">
              <span className="shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-neutral-100 text-neutral-800 text-xs">
                {item.icon || "✓"}
              </span>
              <span>{formatInlineMarkdown(item.text)}</span>
            </div>
          ))}
        </div>
      );
      currentChecklist = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushChecklist();
      continue;
    }

    // Heading 3 or 4: ### or ####
    if (trimmed.startsWith("#### ") || trimmed.startsWith("### ")) {
      flushChecklist();
      const title = trimmed.replace(/^#{3,4}\s+/, "");
      blocks.push(
        <h3 key={keyIndex++} className="text-lg font-medium text-neutral-900 tracking-tight mt-7 mb-3">
          {formatInlineMarkdown(title)}
        </h3>
      );
      continue;
    }

    // Heading 2: ##
    if (trimmed.startsWith("## ")) {
      flushChecklist();
      const title = trimmed.replace(/^##\s+/, "");
      blocks.push(
        <h2 key={keyIndex++} className="text-xl md:text-2xl font-light text-neutral-900 tracking-tight mt-8 mb-4">
          {formatInlineMarkdown(title)}
        </h2>
      );
      continue;
    }

    // Pro Tip Callout
    if (trimmed.startsWith("✨ Pro Tip:") || trimmed.startsWith("Pro Tip:")) {
      flushChecklist();
      const tipHeader = "Pro Tip";
      const tipText = trimmed.replace(/^✨?\s*Pro Tip:\s*/i, "");
      let nextTipLines = [];
      while (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith("#") && !lines[i + 1].trim().startsWith("💼")) {
        nextTipLines.push(lines[++i].trim());
      }
      blocks.push(
        <div
          key={keyIndex++}
          className="my-6 p-4 md:p-5 bg-amber-50/70 border-l-4 border-amber-400 rounded-r-xl text-amber-950 text-sm leading-relaxed shadow-xs"
        >
          <div className="font-semibold flex items-center gap-2 text-amber-900 mb-1">
            <span>✨</span>
            <span>{tipHeader}</span>
          </div>
          <div className="text-amber-900/90 text-sm">
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
      let nextNoteLines = [];
      while (i + 1 < lines.length && lines[i + 1].trim() && !lines[i + 1].trim().startsWith("#") && !lines[i + 1].trim().startsWith("✨")) {
        nextNoteLines.push(lines[++i].trim());
      }
      blocks.push(
        <div
          key={keyIndex++}
          className="my-6 p-4 md:p-5 bg-neutral-100/90 border-l-4 border-neutral-600 rounded-r-xl text-neutral-800 text-sm leading-relaxed shadow-xs"
        >
          <div className="font-semibold flex items-center gap-2 text-neutral-900 mb-1">
            <span>💼</span>
            <span>Please note:</span>
          </div>
          <div className="text-neutral-700 text-sm">
            {formatInlineMarkdown(noteText)}
            {nextNoteLines.length > 0 && (
              <p className="mt-1">{formatInlineMarkdown(nextNoteLines.join(" "))}</p>
            )}
          </div>
        </div>
      );
      continue;
    }

    // Bullet points / Checkmarks: ✅, 🧵, 🎯, 🌿, 🌟, - , •
    const checkMatch = trimmed.match(/^([✅🧵🎯🌿🌟•\-]|✓)\s*(.*)$/);
    if (checkMatch) {
      const icon = checkMatch[1] === "-" || checkMatch[1] === "•" ? "•" : checkMatch[1];
      const text = checkMatch[2];
      currentChecklist.push({ icon, text });
      continue;
    }

    // Normal paragraph
    flushChecklist();
    blocks.push(
      <p key={keyIndex++} className="text-neutral-600 text-sm md:text-base leading-relaxed mb-4">
        {formatInlineMarkdown(trimmed)}
      </p>
    );
  }

  flushChecklist();

  return <div className="max-w-3xl product-description-body">{blocks}</div>;
}
