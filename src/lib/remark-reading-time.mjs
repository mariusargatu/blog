import getReadingTime from 'reading-time'
import { toString } from 'mdast-util-to-string'

/**
 * Remark plugin: injects `minutesRead` (integer, min 1) into each post's
 * frontmatter at build time. Read back via the `remarkPluginFrontmatter`
 * returned by `render(entry)`.
 */
export function remarkReadingTime() {
  return function (tree, file) {
    const text = toString(tree)
    const { minutes } = getReadingTime(text)
    file.data.astro.frontmatter.minutesRead = Math.max(1, Math.round(minutes))
  }
}
