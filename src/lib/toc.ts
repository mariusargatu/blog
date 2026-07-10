export interface Heading {
  depth: number
  slug: string
  text: string
}

export interface TocNode extends Heading {
  children: TocNode[]
}

/**
 * Build a nested table-of-contents tree from Astro's flat `headings` array,
 * keeping only headings within [minDepth, maxDepth]. Pure — unit-testable.
 *
 * A heading deeper than the current top becomes a child of the last shallower
 * heading; otherwise it starts a new top-level entry.
 */
export function buildTocTree(
  headings: Heading[],
  minDepth = 2,
  maxDepth = 3,
): TocNode[] {
  const inRange = headings.filter(
    (h) => h.depth >= minDepth && h.depth <= maxDepth,
  )

  const roots: TocNode[] = []
  const stack: TocNode[] = []

  for (const h of inRange) {
    const node: TocNode = { ...h, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].depth >= h.depth) {
      stack.pop()
    }

    if (stack.length === 0) {
      roots.push(node)
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }

  return roots
}
