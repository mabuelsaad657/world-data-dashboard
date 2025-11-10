import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type Country = {
  cca3: string
  name: { common: string, official: string }
  flags?: { svg?: string, png?: string, alt?: string }
  region?: string
  population?: number
  languages?: Record<string, string>
}

const formatNumber = (n?: number) => typeof n === 'number' ? n.toLocaleString(undefined) : '—'
const languagesToString = (langs?: Record<string,string>) => {
  if (!langs) return '—'
  const arr = Object.values(langs).filter(Boolean)
  return arr.length ? arr.join(', ') : '—'
}
const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [region, setRegion] = useState('All')

  useEffect(() => {
    let cancelled = false
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await axios.get<Country[]>(
          'https://restcountries.com/v3.1/all?fields=name,cca3,flags,region,population,languages'
        )
        if (!cancelled) {
          const sorted = [...data].sort((a,b) => a.name.common.localeCompare(b.name.common))
          setCountries(sorted)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load countries')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchAll()
    return () => { cancelled = true }
  }, [])

  const regions = useMemo(() => {
    const set = new Set<string>(['All'])
    for (const c of countries) if (c.region) set.add(c.region)
    return Array.from(set)
  }, [countries])

  const filtered = useMemo(() => {
    const nq = normalize(q)
    return countries.filter(c => {
      const rOK = region === 'All' || c.region === region
      if (!nq) return rOK
      const hay = [c.name?.common, c.name?.official].filter(Boolean).map(String).map(normalize).join('\n')
      return rOK && hay.includes(nq)
    })
  }, [countries, q, region])

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <input
          className="w-full md:max-w-md border rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-black/20"
          placeholder="Search by country (e.g., Egypt, Japan, Peru)…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="border rounded-2xl px-3 py-2 bg-white md:w-48"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {loading && <div className="text-center py-16">Loading country data…</div>}
      {!loading && error && <div className="text-center py-16 text-red-700">Failed to load data: {error}</div>}

      {!loading && !error && (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Showing <span className="font-semibold">{filtered.length}</span> of {countries.length} countries
          </p>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-600">No countries match your search.</div>
          ) : (
            <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(c => (
                <li key={c.cca3} className="bg-white rounded-2xl shadow-sm border hover:shadow-md transition overflow-hidden">
                  <Link to={`/country/${c.cca3}`}>
                    <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                      {c.flags?.svg ? (
                        <img src={c.flags.svg} alt={c.flags?.alt || `${c.name?.common} flag`} className="h-full w-full object-cover" loading="lazy" />
                      ) : <div className="text-gray-400">No flag</div>}
                    </div>
                    <div className="p-4">
                      <h2 className="text-lg font-medium mb-1">{c.name?.common}</h2>
                      <div className="text-sm text-gray-600 mb-2">Region: {c.region || '—'}</div>
                      <div className="text-sm"><span className="font-medium">Population:</span> {formatNumber(c.population)}</div>
                      <div className="text-sm mt-1"><span className="font-medium">Languages:</span> {languagesToString(c.languages)}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}