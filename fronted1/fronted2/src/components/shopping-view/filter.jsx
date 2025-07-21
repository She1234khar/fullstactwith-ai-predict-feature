import { filterOptions } from '@/config/pt'
import React, { Fragment } from 'react'
import { Label } from '../ui/label'
import { Checkbox } from '../ui/checkbox'

export default function ProducrFilter({filters,handleFilter}) {
  return (
    <div className='bg-background rounded-lg shadow-sm'>
      <div className='p-4 border-b'>
        <h2 className='text-lg font-extrabold'>filter</h2>

      </div>
      <div className="p-4 space-y-4">
  {Object.keys(filterOptions).map((keyItem) => (
    <Fragment key={keyItem}>
      <div>
        <h3 className="text-base font-bold">{keyItem}</h3>
        <div className="grid gap-2 mt-2">
  {filterOptions[keyItem].map((option) => (
    <Label key={option.id} className="flex font-medium items-center gap-2">
      <Checkbox checked={
  filters &&
  Object.keys(filters).length > 0 &&
  filters[keyItem] &&
  filters[keyItem].indexOf(option.id) > -1
}

        onCheckedChange={() => handleFilter(keyItem, option.id)}
      />
      {option.label}
    </Label>
  ))}
</div>

      </div>
    </Fragment>
  ))}
</div>

      
    </div>
  )
}
