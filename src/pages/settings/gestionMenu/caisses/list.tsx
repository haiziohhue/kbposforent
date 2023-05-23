import { HttpError, IResourceComponentsProps } from '@refinedev/core';
import React, { useCallback } from 'react';
import { ICategory } from '../../../../interfaces';
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
  Edit,
  RemoveCircleOutline,
} from '@mui/icons-material';
import { EditButton, List, SaveButton } from '@refinedev/mui';

export const ListCaisses = () => {
  const {
    refineCore: { onFinish, id, setId },
    register,
    handleSubmit,
  } = useForm<ICategory>({
    refineCoreProps: {
      redirect: false,
      action: 'edit',
    },
  });

  const columns = React.useMemo<ColumnDef<ICategory>[]>(
    () => [
      {
        id: 'nom',
        accessorKey: 'nom',
        header: 'Title',
        cell: function render({ row, getValue }) {
          return (
            <Stack direction="row" alignItems="center" spacing={3}>
              <IconButton onClick={() => row.toggleExpanded()}>
                {row.getIsExpanded() ? (
                  <RemoveCircleOutline fontSize="small" />
                ) : (
                  <AddCircleOutline fontSize="small" />
                )}
              </IconButton>
              <Typography>{getValue() as string}</Typography>
            </Stack>
          );
        },
      },
      // {
      //   id: 'isActive',
      //   header: t('categories.fields.isActive'),
      //   accessorKey: 'isActive',
      //   cell: function render({ getValue }) {
      //     return <BooleanField value={getValue()} />;
      //   },
      // },
      {
        id: 'actions',
        header: 'Actions',
        accessorKey: 'id',
        cell: function render({ getValue }) {
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
                  <div>Cancel</div>
                </>
              ) : (
                <IconButton
                  onClick={() => {
                    setId(getValue() as string);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
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
    refineCore: { tableQueryResult },
  } = useTable<ICategory>({
    columns,
    // initialState: {
    //   sorting: [{ id: 'title', desc: false }],
    // },
  });
  const handleEditButtonClick = (editId: string) => {
    setId(editId);
  };
  const categories = tableQueryResult?.data;
  console.log(categories);

  // Edit Functionality
  const renderEditRow = useCallback((row: Row<ICategory>) => {
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
            <IconButton onClick={() => row.toggleExpanded()}>
              {row.getIsExpanded() ? (
                <RemoveCircleOutline fontSize="small" />
              ) : (
                <AddCircleOutline fontSize="small" />
              )}
            </IconButton>

            <TextField
              fullWidth
              id="title"
              type="text"
              size="small"
              defaultValue={nom}
              {...register('nom', {
                // required: t('errors.required.field', {
                //   field: 'Title',
                // }),
              })}
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
          <Button onClick={() => setId(undefined)}>Annuler</Button>
        </TableCell>
      </TableRow>
    );
  }, []);

  // Create Modal

  return (
    <List>
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
                    {id === (row.original as ICategory).id ? (
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
                    {/* {row.getIsExpanded() ? (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          {renderRowSubComponent({
                            row,
                          })}
                        </TableCell>
                      </TableRow>
                    ) : null} */}
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
              value: tableQueryResult.data?.total ?? 100,
            },
          ]}
          showFirstButton
          showLastButton
          count={pageCount || 0}
          rowsPerPage={pagination?.pageSize || 10}
          page={pagination?.pageIndex || 0}
          onPageChange={(_, newPage: number) => setPageIndex(newPage)}
          onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setPageSize(parseInt(event.target.value, 10));
            setPageIndex(0);
          }}
        />
      </form>
    </List>
  );
};
