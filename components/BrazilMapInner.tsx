'use client'

import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const GEO_URL = '/brazil-states.geojson'

interface StateData {
  sigla: string
  count: number
  percent: number
}

function interpolateColor(percent: number): string {
  const opacity = 0.1 + (percent / 100) * 0.85
  return `rgba(168, 85, 247, ${opacity.toFixed(2)})`
}

interface Props {
  stateData: Record<string, StateData>
  onHover: (info: { name: string; sigla: string; count: number; percent: number } | null) => void
}

export default function BrazilMapInner({ stateData, onHover }: Props) {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 750, center: [-54, -15] }}
      style={{ width: '100%', height: '340px' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => {
            const sigla = geo.properties.sigla?.toUpperCase() || ''
            const data = stateData[sigla]
            const fill = data ? interpolateColor(data.percent) : 'rgba(255,255,255,0.08)'

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={fill}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={0.6}
                style={{
                  default: { outline: 'none', transition: 'fill 0.2s' },
                  hover: { outline: 'none', fill: 'rgba(168,85,247,0.6)', cursor: 'pointer' },
                  pressed: { outline: 'none' },
                }}
                onMouseEnter={() =>
                  onHover({
                    name: geo.properties.name || sigla,
                    sigla,
                    count: data?.count || 0,
                    percent: data?.percent || 0,
                  })
                }
                onMouseLeave={() => onHover(null)}
              />
            )
          })
        }
      </Geographies>
    </ComposableMap>
  )
}
