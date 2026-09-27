"use client"

import { useState, type FormEvent } from "react"
import { StarIcon } from "lucide-react"
import { toast } from "sonner"

import { Field, SubmitButton, TextArea, TextInput } from "@/components/site/form"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addUserReview, useCurrentUser } from "@/lib/account-store"
import { cn } from "@/lib/utils"

type Errors = Partial<Record<"rating" | "author" | "title" | "body", string>>

export function WriteReviewDialog({ productSlug, productName }: { productSlug: string; productName: string }) {
  const user = useCurrentUser()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [errors, setErrors] = useState<Errors>({})

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const author = String(data.get("author") ?? "").trim()
    const title = String(data.get("title") ?? "").trim()
    const body = String(data.get("body") ?? "").trim()
    const next: Errors = {}
    if (!rating) next.rating = "Choose a star rating"
    if (author.length < 2) next.author = "Enter your name"
    if (title.length < 3) next.title = "Give your review a short title"
    if (body.length < 20) next.body = "Tell other riders a bit more (at least 20 characters)"
    setErrors(next)
    if (Object.keys(next).length) return

    addUserReview(productSlug, {
      id: `user-${Date.now()}`,
      author,
      rating,
      title,
      body,
      daysAgo: 0,
      verified: false,
    })
    toast.success("Thanks! Your review has been posted.")
    setOpen(false)
    setRating(0)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="h-[42px] bg-black px-8 text-base leading-[19px] font-medium text-white hover:bg-black/85">
        Write A Review
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none p-6 font-sans sm:max-w-lg">
        <DialogTitle className="text-xl font-semibold">Write a review</DialogTitle>
        <DialogDescription className="text-sm text-subtle">{productName}</DialogDescription>
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <fieldset className="flex flex-col gap-1.5">
            <legend className="mb-1.5 text-sm font-semibold">Your rating *</legend>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  aria-pressed={rating === value}
                  onMouseEnter={() => setHover(value)}
                  onClick={() => setRating(value)}
                >
                  <StarIcon className={cn("size-7", (hover || rating) >= value ? "fill-black text-black" : "text-black/25")} />
                </button>
              ))}
            </div>
            {errors.rating ? <p role="alert" className="text-xs text-brand-dark">{errors.rating}</p> : null}
          </fieldset>
          <Field label="Name" htmlFor="review-author" error={errors.author} required>
            <TextInput id="review-author" name="author" defaultValue={user ? `${user.firstName} ${user.lastName.charAt(0)}.` : ""} invalid={Boolean(errors.author)} />
          </Field>
          <Field label="Title" htmlFor="review-title" error={errors.title} required>
            <TextInput id="review-title" name="title" placeholder="Sum it up in a few words" invalid={Boolean(errors.title)} />
          </Field>
          <Field label="Review" htmlFor="review-body" error={errors.body} required>
            <TextArea id="review-body" name="body" placeholder="How was the fit, quality and comfort?" invalid={Boolean(errors.body)} />
          </Field>
          <SubmitButton>Post review</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  )
}
