import React, { useState } from 'react';
import { Modal, Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { DataGrid, GridRowSelectionModel, GridSortItem } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { reportHeaders } from './ReportHeaders';
import { Record } from './ReportResponse';
import { doReport, doDeleteSelectedRows } from './RecordReportService';
import { useModal } from './ReportController';

const RecordLog: React.FC = () => {
  const columns = reportHeaders;

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 2, pageInfo: { rows: new Array<Record>(), isLoading: false, totalRowCount: 0 } });
  const [queryOptions, setQueryOptions] = useState({ filterModel: "", sortModel: [{'field': 'date', 'sort': 'desc'}] });
  const [log, setLog] = useState<Record[]>(Array<Record>());
  const [search, setSearch] = useState<string>('');
  const [searchOn, setSearchOn] = useState<boolean>(true);
  const { state, dispatch } = useModal();
  
  const handleSortModelChange = (sortModel: GridSortItem[]) => {
    const newOptions = queryOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    newOptions.sortModel = [...sortModel] as any[];
    setQueryOptions(newOptions);
    doReport(paginationModel, queryOptions, search, setLog, setPaginationModel);
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_REPORT' });
  };

  const handleSearch = () => {
    if (searchOn && search.length > 0) {
      setSearchOn(false);
      doReport(paginationModel, queryOptions, search, setLog, setPaginationModel);
    } else {
      setSearchOn(true);
      setSearch("");
      doReport(paginationModel, queryOptions, "", setLog, setPaginationModel);
    }
  };
  
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const buttonStyle = {
    backgroundColor: '#2F4F7F', 
    '&:hover': {
      backgroundColor: '#0e064c', 
    },
  };

  return (
    <Modal
      open={state.isOpen}
      onClose={handleClose}
      aria-labelledby="Record Logs"
    >
      <Box sx={modalStyle}>
        <DataGrid
          columnVisibilityModel={{ id: false }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 2,
              },
            },
            sorting: {
              sortModel: [{ field: "date", sort: "desc" }],
            },
          }}
          rows={log}
          columns={columns}
          rowCount={paginationModel.pageInfo.totalRowCount}
          loading={paginationModel.pageInfo.isLoading}
          checkboxSelection
          disableRowSelectionOnClick
          keepNonExistentRowsSelected
          pagination
          pageSizeOptions={[2, 4, 6]}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(rows) => setSelectedRows(rows)}
          onPaginationModelChange={(model) => doReport(model, queryOptions, search, setLog, setPaginationModel)}
          onSortModelChange={handleSortModelChange}
        />
          <Button
            id="modal-init-button"
            style={{ display: "none" }}
            onClick={() => doReport(paginationModel, queryOptions, search, setLog, setPaginationModel)}
          >
          </Button>
        <Button
          sx={buttonStyle}
          onClick={() => doDeleteSelectedRows([...selectedRows as string[]] , log, setLog, setPaginationModel, setSelectedRows)}
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        &nbsp;
        <Button
          sx={buttonStyle}
          onClick={() => doReport(paginationModel, queryOptions, search, setLog, setPaginationModel)}
          variant="contained"
          startIcon={<RefreshIcon />}
        >
          Refresh
        </Button>
        &nbsp;
        <TextField
          placeholder="Search Operation"
          type="text-search"
          size="small"
          onChange={(e) => {
            setSearchOn(true);
            setSearch(e.target.value);
          }}
          value={search}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={searchOn ? "search" : "clear"}
                  onClick={handleSearch}
                  edge="end"
                >
                  {searchOn ? <SearchIcon /> : <ClearIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Modal>
  );
};

export default RecordLog;
