import { IResourceComponentsProps, useTable } from '@refinedev/core';
import React from 'react';
import { IMenu } from '../../../../interfaces';
import { useDataGrid } from '@refinedev/mui';

export const ListMenus: React.FC<IResourceComponentsProps> = () => {
  // const {
  //   options: {
  //     state: { pagination },
  //     pageCount,
  //   },

  //   setPageSize,
  //   refineCore: { tableQueryResult },
  // } = useTable<ICategory>({
  //   // columns,
  //   // initialState: {
  //   //   sorting: [{ id: 'title', desc: false }],
  //   // },
  // });
  const { dataGridProps } = useDataGrid<IMenu>({
    // initialPageSize: 10,
    // permanentFilter: [
    //   {
    //     field: 'category.id',
    //     operator: 'eq',
    //     value: record.id,
    //   },
    // ],
    syncWithLocation: false,
  });
  console.log(dataGridProps);
  return <div>ListMenu</div>;
};
