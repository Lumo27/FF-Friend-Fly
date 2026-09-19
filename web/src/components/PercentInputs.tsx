// React import not required in new JSX runtimes

/**
 * PercentInputs
 * - Renders a compact list of numeric inputs (0-100) for each participant.
 * - Props: `participants: {id,name}[]`, `values: Record<id,number>` and `onChange(id,value)`.
 */
interface Participant {
  id: string
  name: string
}

interface Props {
  participants: Participant[]
  values: Record<string, number>
  onChange: (id: string, value: number) => void
}

export function PercentInputs({ participants, values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {participants.map((p) => (
        <label key={p.id} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-light font-semibold">{p.name.split(' ')[0][0]}</div>
            <span className="text-sm">{p.name}</span>
          </div>
          <input
            type="number"
            min={0}
            max={100}
            value={values[p.id] ?? 0}
            onChange={(e) => onChange(p.id, Number(e.target.value))}
            className="w-24 rounded-lg border border-primary-light bg-surface px-2 py-1 text-right"
          />
        </label>
      ))}
    </div>
  )
}

export default PercentInputs
