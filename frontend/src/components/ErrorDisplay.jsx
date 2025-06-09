export const ErrorDisplay = ({ error }) =>
  error && (
    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
      {error}
    </div>
  );
