import type { ReactNode } from "react"
import Link from "next/link"

import { PageHeader } from "@/components/site/page-header"
import { cn } from "@/lib/utils"

export type PolicySection = { id: string; title: string; content: ReactNode }

/** Readable body copy for policy text: paragraphs, lists, links and sub-headings. */
const prose =
  "flex flex-col gap-4 text-[15px] leading-[26px] text-black/80 [&_a]:font-semibold [&_a]:text-black [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-70 [&_h3]:pt-2 [&_h3]:font-inter [&_h3]:text-lg [&_h3]:leading-6 [&_h3]:font-medium [&_h3]:tracking-[-0.3px] [&_h3]:text-black [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-5 [&_strong]:font-semibold [&_strong]:text-black [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5"

export function PolicyLayout({
  title,
  description,
  crumb,
  updated,
  sections,
  aside,
}: {
  title: string
  description: ReactNode
  crumb: string
  updated: string
  sections: PolicySection[]
  /** Extra card under the table of contents (e.g. contact help). */
  aside?: ReactNode
}) {
  const toc = (
    <ol className="flex flex-col border-l border-black/15">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="-ml-px flex gap-3 border-l border-transparent py-2 pl-4 text-sm leading-[17px] tracking-[-0.3px] text-subtle transition-colors hover:border-black hover:text-black"
          >
            <span className="font-mono text-xs leading-[17px]">{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <PageHeader title={title} description={description} crumbs={[{ label: crumb }]} eyebrow={`Last updated ${updated}`} />
      <div className="px-5 pb-20 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[300px_minmax(0,1fr)] xl:gap-24">
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
          <details className="group border border-black/15 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              On this page
              <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 transition-transform group-open:rotate-180">
                <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </summary>
            <nav aria-label="On this page" className="px-4 pb-3">
              {toc}
            </nav>
          </details>
          <nav aria-label="Table of contents" className="hidden flex-col gap-4 lg:flex">
            <p className="font-mono text-xs leading-[14px] tracking-[-0.2px] text-subtle uppercase">On this page</p>
            {toc}
          </nav>
          <div className="hidden lg:block">{aside ?? <HelpCard />}</div>
        </aside>

        <div className="flex max-w-[760px] min-w-0 flex-col pt-10 lg:pt-0">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
              className={cn("scroll-mt-6 flex flex-col gap-5 border-black/15 py-10 first:pt-0", index > 0 && "border-t")}
            >
              <h2 id={`${section.id}-heading`} className="flex items-baseline gap-3 text-[24px] leading-[30px] font-semibold tracking-[-0.5px]">
                <span className="font-mono text-sm leading-[30px] font-normal text-subtle">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <div className={prose}>{section.content}</div>
            </section>
          ))}
          <div className="lg:hidden">{aside ?? <HelpCard />}</div>
        </div>
      </div>
    </>
  )
}

function HelpCard() {
  return (
    <div className="flex flex-col gap-3 bg-surface p-5">
      <p className="text-base leading-5 font-semibold tracking-[-0.3px]">Questions about this policy?</p>
      <p className="text-sm leading-5 text-subtle">Our customer care team is here Monday to Saturday.</p>
      <Link href="/contact" className="w-fit border-b border-black pb-1 text-sm leading-[17px] font-medium hover:opacity-70">
        CONTACT US
      </Link>
    </div>
  )
}

/** Black-header, zebra-striped table for policy pages. */
export function PolicyTable({ columns, rows, caption }: { columns: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm leading-5">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="bg-black text-white">
            {columns.map((column) => (
              <th key={column} scope="col" className="px-3 py-2.5 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-black/10 even:bg-surface">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-3 py-3 font-semibold text-black">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-3 py-3">
                    {cell}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Highlighted note inside policy copy. */
export function PolicyNote({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="flex flex-col gap-1 border-l-4 border-black bg-surface px-4 py-3 text-sm leading-6">
      {title ? <p className="font-semibold text-black">{title}</p> : null}
      <div>{children}</div>
    </div>
  )
}
