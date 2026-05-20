import Sandbox from './components/Sandbox'

// Local-only home page. The original Postgres-backed server component is
// preserved at src/legacy/page.tsx. Sandbox seeds the store from these
// (empty) props on first mount; the persist middleware on the store rehydrates
// from localStorage before that effect runs, so the empty arrays here only
// matter on a first-ever visit.

export default function Home() {
  return (
    <Sandbox
      transactions={[]}
      accounts={[]}
      categories={[]}
      payees={[]}
    />
  )
}
