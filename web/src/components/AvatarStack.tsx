// React import not required in new JSX runtimes

type Member = { id: string; name: string }

/**
 * AvatarStack
 * Muestra hasta `max` avatares en fila y un +N overflow cuando hay más.
 */
export function AvatarStack({ members, max = 3 }: { members: Member[]; max?: number }) {
  const displayed = members.slice(0, max)
  const extra = members.length - displayed.length

  return (
    <div className="flex items-center -space-x-3">
      {displayed.map((m, i) => (
        <div
          key={m.id}
          title={m.name}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-white ${getBgForIndex(i)}`}
        >
          {initials(m.name)}
        </div>
      ))}

      {extra > 0 && (
        // overflow indicator when there are more members than `max`
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium ring-2 ring-white text-sm text-gray-600">
          +{extra}
        </div>
      )}
    </div>
  )
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function getBgForIndex(i: number) {
  const classes = ['bg-purple-100', 'bg-pink-100', 'bg-green-100', 'bg-gray-100']
  return classes[i % classes.length]
}

export default AvatarStack
