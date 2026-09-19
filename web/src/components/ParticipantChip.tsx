import { Avatar } from './Avatar'

/**
 * ParticipantChip
 * - Small pill used to represent a participant in lists (avatar + name).
 * - Props: `id`, `name`, `selected` and `onToggle(id)` callback.
 */
interface Props {
  id: string
  name: string
  selected?: boolean
  onToggle?: (id: string) => void
}

export function ParticipantChip({ id, name, selected = false, onToggle }: Props) {
  return (
    <button
      onClick={() => onToggle?.(id)}
      className={`flex items-center gap-2 rounded-full px-2 py-1 text-sm transition-all border ${
        selected ? 'border-primary bg-primary-light' : 'border-primary-light bg-surface'
      }`}
    >
      <Avatar name={name} size={32} />
      <span className="font-medium">{name.split(' ')[0]}</span>
    </button>
  )
}

export default ParticipantChip
