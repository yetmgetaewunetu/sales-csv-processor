export const FileInfoDisplay = ({ file }) => (
  <>
    <p className="font-medium text-green-600">{file.name}</p>
    <p className="text-xs text-gray-500">
      {(file.size / (1024 * 1024)).toFixed(2)} MB
    </p>
  </>
);
