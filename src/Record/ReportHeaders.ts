import { GridColDef } from '@mui/x-data-grid';

const doFormatDate = (date: string) => {
    const ymd = date.split('T')[0];
    const hms = (date.split('T')[1]).split('.')[0];
    return ymd + ' ' + hms;
  };

export const reportHeaders : GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 50 
    },
    {
      field: 'date',
      headerName: 'Date',
      description: 'Datetime of the performed operation',
      width: 170,
      editable: false,
      hideable: true,
      sortable: true,
      sortingOrder: ['desc', 'asc', 'desc'],
      filterable: false,
      valueGetter: (_val: never, row: { date: string }) => doFormatDate(row.date),
    },
    {
      field: 'operation',
      headerName: 'Operation',
      description: 'Name of the performed operation',
      type: 'string',
      width: 160,
      editable: false,
      sortable: true,
      sortingOrder: ['desc', 'asc', 'desc'],
      filterable: false, 
      valueGetter: (_val: never, row: { operation: { type: string; }; }) => `${row.operation.type.split('_').join(' ')}`,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      description: 'Values (delimited by space when present)',
      type: 'string',
      align: 'center',
      sortable: false,
      width: 150,
    },
    {
      field: 'operationResponse',
      headerName: 'Result',
      description: 'Resulting value',
      align: 'center',
      width: 100,
      sortable: false,
      editable: false,
      filterable: false,
    },
    {
      field: 'userBalance',
      headerName: 'Balance',
      description: 'Current balance after deduction of the operation cost',
      type: 'number',
      sortable: true,
      sortingOrder: ['asc', 'desc', 'asc'],
      editable: false,
      filterable: false, 
      width: 100,
    },
  ];
