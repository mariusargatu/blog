export interface Category {
  name: string
  icon: string
  accent: 'primary' | 'secondary' | 'tertiary'
  blurb: string
}

/**
 * Single source of truth for the blog's categories: order, icon, and accent.
 * A post's `topic` frontmatter must match one of these `name` values.
 */
export const CATEGORIES: Category[] = [
  {
    name: 'LLM Apps',
    icon: 'material-symbols:smart-toy-outline',
    accent: 'primary',
    blurb:
      'Testing GenAI in production: RAG retrieval, evals vs tests, agentic trajectories, and the classical failures that hide behind a green dashboard.',
  },
]
