
export interface Record {
    id: string;
    date: Date,
    operationResponse: string,
    operation: {
      type: string,
    },
    amount: string,
    userBalance: number,
};

export interface ReportResponse {
    content: Record[];
    page: {
        size: number,
        number: number,
        totalElements: number,
        totalPages: number
      },
};
