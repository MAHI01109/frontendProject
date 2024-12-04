import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import FormLayout from "./pages/T&A";
import { TableDemoList } from "./pages/T&Alist";



const rotes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <FormLayout />
            },
            {
                path: '/list',
                element: <TableDemoList />
            }
        ]
    }
])

export { rotes };