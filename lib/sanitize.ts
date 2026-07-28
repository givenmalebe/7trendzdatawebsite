import DOMPurify from "isomorphic-dompurify"

export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "a", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "pre", "code", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "div", "span", "hr",
      "iframe", "video", "source",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt", "width", "height", "className",
      "class", "style", "title", "loading",
    ],
    ALLOW_DATA_ATTR: false,
  })
}
