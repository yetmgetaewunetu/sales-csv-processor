export const DownloadLink = ({ downloadLink }) => (
  <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
    <p className="text-sm text-green-800 mb-2">File processed successfully!</p>
    <a
      href={downloadLink}
      className="inline-flex items-center text-blue-600 hover:text-blue-800"
      download
    >
      <DownloadIcon />
      Download Processed File
    </a>
  </div>
);

const DownloadIcon = () => (
  <svg
    className="w-5 h-5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);
