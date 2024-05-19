import React, {useEffect, useState} from "react";
import {IUser, trackingWorkedHours} from "../../../interfaces";
import {getUserList} from "../users";
import dayjs from "dayjs";
import axios, {AxiosResponse} from "axios";
import {TOKEN_KEY} from "../../../constants";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {ScheduleCreate} from "./create";
import {timeForm, url} from "./utlis";

export const ScheduleEdit = ({open, setOpen, date, listData}: {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>, date?: Date, listData: trackingWorkedHours[]
}) => {
    const [employees, setEmployees] = useState<IUser[]>()
    const [showAddFrom, setShowAddFrom] = useState<boolean>(false)
    const [arrayChange, setArrayChange] = useState<trackingWorkedHours[]>([])
    const [deleteRecord, setDeleteRecord] = useState<number[]>([])
    const [status, setStatus] = useState(false)
    useEffect(() => {
        getUserList().then(res => {
            setEmployees(res.data)
        })
    }, [status])
    if (!date) {
        return <></>
    }
    const data = listData.filter(item => {
        return dayjs(item.date).isSame(date, "day");
    })
    const clear = () => {
        setDeleteRecord([])
        setArrayChange([])
        setShowAddFrom(false)
        setOpen(false)
    }
    const confirm = async () => {
        const promiseArr: Promise<AxiosResponse>[] = []
        if (deleteRecord.length) {
            promiseArr.push(...deleteRecord.map(item => axios.delete(
                `${url}/${item}`,
                {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}}
            )))
        }
        if (arrayChange.length) {
            promiseArr.push(...arrayChange.map(item => axios.post(
                `${url}`,
                {data: item},
                {headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}})))
        }
        Promise.all(promiseArr).finally(() => {
            setStatus(!status)
            clear()
        })

    }
    const canel = () => {
        clear()
    }
    return <Dialog
        open={open}
        onClose={() => {
            setOpen(false)
            setShowAddFrom(false)
        }}
        PaperProps={{
            component: 'form',
            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                setOpen(false);
            },
        }}
    >
        <DialogTitle>{date.toDateString()}</DialogTitle>
        <DialogContent>
            <List style={{width: "512px"}}>
                {data ? data.map(item => {
                    if (!item.id || deleteRecord.includes(item.id)) {
                        return null
                    }
                    return (
                        <ListItemButton>
                            <ListItem
                                secondaryAction={
                                    <IconButton aria-label="delete"
                                                onClick={() => {
                                                    if (item.id) {
                                                        setDeleteRecord([...deleteRecord, item.id])
                                                    }
                                                }}>
                                        <DeleteIcon/>
                                    </IconButton>}>
                                <Grid container xs={12} spacing={1}>
                                    <Grid item xs={3}>
                                        {employees?.filter(employee => employee.id === item.employee_id)[0].username}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {`${timeForm(item.start_time)}-${timeForm(item.end_time)}`}
                                    </Grid>
                                    <Grid item xs={6}>
                                        Total Hour: {item.total}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </ListItemButton>
                    )
                }) : null}
                {arrayChange ? arrayChange.map(item => (
                    <ListItemButton>
                        <ListItem
                            secondaryAction={
                                <IconButton aria-label="delete"
                                            onClick={()=>setArrayChange(arrayChange.filter(jtem => jtem.employee_id !== item.employee_id))}>
                                    <DeleteIcon/>
                                </IconButton>}>
                            <Grid container xs={12} spacing={1}>
                                <Grid item xs={3}>
                                    {item.full_name}
                                </Grid>
                                <Grid item xs={3}>
                                    {`${timeForm(item.start_time)}-${timeForm(item.end_time)}`}
                                </Grid>
                                <Grid item xs={6}>
                                    Total Hour: {item.total}
                                </Grid>
                            </Grid>
                        </ListItem>
                    </ListItemButton>
                )) : null}
                {showAddFrom ? (<ScheduleCreate
                        arr={arrayChange}
                        setArr={setArrayChange}
                        date={date}
                        show={showAddFrom}
                        setShow={setShowAddFrom}
                    />
                ) : (
                    <ListItemButton>
                        <ListItem onClick={() => setShowAddFrom(!showAddFrom)} style={{color: "#1976D2"}}>
                            + new
                        </ListItem>
                    </ListItemButton>
                )}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={canel}>Cancel</Button>
            <Button onClick={confirm}>Confirm</Button>
        </DialogActions>
    </Dialog>
}