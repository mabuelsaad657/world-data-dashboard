import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

type Country = {
  cca3: string
  name: { common: string, official: string }
  flags?: { svg?: string, png?: string, alt?: string }
  region?: string
  subregion?: string
  population?: number
  languages?: Record<string, string>
  capital?: string[]
  currencies?: Record<string, { name: string, symbol?: string }>
}

const formatNumber = (n?: number) => typeof n === 'number' ? n.toLocaleString(undefined) : '—'

export default function Country() {
  const { code } = useParams()
  const [country, setCountry] = useState<Country | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await axios.get<Country[]>(
          `https://restcountries.com/v3.1/alpha/${code}?fields=name,cca3,flags,region,subregion,population,languages,capital,currencies`
        )
        if (!cancelled) setCountry(data?.[0] || null)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load country')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    if (code) run()
    return () => { cancelled = true }
  }, [code])

  if (loading) return <div className="text-center py-16">Loading…</div>
  if (error) return <div className="text-center py-16 text-red-700">Error: {error}</div>
  if (!country) return <div className="text-center py-16">Not found.</div>

  const languages = country.languages ? Object.values(country.languages).join(', ') : '—'
  const capital = country.capital?.join(', ') || '—'
  const currencies = country.currencies ? Object.values(country.currencies).map(c => c.symbol ? `${c.name} (${c.symbol})` : c.name).join(', ') : '—'

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/" className="inline-block mb-4 text-sm underline">← Back</Link>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="aspect-[16/9] bg-gray-100">
          {country.flags?.svg ? (
            <img src={country.flags.svg} alt={country.flags?.alt || `${country.name?.common} flag`} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-2">{country.name.common}</h1>
          <p className="text-sm text-gray-600 mb-4">{country.name.official}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Region:</span> {country.region || '—'}</div>
            <div><span className="font-medium">Subregion:</span> {country.subregion || '—'}</div>
            <div><span className="font-medium">Capital:</span> {capital}</div>
            <div><span className="font-medium">Population:</span> {formatNumber(country.population)}</div>
            <div className="md:col-span-2"><span className="font-medium">Languages:</span> {languages}</div>
            <div className="md:col-span-2"><span className="font-medium">Currencies:</span> {currencies}</div>
          </div>
        </div>
      </div>
    </div>
  )
}