import type { ReactNode } from "react"

import { AccordionClosedIcon, AccordionOpenIcon } from "@/components/icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

export type Faq = { id: string; q: string; a: ReactNode }

/** Question/answer accordion in the product-page accordion style. */
export function FaqList({ items, defaultOpen, className }: { items: Faq[]; defaultOpen?: string[]; className?: string }) {
  return (
    <Accordion multiple defaultValue={defaultOpen ?? []} className={cn("border-t border-black/15", className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-black/15 not-last:border-b">
          <AccordionTrigger className="items-center gap-4 rounded-none py-5 font-inter text-base leading-[22px] font-medium tracking-[-0.3px] hover:no-underline focus-visible:ring-black/20 [&>[data-slot=accordion-trigger-icon]]:hidden!">
            {item.q}
            <AccordionOpenIcon className="hidden size-7 shrink-0 group-aria-expanded/accordion-trigger:block" />
            <AccordionClosedIcon className="size-7 shrink-0 group-aria-expanded/accordion-trigger:hidden" />
          </AccordionTrigger>
          <AccordionContent className="max-w-[760px] pb-6 text-sm leading-6 text-subtle [&_a]:text-black">{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
