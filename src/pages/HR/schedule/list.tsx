import React, {useEffect, useState} from "react";
import {IResourceComponentsProps} from "@refinedev/core";
import {List, ListItem, Stack,} from "@mui/material";
import {Calendar} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {IUser, trackingWorkedHours} from "../../../interfaces";
import {TOKEN_KEY} from "../../../constants";
import {getUserList} from "../users";
import axios from "axios";
import {ScheduleEdit} from "./edit";
import {monthQuery, timeForm, url} from "./utlis";

export const ScheduleList: React.FC<IResourceComponentsProps> = () => {
    const [employees, setEmployees] = useState<IUser[]>()
    const [selectDate, setSelectDate] = useState<Date>()
    const [showEdit, setShowEdit] = useState<boolean>(false)
    const [listData, setListData] = useState<trackingWorkedHours[]>([])
    useEffect(() => {
        if (showEdit) {
            return
        }
        getUserList().then(res => {
            setEmployees(res.data)
        })
        const range = selectDate ?? new Date()
        getData(dayjs(range))
    }, [showEdit])
    const panelChange = (value: Dayjs, mode: string) => {
        if (mode === "month") {
            getData(value)
        }
    }
    const getData = (value: Dayjs) => {
        axios.get(`${url}?${monthQuery(value.year(), value.month())}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        }).then(({data}) => {
            setListData(data?.data.map(item => {
                return {
                    id: item.id,
                    ...item.attributes
                }
            }))
        })
    }
    const cellRender = (value: Dayjs) => {
        const data = listData.filter(item => {
            return dayjs(item.date).isSame(value, "day");
        })
        return <>
            {data.length ?
                <List>
                    {data.map(item => (
                        <ListItem
                            key={item.id}>
                            {`[${employees?.filter(employee => employee.id === item.employee_id)[0]?.username}] ${timeForm(item.start_time)}-${timeForm(item.end_time)}`}
                        </ListItem>
                    ))}
                </List> : ""
            }
        </>
    }
    return <>
        <ScheduleEdit setOpen={setShowEdit} date={selectDate} open={showEdit} listData={listData}/>
        <Stack>
            <TopButton></TopButton>
            <Calendar
                cellRender={cellRender}
                onSelect={(date, {source}) => {
                    if (source === 'date') {
                        setSelectDate(date.toDate())
                        setShowEdit(true)
                    }
                }}
                onPanelChange={panelChange}
            />
        </Stack>
    </>
}
const TopButton = () => {
    return <h2>Schedule</h2>

}

