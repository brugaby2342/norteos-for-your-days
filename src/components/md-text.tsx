import type { ReactNode } from "react";

type Block =
  | { type: "heading"; text: string; level: 1 | 2 | 3 }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "p"; lines: string[] };

function stripEmoji(text: string) {
  return text
    .replace(/\p{Extended_Pictographic}/gu, "")
    .replace(/[\uFE0F\u200D]/g, "")
    .replace(/:[a-z0-9_+-]+:/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseBlocks(raw: string): Block[] {
  const lines = stripEmoji(raw).replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  function flushPara() {
    const text = para.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "p", lines: [text] });
    para = [];
  }
  function flushList() {
    if (list?.items.length) blocks.push({ type: "list", ordered: list.ordered, items: list.items });
    list = null;
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      blocks.push({ type: "heading", text: heading[2].trim(), level });
      continue;
    }
    if (/^\*\*[^*]+\*\*:?\s*$/.test(line)) {
      flushPara();
      flushList();
      blocks.push({ type: "heading", text: line.replace(/:$/, ""), level: 2 });
      continue;
    }
    const bullet = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      flushPara();
      const ordered = /^\d+[.)]\s+/.test(line);
      if (!list || list.ordered !== ordered) {
        flushList();
        list = { ordered, items: [] };
      }
      list.items.push(bullet[1].trim());
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

function inlineFmt(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={i} className="rounded bg-bg-warm px-1 py-0.5 text-[0.95em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function esc(s: string) {
  return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">");
}

function inlineHtml(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    .map((part) => {
      if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
        return `<strong>${esc(part.slice(2, -2))}</strong>`;
      }
      if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
        return `<em>${esc(part.slice(1, -1))}</em>`;
      }
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        return `<code>${esc(part.slice(1, -1))}</code>`;
      }
      return esc(part);
    })
    .join("");
}

export function markdownToHtml(raw: string) {
  const inner = parseBlocks(raw)
    .map((block) => {
      if (block.type === "heading") {
        const tag = block.level === 1 ? "h2" : "h3";
        return `<${tag} style="font-weight:600;margin:0 0 8px">${inlineHtml(block.text)}</${tag}>`;
      }
      if (block.type === "list") {
        const tag = block.ordered ? "ol" : "ul";
        const items = block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("");
        return `<${tag} style="margin:0 0 12px;padding-left:1.25rem">${items}</${tag}>`;
      }
      const html = block.lines.map((line) => inlineHtml(line)).join("<br>");
      return `<p style="margin:0 0 12px">${html}</p>`;
    })
    .join("");
  return `<!DOCTYPE html><html><body><!--StartFragment-->${inner}<!--EndFragment--></body></html>`;
}

export function markdownToPlain(raw: string) {
  return stripEmoji(raw)
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

export function ReadyText({ text }: { text: string }) {
  const blocks = parseBlocks(text);
  return (
    <article className="max-w-[68ch] text-sm leading-7 text-ink">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h3
              key={i}
              className={
                block.level === 1
                  ? "mb-2 mt-5 font-display text-xl tracking-tight first:mt-0"
                  : "mb-2 mt-4 font-display text-lg tracking-tight first:mt-0"
              }
            >
              {inlineFmt(block.text)}
            </h3>
          );
        }
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              key={i}
              className={
                block.ordered
                  ? "mb-3 list-decimal space-y-1 pl-5"
                  : "mb-3 list-disc space-y-1 pl-5"
              }
            >
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {inlineFmt(item)}
                </li>
              ))}
            </List>
          );
        }
        return (
          <p key={i} className="mb-3">
            {inlineFmt(block.lines[0] ?? "")}
          </p>
        );
      })}
    </article>
  );
}

export async function copyFormatted(html: string, plain: string) {
  try {
    if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return;
    }
  } catch {
    /* fallback abaixo */
  }

  const onCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    e.clipboardData?.setData("text/html", html);
    e.clipboardData?.setData("text/plain", plain);
  };
  document.addEventListener("copy", onCopy);
  const holder = document.createElement("div");
  holder.setAttribute("contenteditable", "true");
  holder.innerHTML = html;
  holder.style.position = "fixed";
  holder.style.left = "-9999px";
  document.body.appendChild(holder);
  holder.focus();
  const range = document.createRange();
  range.selectNodeContents(holder);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  document.execCommand("copy");
  sel?.removeAllRanges();
  document.body.removeChild(holder);
  document.removeEventListener("copy", onCopy);
}
