import DynamicForm from '@/components/common/DynamicForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function FormLayout() {
    return (
        <Card className='w-3/4'>
            <CardHeader>
                <CardTitle>
                    <h1 className='text-center text-3xl '>T&A DATA SUBMISSION FORM</h1>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <DynamicForm />
            </CardContent>
        </Card>
    )
}

export default FormLayout