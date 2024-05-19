import React, {useEffect, useState} from "react";
import {IUser, trackingWorkedHours} from "../../../interfaces";
import {getUserList} from "../users";
import dayjs, {Dayjs} from "dayjs";
import {IconButton, ListItem, MenuItem, Select, Stack, TextField} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {TimePicker} from "@mui/x-date-pickers/TimePicker";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export const ScheduleCreate = ({arr, setArr, date, show, setShow}: {
                        arr: trackingWorkedHours[],
                        setArr: React.Dispatch<React.SetStateAction<trackingWorkedHours[]>>,
                        date: Date,
                        show: boolean,
                        setShow: React.Dispatch<React.SetStateAction<boolean>>
                    }
) => {
    const [selectEmployee, setSelectEmployee] = useState<{ full_name: string, employee_id: number }>()
    const [startTime, setStartTime] = useState<Date | null>()
    const [endTime, setEndTime] = useState<Date | null>()
    const [total, setTotal] = useState<number | null>()
    const [employees, setEmployees] = useState<IUser[]>()
    useEffect(() => {
        getUserList().then(res => {
            setEmployees(res.data)
        })
    }, [])
    const setEmployee = (id: number) => {
        const user = employees?.find(item => item.id === id)
        if (user) {
            setSelectEmployee({
                full_name: user.username ?? "",
                employee_id: user.id,
            })
        }
    }
    const Confirm = () => {
        console.log({
            employee_id: selectEmployee?.employee_id,
            full_name: selectEmployee?.full_name,
            date: date,
            end_time: dayjs(endTime).format("HH:mm.ss.ms"),
            start_time: dayjs(startTime).format("HH:mm.ss.ms"),
            total: total
        })
        if (selectEmployee && startTime && endTime && total) {
            setArr([...arr, {
                employee_id: selectEmployee.employee_id,
                full_name: selectEmployee.full_name,
                date: dayjs(date).format("YYYY-MM-DD"),
                end_time: dayjs(endTime).format("HH:mm:ss.ms"),
                start_time: dayjs(startTime).format("HH:mm:ss.ms"),
                total: total
            }])
            clearForm()
        }
    }
    const Close = () => {
        clearForm()
    }
    const clearForm = () => {
        setStartTime(null)
        setEndTime(null)
        setSelectEmployee(undefined)
        setShow(false)
    }
    if (show)
        return (
            <ListItem>
                <Stack spacing={2}>
                    <Select
                        label="Employee"
                        value={selectEmployee}
                        onChange={(e) => setEmployee(e.target.value as unknown as number)}>
                        {employees?.map(item => {
                            return (
                                <MenuItem
                                    key={item.id}
                                    value={item.id}>
                                    {item.username}
                                </MenuItem>)
                        })}
                    </Select>
                    <TextField id="total" label="Total Hours" onChange={(e)=>setTotal(e.target.value as unknown as number)}/>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker onChange={(e:Dayjs | null) => {
                            if(e){setStartTime(e.toDate())}
                        }} label="StartTime"/>
                        <TimePicker onChange={(e:Dayjs | null) => {
                            if(e){setEndTime(e.toDate())}
                        }} label="EndTime"/>
                    </LocalizationProvider>
                    <div>
                        <IconButton onClick={Confirm}>
                            <CheckRoundedIcon />
                        </IconButton>
                        <IconButton onClick={Close}>
                            <CloseRoundedIcon/>
                        </IconButton>
                    </div>
                </Stack>
            </ListItem>)
    else return <></>
}