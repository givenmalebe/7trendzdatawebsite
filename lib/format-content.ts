export function formatBlogContent(html: string): string {
  if (!html) return ""

  const TAGS = /<(\/?)(h[1-6]|p|div|span|ul|ol|li|blockquote|pre|code|table|thead|tbody|tr|th|td|a|img|strong|em|b|i|u|del|br|hr|figure|figcaption|section|article|aside|nav|header|footer|main|details|summary|sup|sub|small|mark)\b[^>]*>/gi
  const SELF_CLOSING = /<(br|hr|img|input|source|meta|link)\b[^>]*\/?>/gi
  const HTML_COMMENT = /<!--[\s\S]*?-->/g
  const INLINE = /^(a|abbr|acronym|b|bdo|big|br|button|cite|code|dfn|em|i|img|input|kbd|label|map|object|output|q|samp|select|small|span|strong|sub|sup|textarea|time|tt|u|var)$/i

  let result = html
    .replace(HTML_COMMENT, "")
    .replace(/<br\s*\/?>/gi, "<br>")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  const tokens: string[] = []
  let pos = 0

  TAGS.lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = TAGS.exec(result)) !== null) {
    if (match.index > pos) {
      tokens.push("TEXT:" + result.slice(pos, match.index))
    }
    tokens.push("TAG:" + match[0])
    pos = match.index + match[0].length
  }
  if (pos < result.length) {
    tokens.push("TEXT:" + result.slice(pos))
  }

  let output = ""
  for (const token of tokens) {
    if (token.startsWith("TAG:")) {
      output += token.slice(4)
    } else {
      const text = token.slice(5).trim()
      if (!text) continue
      if (text.startsWith("<") && text.endsWith(">")) {
        output += text
      } else {
        const paragraphs = text.split(/\n\n+/)
        for (const para of paragraphs) {
          const clean = para.trim()
          if (!clean) continue
          if (clean.startsWith("<") && clean.endsWith(">")) {
            output += clean
          } else {
            output += "<p>" + clean.replace(/\n/g, "<br>") + "</p>"
          }
        }
      }
    }
  }

  output = output
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>\s*(<h[1-6][^>]*>)/gi, "$1")
    .replace(/(<\/h[1-6]>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<ul[^>]*>)/gi, "$1")
    .replace(/(<\/ul>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<ol[^>]*>)/gi, "$1")
    .replace(/(<\/ol>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<blockquote[^>]*>)/gi, "$1")
    .replace(/(<\/blockquote>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<pre[^>]*>)/gi, "$1")
    .replace(/(<\/pre>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<table[^>]*>)/gi, "$1")
    .replace(/(<\/table>)\s*<\/p>/gi, "$1")
    .replace(/<p>\s*(<hr[^>]*\/?>)/gi, "$1")
    .replace(/<p>\s*(<img[^>]*\/?>)/gi, "$1")
    .replace(/<p>\s*(<figure[^>]*>)/gi, "$1")
    .replace(/(<\/figure>)\s*<\/p>/gi, "$1")
    .replace(/(<\/?br\s*\/?>)\s*<\/p>/gi, "$1")
    .replace(/\s+/g, " ")
    .trim()

  return output
}
