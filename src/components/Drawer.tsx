import * as React from "react"
import { twJoin, twMerge } from "tailwind-merge"
import * as ReactAria from "react-aria-components"
import { UiModal, UiModalOverlay, UiModalOwnProps } from "@/components/ui/Modal"
import { UiDialog } from "@/components/Dialog"

export interface DrawerProps
  extends Omit<ReactAria.ModalOverlayProps, "children">,
    UiModalOwnProps,
    Pick<ReactAria.DialogProps, "children"> {
  colorScheme?: "light" | "dark"
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  colorScheme = "dark",
  animateFrom,
  className,
  children,
  ...rest
}) => {
  const side = animateFrom === "left" ? "left" : "right"

  return (
    <UiModalOverlay
      {...rest}
      // Side drawers stretch full height and pin to an edge — override the
      // centered-modal defaults (items-center / justify-center / padding).
      className={twJoin(
        "p-0 items-stretch",
        side === "left" ? "justify-start" : "justify-end"
      )}
    >
      <UiModal
        animateFrom={animateFrom}
        // `static` cancels the absolute positioning added for left/right so the
        // panel is a normal flex child that fills the overlay's full height.
        className={twMerge(
          "static flex flex-col h-full max-h-full w-full max-w-75 overflow-y-auto rounded-none",
          colorScheme === "light"
            ? twJoin(
                "bg-cream text-black",
                side === "left" ? "border-r border-black" : "border-l border-black"
              )
            : "bg-black text-white",
          className
        )}
      >
        <UiDialog className="flex flex-col flex-1">{children}</UiDialog>
      </UiModal>
    </UiModalOverlay>
  )
}
