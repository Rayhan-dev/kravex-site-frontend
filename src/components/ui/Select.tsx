"use client"

import * as ReactAria from "react-aria-components"
import { twMerge } from "tailwind-merge"
import { Icon, IconNames, IconProps } from "@/components/Icon"

type UiSelectButtonOwnProps = {
  variant?: "outline" | "ghost"
}

export const UiSelectButton: React.FC<
  ReactAria.ButtonProps & UiSelectButtonOwnProps
> = ({ variant = "outline", className, ...props }) => (
  <ReactAria.Button
    {...props}
    className={twMerge(
      "w-full gap-1 md:gap-2 flex items-center focus:border-grayscale-500 max-md:text-xs justify-between h-8 md:h-10 px-3 md:pl-4 md:pr-3 focus-visible:outline-none transition-colors",
      variant === "outline" &&
        "border border-black/30 rounded-none hover:border-black focus:border-black",
      className as string
    )}
  />
)

export const UiSelectIcon: React.FC<
  Omit<IconProps, "name"> & { name?: IconNames }
> = ({ name = "chevron-down", className, ...props }) => (
  <Icon
    {...props}
    name={name}
    aria-hidden="true"
    className={twMerge("h-4 w-4 md:w-6 md:h-6", className)}
  />
)

export const UiSelectValue = <T extends object>({
  className,
  ...props
}: ReactAria.SelectValueProps<T>) => (
  <ReactAria.SelectValue
    {...props}
    className={twMerge("truncate", className as string)}
  />
)

export const UiSelectListBox = <T extends object>({
  className,
  ...props
}: ReactAria.ListBoxProps<T>) => (
  <ReactAria.ListBox
    {...props}
    className={twMerge(
      "border border-black bg-cream rounded-none focus-visible:outline-none max-h-50 overflow-scroll",
      className as string
    )}
  />
)

export const UiSelectListBoxItem: React.FC<ReactAria.ListBoxItemProps> = ({
  className,
  ...props
}) => (
  <ReactAria.ListBoxItem
    {...props}
    className={twMerge(
      "cursor-pointer p-4 focus-visible:outline-none data-[selected]:font-semibold hover:bg-black hover:text-cream transition-colors",
      className as string
    )}
  />
)

export const UiSelectDialog: React.FC<ReactAria.DialogProps> = ({
  className,
  ...props
}) => (
  <ReactAria.Dialog
    {...props}
    className={twMerge(
      "border border-black bg-cream rounded-none focus-visible:outline-none",
      className
    )}
  />
)
