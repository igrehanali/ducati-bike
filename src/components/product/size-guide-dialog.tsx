"use client"

import Image from "next/image"
import Link from "next/link"

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { SizeTable } from "@/lib/size-guide"

export function SizeTableView({ table }: { table: SizeTable }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-5 text-subtle">{table.intro}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-black text-white">
              {table.columns.map((column) => (
                <th key={column} scope="col" className="px-3 py-2.5 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-b border-black/10 even:bg-surface">
                {row.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="px-3 py-2.5 font-semibold">
                      {cell}
                    </th>
                  ) : (
                    <td key={i} className="px-3 py-2.5 font-mono">
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-semibold">How to measure</p>
        <ul className="list-disc pl-5 text-sm leading-5 text-subtle">
          {table.howToMeasure.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function SizeGuideDialog({ table }: { table?: SizeTable }) {
  const trigger = (
    <>
      <Image src="/media/icon-ruler.webp" alt="" width={16} height={16} />
      Size Guide
    </>
  )
  const className = "flex w-fit items-center gap-2 text-xs leading-[14px] tracking-[-0.2px] hover:underline"

  if (!table) {
    return (
      <Link href="/size-guide" className={className}>
        {trigger}
      </Link>
    )
  }

  return (
    <Dialog>
      <DialogTrigger className={className}>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-none p-6 sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold">{table.title} size guide</DialogTitle>
        <SizeTableView table={table} />
        <Link href="/size-guide" className="w-fit border-b border-black pb-1 text-sm font-medium">
          View all size guides
        </Link>
      </DialogContent>
    </Dialog>
  )
}
