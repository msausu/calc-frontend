import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RecordLog from './RecordReportComponent';
import { useModal } from './ReportController';
import { doReport, doDeleteSelectedRows } from './RecordReportService';

const mockRecords : string = `{
    "content": [
        {
            "id": "08c27836-f300-428e-9473-2e8621f844da",
            "date": "2024-11-23T13:18:17.824221Z",
            "operationResponse": "12345678",
            "operation": {
                "type": "RANDOM_STRING"
            },
            "amount": "",
            "userBalance": 100.00
        }
    ],
    "page": {
        "size": 2,
        "number": 0,
        "totalElements": 1,
        "totalPages": 1
    }
}`;

vi.mock('./ReportController', () => ({
  useModal: vi.fn(),
}));

vi.mock('./RecordReportService', () => ({
  doReport: vi.fn(),
  doDeleteSelectedRows: vi.fn(),
}));

describe('RecordLog Component', () => {
  const mockDispatch = vi.fn();
  const mockDoReport = doReport;
  const mockDoDeleteSelectedRows = doDeleteSelectedRows;

  beforeEach(() => {
    vi.resetAllMocks();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useModal as any).mockReturnValue({
      state: { isOpen: true },
      dispatch: mockDispatch,
    });

    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mockRecords) } as Response));
  });

  it('renders and displays the modal when open', async () => {
    render(<RecordLog />);

    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });

  it('calls doReport on refresh button click', async () => {
    render(<RecordLog />);

    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(mockDoReport).toHaveBeenCalled();
    });
  });

  it('calls doDeleteSelectedRows on delete button click', async () => {
    render(<RecordLog />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDoDeleteSelectedRows).toHaveBeenCalled();
    });
  });

  it('handles search functionality', async () => {
    render(<RecordLog />);

    const searchInput = screen.getByPlaceholderText('Search Operation');
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const searchIcon = screen.getByLabelText('search');
    fireEvent.click(searchIcon);

    await waitFor(() => {
      expect(mockDoReport).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'test',
        expect.anything(),
        expect.anything()
      );
    });
  });
});
