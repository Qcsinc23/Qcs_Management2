import useStore from '../../store/useStore'

function useNotification() {
  const { addNotification } = useStore()

  const notify = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    addNotification({
      type,
      message,
    })
  }

  const notifySuccess = (message: string) => notify(message, 'success')
  const notifyError = (message: string) => notify(message, 'error')
  const notifyWarning = (message: string) => notify(message, 'warning')
  const notifyInfo = (message: string) => notify(message, 'info')

  return {
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
  }
}

export default useNotification
