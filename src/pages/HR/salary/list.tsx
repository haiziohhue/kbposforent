import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Salaries} from "../../../interfaces";
import {useEffect, useState} from "react";
import {API_URL, TOKEN_KEY} from "../../../constants";
import axios from "axios";
const salaryUrl = `${API_URL}/api/salaries`
const col: GridColDef<Salaries>[] = [
    {field: 'id', headerName: 'ID'},
    {field: 'employee_id', headerName: 'Employee ID'},
    {field: 'full_name', headerName: 'Full name'},
    {field: 'position', headerName: 'Position'},
    {field: 'hourly_rate', headerName: 'Hourly rate'},
    {field: 'hours_worked', headerName: 'Hours worked'},
    {field: 'overtime_hours', headerName: 'Overtime hours'},
    {field: 'gross_pay', headerName: 'Gross pay'},
    {field: 'deductions', headerName: 'Deduction'},
    {field: 'net_pay', headerName: 'Net pay'},
    {field: 'pay_period', headerName: 'Pay period'},
    {field: 'pay_date', headerName: 'Pay date'},
    {field: 'bank_account_details', headerName: 'Bank account detail'},
];
export const SalaryList = () => {
    const [rows,setRows] = useState<Salaries[]>([])
    useEffect(()=>{
        axios.get(salaryUrl,{headers: {Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`}}).then(({data})=>{
            setRows(data?.data.map(item => {
                return {
                    id: item.id,
                    ...item.attributes
                }
            }))
            console.log(data.data)
        })
    },[])
    return <>
        <DataGrid
            rows={rows}
            columns={col}
            key={'id'}
            initialState={{pagination: {paginationModel: {page: 0, pageSize: 10}}}}
            pageSizeOptions={[5, 10, 20]}
        />
    </>
}