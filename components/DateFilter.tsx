'use client'

import { useState, useRef, useEffect } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'

export interface DateRange {
  from: string
  to: string
}

interface Props {
  value: DateRange
  onChange: (range: DateRange) => void
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

const presets = [
  { label: 'Hoje',    getRange: (): DateRange => ({ from: today(),      to: today() }) },
  { label: '7 dias',  getRange: (): DateRange => ({ from: daysAgo(6),   to: today() }) },
  { label: '30 dias', getRange: (): DateRange => ({ from: daysAgo(29),  to: today() }) },
]

function formatDisplay(value: DateRange) {
  if (!value.from && !value.to) return null
  const fmt = (s: string) => s.split('-').reverse().join('/')
  if (value.from === value.to) return fmt(value.from)
  if (value.from && value.to) return `${fmt(value.from)} → ${fmt(value.to)}`
  if (value.from) return `a partir de ${fmt(value.from)}`
  return `até ${fmt(value.to)}`
}

export default function DateFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState<DateRange>({ from: '', to: '' })
  const ref = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function applyCustom() {
    if (custom.from || custom.to) {
      onChange(custom)
      setOpen(false)
    }
  }

  function clearFilter() {
    onChange({ from: '', to: '' })
    setCustom({ from: '', to: '' })
  }

  const display = formatDisplay(value)
  const hasFilter = !!value.from || !!value.to

  return (
    <div className="relative" ref={ref}>
      {/* Botão Filtrar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          style={{
            background: open ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${open ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}`,
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          <SlidersHorizontal size={15} />
          Filtrar
        </button>

        {/* Badge com o período selecionado */}
        {hasFilter && display && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          >
            {display}
            <button onClick={clearFilter} className="hover:text-white transition-colors">
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full right-0 mt-2 z-50 rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: 'rgba(13,11,26,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            minWidth: 260,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Presets */}
          <div className="flex gap-2">
            {presets.map(p => {
              const r = p.getRange()
              const active = value.from === r.from && value.to === r.to
              return (
                <button
                  key={p.label}
                  onClick={() => { onChange(r); setOpen(false) }}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={
                    active
                      ? { background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }
                  }
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          {/* Divisor */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

          {/* Calendário / datas customizadas */}
          <p className="text-xs text-white/30 uppercase tracking-wider">Período personalizado</p>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">De</label>
              <input
                type="date"
                value={custom.from}
                onChange={e => setCustom(c => ({ ...c, from: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: custom.from ? 'white' : 'rgba(255,255,255,0.3)',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">Até</label>
              <input
                type="date"
                value={custom.to}
                onChange={e => setCustom(c => ({ ...c, to: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: custom.to ? 'white' : 'rgba(255,255,255,0.3)',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <button
              onClick={applyCustom}
              disabled={!custom.from && !custom.to}
              className="w-full py-2 rounded-xl text-sm font-semibold transition-all mt-1 disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
