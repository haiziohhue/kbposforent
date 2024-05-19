import {Button, Card, IconButton, Stack} from "@mui/material";
import {DataGrid, GridCellParams, GridColDef} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import React, {useEffect, useState} from "react";
import {HRManagerLog} from "../../../interfaces";
import CreateIcon from '@mui/icons-material/Create';
import dayjs from "dayjs";
import {HRManageCreate} from "./create";
import {HRManageEdit} from "./edit";
import axios from "axios";
import {API_URL, TOKEN_KEY} from "../../../constants";

const hrManageUrl = API_URL + "/api/hr-manager-logs"
export const HRManageList = () => {
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [showCreate, setShowCreate] = useState<boolean>(false)
    const [select, setSelect] = useState<HRManagerLog>()
    const [rows, setRows] = useState<HRManagerLog[]>()
    const  [deleteEffect,setDeleteEffect] = useState(false)
    useEffect(() => {
        axios
            .get(hrManageUrl, {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}})
            .then(({data}) => {
                setRows(data?.data.map(item => {
                    return {
                        id: item.id,
                        ...item.attributes
                    }
                }))
            })
    }, [showEdit, showCreate,deleteEffect])
    const editRecord = (e) => {
        setSelect(e as HRManagerLog)
        setShowEdit(true)
    }

    const submitChange = (data: Partial<HRManagerLog>) => {
        axios.put(
            `${hrManageUrl}/${data.id}`,
            {data},
            {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}})
            .finally(() => setShowEdit(false))
    }
    const submitCreate = (data: HRManagerLog) => {
        axios.post(
            `${hrManageUrl}`,
            {data},
            {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}})
            .finally(() => setShowCreate(false))
    }
    const deleteRecord = (id: number) => {
        const confirm = window.confirm("Are you sure to delete this record?")
        if (confirm) {
            axios
                .delete(
                    `${hrManageUrl}/${id}`,
                    {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}}
                ).finally(() => setDeleteEffect(!deleteEffect))
        }
    }
    const col: GridColDef<HRManagerLog>[] = [
        {field: 'id', headerName: 'ID'},
        {field: 'full_name', headerName: 'Employee'},
        {field: 'type', headerName: 'Type'},
        {
            field: 'start_date', headerName: 'Start Date'
            , renderCell: (params: GridCellParams) => {
                return <>{dayjs(params.row.startDate).format('YY-MM-DD')}</>
            }
        },
        {
            field: 'end_date', headerName: 'End Date',
            renderCell: (params: GridCellParams) => {
                return <>{dayjs(params.row.endDate).format('YY-MM-DD')}</>
            }

        },
        {field: 'approver', headerName: 'Approve'},
        {field: 'duration', headerName: 'Duration'},
        {field: 'notes', headerName: 'Note'},
        {field: 'reason', headerName: 'Reason'},
        {field: 'status', headerName: 'status'},
        {
            field: "actions",
            type: "actions",
            headerName: "Actions", renderCell: (params: GridCellParams) => {
                return <>
                    <IconButton
                        onClick={() => editRecord(params.row)}>
                        <CreateIcon/>
                    </IconButton>
                    <IconButton onClick={() => deleteRecord(params.row.id as number)}>
                        <DeleteIcon/>
                    </IconButton>
                </>
            }
        }
    ]
    return <>
        <HRManageCreate
            open={showCreate}
            onConfirm={submitCreate}
            onClose={() => setShowCreate(false)}
        />
        <HRManageEdit
            open={showEdit}
            onClose={() => setShowEdit(false)}
            data={select}
            onConfirm={submitChange}/>
        <Stack spacing={2}>
            <Card>
                <div style={{padding: "12px"}}>
                    <h1>Employee Log</h1>
                    <Button
                        onClick={() => setShowCreate(true)}
                        variant={'contained'}
                    >New Record</Button>
                </div>
            </Card>
            <DataGrid
                rows={rows ?? []}
                columns={col}
                key={'id'}
                initialState={{pagination: {paginationModel: {page: 0, pageSize: 10}}}}
                pageSizeOptions={[5, 10, 20]}
            />
        </Stack>
    </>
}