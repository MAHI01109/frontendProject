import { useForm, useFieldArray, } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from "@/lib/utils"
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { MultiSelect } from '@/components/multi-select';
import { DatePicker } from '@/components/ui/date-picker';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { accessoriesOptions, fabricOptions, stagesToBeSkippedOptions, trimsOptions, processesOptions } from '@/data/index'
import { toast } from "@/components/ui/use-toast"
import { Plus, Delete } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FormSchema = z.object({
  startDate: z.date({
    required_error: 'Start date is required.',
  }),
  endDate: z.date({
    required_error: 'End date is required.',
  }),
  productionPerDayPerMachine: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: 'Must be a valid number',
    })
    .transform((value) => Number(value)),
  totalOrderQuantity: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: 'Must be a valid number',
    })
    .transform((value) => Number(value)),
  fabricSection: z.array(
    z.object({
      fabricName: z.string({ required_error: 'Fabric name is required' }),
      perPieceRequirement: z
        .string()
        .refine((value) => !isNaN(Number(value)), {
          message: 'Must be a valid number',
        })
        .transform((value) => Number(value)),
      chooseUnit: z.enum(['Metre', 'Kg'], { required_error: 'Please choose a unit.' }),
      processes: z
        .array(z.string())
        .nonempty({ message: 'At least one process must be selected.' }),
      colorAndQuantity: z.array(
        z.object({
          color: z.string().min(1, { message: 'Color cannot be empty.' }),
          quantity: z
            .string()
            .refine((value) => !isNaN(Number(value)), {
              message: 'Must be a valid number.',
            })
            .transform((value) => Number(value)),
        })
      ),
      stagesToBeSkipped: z
        .array(z.string())
        .nonempty({ message: 'At least one stage must be selected.' }),
    })
  ),
  isChinaFabricPresent: z.enum(['Yes', 'No'], { required_error: 'Please choose a unit.' }),
  selectChinaFabric: z.array(z.string()).nonempty({ message: 'At least one stage must be selected.' }),
  accessories: z.array(z.string()).nonempty({ message: 'At least one stage must be selected.' }).optional(),
  trims: z.array(z.string()).nonempty({ message: 'At least one stage must be selected.' }).optional(),
});

type FormValues = z.infer<typeof FormSchema>;


