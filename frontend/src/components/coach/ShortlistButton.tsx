import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { addToShortlist, removeFromShortlist } from '@/api/coach'

interface ShortlistButtonProps {
  athleteId: number
  isShortlisted: boolean
  onToggle?: (newState: boolean) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const ShortlistButton: React.FC<ShortlistButtonProps> = ({
  athleteId,
  isShortlisted,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const queryClient = useQueryClient()

  const iconSize = { sm: 14, md: 18, lg: 22 }[size]
  const btnSize = { sm: 'p-1', md: 'p-2', lg: 'p-2.5' }[size]

  const addMutation = useMutation({
    mutationFn: () => addToShortlist(athleteId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['shortlist'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] })
    },
    onSuccess: () => onToggle?.(true),
  })

  const removeMutation = useMutation({
    mutationFn: () => removeFromShortlist(athleteId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['shortlist'] })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shortlist'] })
    },
    onSuccess: () => onToggle?.(false),
  })

  const isPending = addMutation.isPending || removeMutation.isPending

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isPending) return
    if (isShortlisted) removeMutation.mutate()
    else addMutation.mutate()
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      title={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 ${btnSize}
        ${isShortlisted ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-red-400 hover:bg-red-50'}
        ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}`}
      aria-pressed={isShortlisted}
    >
      <Heart size={iconSize} fill={isShortlisted ? 'currentColor' : 'none'} />
    </button>
  )
}

export default ShortlistButton
