import {API_URL} from "../../../constants";
import dayjs from "dayjs";

const getMonthHeadAndTail = (year: number, month: number) => {
    const startDate = dayjs(`${year}-${month+1}-01`)
    const endDate = dayjs(`${year}-${month+1}-${startDate.daysInMonth()}`)
    return {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD")
    }
}
export const timeForm = (str: string) => {
    const stepOne = str.split(".")[0].split(":")
    return `${stepOne[0]}:${stepOne[1]}`
}
export const url = `${API_URL}/api/tracking-worked-hours`
/**
 *
 * @param year
 * @param month
 * @example filters[date][$gte]=2024-05-01&filters[date][$lte]=2024-05-31
 */
export const monthQuery = (year: number, month: number): string => {
    const {startDate, endDate} = getMonthHeadAndTail(year, month)
    return `filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}`
}
/**
 *
 * @param day
 * @example filters[date][$eq]=2024-05-01
 */
export const dayQuery = (day: Date): string => {
    const Day = new dayjs.Dayjs(day).format("YYYY-MM-DD")
    return `filters[date][$eq]=${Day}`
}