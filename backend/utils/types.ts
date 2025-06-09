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
  aggregatedData: Record<string, number>;
  metrics: {
    processingTimeMs: number;
    totalRows: number;
    uniqueDepartments: number;
    departments: string[];
  };
}

export { SalesRecord, AggregatedSales, UploadResponse };
