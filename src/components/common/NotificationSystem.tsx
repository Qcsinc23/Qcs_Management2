import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect } from 'react'
import useStore from '../../store/useStore'

function NotificationSystem() {
  const { notifications, markNotificationAsRead } = useStore()

  useEffect(() => {
    const timeoutIds: NodeJS.Timeout[] = []

    notifications.forEach((notification) => {
      if (!notification.read) {
        const timeoutId = setTimeout(() => {
          markNotificationAsRead(notification.id)
        }, 5000) // Auto-dismiss after 5 seconds
        timeoutIds.push(timeoutId)
      }
    })

    return () => {
      timeoutIds.forEach(clearTimeout)
    }
  }, [notifications, markNotificationAsRead])

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'info':
      default:
        return 'bg-blue-500'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`${getNotificationColor(notification.type)} text-white px-4 py-2 rounded-md shadow-lg flex items-center justify-between min-w-[300px]`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => markNotificationAsRead(notification.id)}
            className="hover:opacity-80 transition-opacity"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
