import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export function TableDemoList() {
    const [tableData, setdata] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/data/get_data`); // Replace with your API URL
                if (!response.ok) {
                    throw new Error('Failed to fetch forms');
                }
                const data = await response.json();
                setdata(data.data);
                
                console.log('Forms:', data.data, tableData);
            } catch (error) {
                console.error('Error fetching forms:', error);
            }
        })()
    }, [])
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead className="w-[100px]">Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Production Per Day Per Machine</TableHead>
                    <TableHead className="text-right">Total Order Quantity</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData?.map((invoice, index) => (
                    <TableRow key={invoice?.startDate}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{invoice?.endDate}</TableCell>
                        <TableCell>{invoice?.productionPerDayPerMachine}</TableCell>
                        <TableCell>{invoice?.totalOrderQuantity}</TableCell>
                        <TableCell className="text-right">{invoice?.isChinaFabricPresent}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
