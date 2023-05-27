import {
  HttpError,
  IResourceComponentsProps,
  useDelete,
} from '@refinedev/core';
import React, { useCallback } from 'react';
import { ITable } from '../../../../interfaces';
import { useForm, useModalForm } from '@refinedev/react-hook-form';
import { ColumnDef, flexRender, Row } from '@tanstack/react-table';
import { useTable } from '@refinedev/react-table';
import {
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  AddCircleOutline,
  Delete,
  Edit,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { CreateButton, EditButton, List, SaveButton } from '@refinedev/mui';
import { CreateTable } from './create';

export const ListTables: React.FC<IResourceComponentsProps> = () => {
  const { mutate: mutateDelete } = useDelete();
  const {
    refineCore: { onFinish, id, setId },
    register,
    handleSubmit,
  } = useForm<ITable>({
    refineCoreProps: {
      redirect: false,
      action: 'edit',
    },
  });
  // Modal
  const createModalFormProps = useModalForm<ITable, HttpError, ITable>({
    refineCoreProps: { action: 'create' },
  });
  const {
    modal: { show: showCreateModal },
  } = createModalFormProps;
  const columns = React.useMemo<ColumnDef<ITable>[]>(
    () => [
      {
        id: 'nom',
        accessorKey: 'nom',
        header: 'Title',
        cell: function render({ row, getValue }) {
          return (
            <Stack direction="row" alignItems="center" spacing={3}>
              <Typography>{getValue() as string}</Typography>
            </Stack>
          );
        },
      },

      {
        id: 'actions',
        header: 'Actions',
        accessorKey: 'id',
        cell: function render({ row, getValue }) {
          return (
            <Stack direction="row">
              {id ? (
                <>
                  <EditButton
                    onClick={() => {
                      handleEditButtonClick(getValue() as string);
                    }}
                  >
                    Edit
                  </EditButton>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      setId(getValue() as string);
                      console.log(setId(getValue() as string));
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      mutateDelete({
                        resource: 'tables',
                        id: row.original.id,
                        mutationMode: 'undoable',
                        undoableTimeout: 10000,
                      });
                      console.log(id);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </>
              )}
            </Stack>
          );
        },
      },
    ],
    []
  );

  const {
    options: {
      state: { pagination },
      pageCount,
    },
    getHeaderGroups,
    getRowModel,
    setPageIndex,
    setPageSize,
    refineCore: {
      tableQueryResult: { data: tableData },
    },
  } = useTable<ITable>({
    columns,
    // initialState: {
    //   sorting: [{ id: 'title', desc: false }],
    // },
  });
  const handleEditButtonClick = (editId: string) => {
    setId(editId);
  };

  // Edit Functionality
  const renderEditRow = useCallback((row: Row<ITable>) => {
    const { id, nom } = row.original;

    return (
      <TableRow key={`edit-${id}-inputs`}>
        <TableCell
          sx={{
            flex: '1',
          }}
        >
          <Stack
            direction="row"
            spacing={3}
            alignContent="center"
            alignItems="center"
          >
            <TextField
              fullWidth
              id="title"
              type="text"
              size="small"
              defaultValue={nom}
              {...register('nom', {
                required: 'This field is required',
              })}
              InputProps={{
                inputProps: {
                  style: { textTransform: 'capitalize' },
                  maxLength: 50,
                  onChange: (event) => {
                    const target = event.target as HTMLInputElement;
                    target.value =
                      target.value.charAt(0).toUpperCase() +
                      target.value.slice(1);
                  },
                },
              }}
            />
          </Stack>
        </TableCell>
        {/* <TableCell>
          <Checkbox
            id="isActive"
            defaultChecked={isActive}
            {...register('isActive')}
          />
        </TableCell> */}

        <TableCell
          sx={{
            maxWidth: '150px',
          }}
        >
          <SaveButton type="submit">Enregistrer</SaveButton>
          <Button onClick={() => setId(undefined)}>X</Button>
        </TableCell>
      </TableRow>
    );
  }, []);

  // Create Modal

  return (
    <>
      <List
        createButtonProps={{
          onClick: () => showCreateModal(),
        }}
      >
        <form onSubmit={handleSubmit(onFinish)}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                {getHeaderGroups().map((headerGroup) => (
                  <TableRow key={`header-group-${headerGroup.id}`}>
                    {headerGroup.headers.map((header) => (
                      <TableCell key={`header-group-cell-${header.id}`}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {getRowModel().rows.map((row) => {
                  return (
                    <React.Fragment key={row.id}>
                      {id === (row.original as ITable).id ? (
                        renderEditRow(row)
                      ) : (
                        <TableRow>
                          {row.getAllCells().map((cell) => {
                            return (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            rowsPerPageOptions={[
              5,
              10,
              25,
              {
                label: 'All',
                value: tableData?.total ?? 100,
              },
            ]}
            showFirstButton
            showLastButton
            count={pageCount || 0}
            rowsPerPage={pagination?.pageSize || 10}
            page={pagination?.pageIndex || 0}
            onPageChange={(_, newPage: number) => setPageIndex(newPage)}
            onRowsPerPageChange={(
              event: React.ChangeEvent<HTMLInputElement>
            ) => {
              setPageSize(parseInt(event.target.value, 10));
              setPageIndex(0);
            }}
          />
        </form>
      </List>
      <CreateTable {...createModalFormProps} />
    </>
  );
};
