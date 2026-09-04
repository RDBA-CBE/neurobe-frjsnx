import React from 'react'

const TableTitle = ({title, label, subLabel}) => {
  return (
    <div className='flex justify-between'>
        <div className='section-ti ps-2'>{title}</div>
        <div className='text-pri text-xs font-semibold'><span>{label} </span> • <span> {subLabel}</span></div>
    </div>
  )
}

export default TableTitle