const DynamicForm = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      startDate: new Date(),
      endDate: new Date(),
      productionPerDayPerMachine: undefined,
      totalOrderQuantity: undefined,
      fabricSection: [
        {
          fabricName: '',
          perPieceRequirement: undefined,
          chooseUnit: 'Metre',
          processes: [],
          colorAndQuantity: [{ color: '', quantity: undefined }],
          stagesToBeSkipped: [],
        },
      ],
    },

  });
  const watchIsChinaFabricPresentField = form.watch('isChinaFabricPresent');
  const onSubmit = async (formData: FormValues) => {
    try {
      const response = await fetch(`${BASE_URL}/data/add_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add form');
      }

      const { data, message } = await response.json();

      toast({
        title: "You submitted the following values:✅",
        description: (message),
      });
      navigate('/list');
    } catch (error) {
      console.error('Error adding form:', error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-14">
        <div className='grid grid-cols-2 gap-4'>
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className='col-span-1'>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select start date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    placeholder="Select end date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {/* Production Per Day Per Machine */}
          <FormField
            control={form.control}
            name="productionPerDayPerMachine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Production Per Day Per Machine</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter production count"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Order Quantity */}
          <FormField
            control={form.control}
            name="totalOrderQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Order Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter total order quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DynamicFabricSection form={form} />
        <div className='grid grid-cols-2 items-center'>
          <FormField
            control={form.control}
            name="isChinaFabricPresent"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Is China Fabric Present ?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex  space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Yes" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="No" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='selectChinaFabric'
            render={({ field }) => (
              <FormItem className='col-span-1'>
                <FormLabel>Select China Fabric</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={fabricOptions}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Select options"
                    variant="inverted"
                    //animation={2}
                    maxCount={20}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {
          watchIsChinaFabricPresentField === "Yes" && (
            <div className='border p-4 space-y-6'>
              <h1 className='text-lg'>Choose Major Fabric</h1>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='trims'
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel>Select China Fabric</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={trimsOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select options"
                          variant="inverted"
                          //animation={2}
                          maxCount={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='accessories'
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel>Select China Fabric</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={accessoriesOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select options"
                          variant="inverted"
                          //animation={2}
                          maxCount={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )
        }

        <Button size={'lg'} variant={'default'} type="submit" className="">
          Submit
        </Button>
      </form>
    </Form>

  );
};

const DynamicFabricSection = ({ form }: { form: any }) => {
  const {
    fields: fabricFields,
    append: appendFabric,
    remove: removeFabric,
  } = useFieldArray({
    control: form.control,
    name: 'fabricSection',
  });

  return (
    <div className='flex flex-col'>
      <div className='flex p-3 justify-between items-center'>
        <h1 className='text-lg'>Fabric Section</h1>
        <Button
          size={'icon'}
          type="button"
          variant={'secondary'}
          onClick={() =>
            appendFabric({
              fabricName: '',
              perPieceRequirement: undefined,
              chooseUnit: '',
              processes: [],
              stagesToBeSkipped: [],
              colorAndQuantity: [{ color: '', quantity: undefined }],
            })
          }
        >
          <Plus className='w-4 h-4' />
        </Button>
      </div>
      <div className=''>
        {fabricFields.map((fabric, fabricIndex) => (
          <div key={fabric.id} className="border p-4 mb-3 rounded-md">
            <div className='flex justify-between items-center'>
              <h3 className="font-bold text-blue-500 mb-4">Fabric Section {fabricIndex + 1}</h3>
              <Button
                size={'icon'}
                type="button"
                variant={'destructive'}
                onClick={() => removeFabric(fabricIndex)}
              >
                <Delete className='w-4 h-4' />
              </Button>
            </div>

            <div className="space-y-4">
              <div className='grid grid-cols-3 gap-4 mt-2'>
                <FormField
                  control={form.control}
                  name={`fabricSection.${fabricIndex}.fabricName`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fabric Name</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? fabricOptions.find((item) => item.value === field.value)?.label
                                : "Select Fabric"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search fabric..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No Fabric found.</CommandEmpty>
                              <CommandGroup>
                                {fabricOptions.map((item) => (
                                  <CommandItem
                                    value={item.label}
                                    key={item.value}
                                    onSelect={() => {
                                      field.onChange(item.value); // Correctly updates the current field
                                    }}
                                  >
                                    {item.label}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        item.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fabricSection.${fabricIndex}.perPieceRequirement`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Per Piece Requirement</FormLabel>
                      <FormControl>
                        <Input placeholder="Requirement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fabricSection.${fabricIndex}.chooseUnit`}
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Choose Unit</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex  space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Metre" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Metre
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Kg" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Kg
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name={`fabricSection.${fabricIndex}.processes` as const}
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel>Processes</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={processesOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select options"
                          variant="inverted"
                          //animation={2}
                          maxCount={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fabricSection.${fabricIndex}.stagesToBeSkipped` as const}
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel>Stages to Be SKipped</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={stagesToBeSkippedOptions}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          placeholder="Select options"
                          variant="inverted"
                          // animation={2}
                          maxCount={20}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='border p-5'>
                <div className="space-y-4 ">
                  <UseFieldArrayForColors
                    form={form}
                    fabricIndex={fabricIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>


  )

}


const UseFieldArrayForColors = ({
  form,
  fabricIndex,
}: {
  form: any;
  fabricIndex: number;
}) => {
  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: `fabricSection.${fabricIndex}.colorAndQuantity` as const,
  });

  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center '>
        <h4 className="font-bold">Colors and Quantities</h4>
        <Button
          type="button"
          variant={'outline'}
          onClick={() =>
            appendColor({
              color: '',
              quantity: undefined,
            })
          }
        >
          Add Color and Quantity
        </Button>
      </div>

      {colorFields.map((color, colorIndex) => (
        <div key={color.id} className="flex gap-4 items-center">
          {/* Color */}
          <div>
            <FormField
              control={form.control}
              name={`fabricSection.${fabricIndex}.colorAndQuantity.${colorIndex}.color`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            {/* Quantity */}
            <FormField
              control={form.control}
              name={`fabricSection.${fabricIndex}.colorAndQuantity.${colorIndex}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Quantity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button
              type="button"
              variant="destructive"
              onClick={() => removeColor(colorIndex)}
              className='align-baseline mt-8'
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

    </div>
  );
};



export default DynamicForm;
