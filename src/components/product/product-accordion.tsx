import { AccordionClosedIcon, AccordionOpenIcon } from "@/components/icons"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type Section = { value: string; title: string; paragraphs: string[] }

export function ProductAccordion({ sections }: { sections: Section[] }) {
  return (
    <Accordion multiple defaultValue={[sections[0].value]} className="gap-8">
      {sections.map((section) => (
        <AccordionItem key={section.value} value={section.value} className="border-b border-inactive not-last:border-b">
          <AccordionTrigger className="items-center rounded-none py-0 pb-3 font-inter text-base leading-5 font-medium tracking-[-0.3px] hover:no-underline [&>[data-slot=accordion-trigger-icon]]:hidden!">
            {section.title}
            <AccordionOpenIcon className="hidden size-7 group-aria-expanded/accordion-trigger:block" />
            <AccordionClosedIcon className="size-7 group-aria-expanded/accordion-trigger:hidden" />
          </AccordionTrigger>
          <AccordionContent className="pb-3 text-xs leading-[18px] tracking-[-0.1px]">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-0!">
                {paragraph}
              </p>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
