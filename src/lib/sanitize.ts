import sanitizeHtml from "sanitize-html";

// The product description is admin-authored HTML rendered with dangerouslySetInnerHTML on the public page.
// Clean it on save so even a stolen admin session (or a pasted snippet) can't plant script on customers' screens:
// only what the Tiptap editor produces survives (text formatting, lists, links, images, tables, YouTube embeds).
export function sanitizeDescription(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "blockquote", "hr", "img", "table", "thead", "tbody", "tr", "th", "td", "div", "iframe"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
      div: ["data-youtube-video"],
      iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["http", "https"] }, // no data:/javascript: images
    allowProtocolRelative: false,
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    transformTags: { a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }) },
  }).slice(0, 20_000);
}
