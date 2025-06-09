// type declarations for input and output processing functions

interface SalesRecord {
  DepartmentName: string;
  Date: string;
  NumberOfSales: number;
}

interface AggregatedSales {
  [department: string]: number;
}

interface UploadResponse {
  fileId: string;
  downloadUrl: string;
}

export { SalesRecord, AggregatedSales, UploadResponse };
