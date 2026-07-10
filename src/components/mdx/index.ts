import Callout from './Callout.astro'
import Terminal from './Terminal.astro'
import ScribbleNote from './ScribbleNote.astro'
import DataTable from './DataTable.astro'
import Link from './Link.astro'

/**
 * Components made available to every MDX post without an explicit import.
 * Passed to `<Content components={mdxComponents} />` in the article page.
 * `a` overrides the default anchor so external links get safe rel attributes.
 */
export const mdxComponents = { Callout, Terminal, ScribbleNote, DataTable, a: Link }
