interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
    <h2 className="text-lg font-semibold">Impossibile caricare i dati</h2>
    <p className="mt-2 text-sm">{message ?? 'Si è verificato un errore inatteso.'}</p>
    {onRetry ? (
      <button
        className="mt-4 inline-flex items-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
        onClick={onRetry}
      >
        Riprova
      </button>
    ) : null}
  </div>
);

export default ErrorState;
