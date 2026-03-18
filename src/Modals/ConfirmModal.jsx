export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 w-full max-w-sm">
        <p className="text-white text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-white/10 text-white py-2 rounded-xl hover:bg-white/20">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-400">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}