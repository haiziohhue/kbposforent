import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormLabel,
    MenuItem,
    OutlinedInput,
    Select
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {HRManagerLog, IUser} from "../../../interfaces";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {getUserList} from "../users";

export const HRManageEdit = ({open, onConfirm, onClose, data}: {
    open: boolean,
    onConfirm: (data: Partial<HRManagerLog>) => void,
    onClose: () => void,
    data?: HRManagerLog
}) => {
    const [employees, setEmployees] = useState<IUser[]>()
    const [editData, setEditData] = useState<HRManagerLog>()
    useEffect(() => {
        getUserList().then(res => {
            setEmployees(res.data)
        })
        if (!open || !data) return
        // console.log(data)
        setEditData({
            ...data
        })
    }, [open])
    const confirm = () => {
        if (editData) {
            const changedFields:Partial<HRManagerLog> = {}
            Object.keys(editData).forEach(key => {
                if (data && editData[key] !== data[key]) {
                    changedFields[key] = editData[key];
                }
            });
            if (Object.keys(changedFields).length > 0) {
                changedFields.id=data?.id
                onConfirm(changedFields);
            }
            setEditData(undefined)
        }
    }
    const clear = () => {
        setEditData(undefined)
    }
    const setEmployee = (id: number) => {
        const user = employees?.find(item => item.id === id)
        if (user && editData) {
            setEditData({
                ...editData,
                full_name: user.username,
                employee_id: user.id,
            })
        }
    }


    return <>
        {editData ? <Dialog
            open={open}
            onClose={() => {
                clear();
                onClose()
            }}>
            <DialogTitle>Log Edit</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <FormLabel required>Employee</FormLabel>
                    <Select
                        label="Employee"
                        value={editData?.employee_id}
                        onChange={(e) => setEmployee(e.target.value as number)}>
                        {employees?.map(item => {
                            return (
                                <MenuItem
                                    key={item.id}
                                    value={item.id}>
                                    {item.username}
                                </MenuItem>)
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel required>Type</FormLabel>
                    <Select
                        value={editData?.type}
                        onChange={(e) => setEditData({
                            ...editData,
                            type: e.target.value as 'leave' | 'personal leave' | 'vacation' | 'public holiday'
                        })}>
                        <MenuItem key={1}
                                  value={"leave"}>leave</MenuItem>
                        <MenuItem key={2}
                                  value={"personal leave"}>personal leave</MenuItem>
                        <MenuItem key={3}
                                  value={"vacation"}>vacation</MenuItem>
                        <MenuItem key={4}
                                  value={"public holiday"}>public holiday</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FormLabel required>Start Date</FormLabel>
                        <DatePicker
                            onChange={(e) => setEditData({...editData, start_date: e.$d as Date})}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <FormLabel required>End Date</FormLabel>
                        <DatePicker

                            onChange={(e) => {
                                console.log(editData)
                                setEditData({...editData, end_date: e.$d as Date})
                            }}
                        />
                    </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel required>Status</FormLabel>
                    <Select
                        value={editData?.status}
                        onChange={(e) => setEditData({
                            ...editData,
                            status: e.target.value as 'pending' | 'approved' | 'rejected'
                        })}>
                        <MenuItem key={1}
                                  value={'pending'}>pending</MenuItem>
                        <MenuItem key={2}
                                  value={'approved'}>approved</MenuItem>
                        <MenuItem key={3}
                                  value={'rejected'}>rejected</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel>Duration</FormLabel>
                    <OutlinedInput
                        value={editData?.duration}
                        type={"number"}
                        onChange={(e) => setEditData({...editData, duration: Number(e.target.value)})}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel>Reason</FormLabel>
                    <OutlinedInput
                        value={editData?.reason}
                        onChange={(e) => setEditData({...editData, reason: e.target.value})}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <FormLabel>Note</FormLabel>
                    <OutlinedInput
                        value={editData?.notes}
                        onChange={(e) => setEditData({...editData, notes: e.target.value})}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={confirm}>Confirm</Button>
            </DialogActions>
        </Dialog> : null}
    </>
}