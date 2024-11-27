
import { Record } from './ReportResponse';

const reportEndpoint = import.meta.env.VITE_APP_LOG_ENDPOINT || "";

const headers = () => {
  return {
    'Authorization': sessionStorage?.getItem('authorization') || '',
    "Content-Type": "application/json",
  };
}

async function reportResponse(model: { page: number; pageSize: number }, queryOptions: { sortModel: Iterable<unknown, void, undefined>; }, filter: string, ): Promise<Response> {
  const { page, pageSize } = model;
  const url = new URL(reportEndpoint);
  const { sortModel: [...sModel] } = queryOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortField = (<any>sModel[0])?.field || 'date';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortOrder = (<any>sModel[0])?.sort || 'desc';
  url.searchParams.set('page', '' + page);
  url.searchParams.set('pageSize', '' + pageSize);
  url.searchParams.set('sortField', sortField);
  url.searchParams.set('sortOrder', sortOrder);

  if (filter.length > 0) {
    url.searchParams.set('filter', encodeURI(filter));
  }

  return await fetch(url.toString(), {
    headers: new Headers(headers()),
    credentials: "include",
  });
}

export async function deleteRecord(id: string): Promise<Response> {


  return await fetch(`${reportEndpoint}/${id}/is-excluded`, {
    method: "PUT",
    headers: headers(),
    body: 'true',
    credentials: "include",
  });
}

export function doReport(
  model: { page: number; pageSize: number },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions: any,
  filter: string,
  setLog: (logs: Record[]) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPaginationModel: (pagination: any) => void
) {
  reportResponse(model, queryOptions, filter)
    .then((res) => res.json())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((data: any) => {
      const resp = {
        page: data.page.number,
        pageSize: data.page.size,
        pageInfo: {
          rows: data.content,
          isLoading: false,
          totalRowCount: data.page.totalElements,
        },
      };
      setLog(data.content);
      setPaginationModel(resp);
    })
    .catch((err: unknown) => alert("Error fetching log data: " + JSON.stringify(err)));
}

export function doDeleteSelectedRows(
  selectedRows: string[],
  log: Record[],
  setLog: (logs: Record[]) => void,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setPaginationModel: (pagination: any) => void,
  setSelectedRows: (rows: string[]) => void
) {
  const updatedLog = [...log];

  selectedRows.forEach((rowId) => {
    if (rowId && rowId.length > 0) {
      deleteRecord(rowId)
        .then(() => {
          const filteredRows = updatedLog.filter((r) => r.id !== rowId);
          setLog(filteredRows);
          setSelectedRows([]);
        })
        .catch((err: unknown) =>
          alert("Error deleting record: " + JSON.stringify(err))
        )
        .finally(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setPaginationModel((prev: any) => ({
            ...prev,
            pageInfo: { ...prev.pageInfo, isLoading: false },
          }));
        });
    }
  });
}
