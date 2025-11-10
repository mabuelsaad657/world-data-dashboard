export default function About() {
  return (
    <div className="prose max-w-none">
      <h2>About</h2>
      <p>
        World Data Dashboard lets you search nearly every country and view its flag,
        population, and languages. Click a country card for more details.
      </p>
      <ul>
        <li>Data: REST Countries v3 (public API, no key required)</li>
        <li>Stack: React + TypeScript + Vite + Tailwind</li>
        <li>Routing: React Router</li>
      </ul>
    </div>
  )
}