'use client';

import { Power } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface StatusCopy {
  button: string;
  title: string;
  description: string;
}

export interface StatusToggleCopy {
  deactivate: StatusCopy;
  activate: StatusCopy;
}

const STATUS_STYLE: Record<keyof StatusToggleCopy, { variant: ButtonProps["variant"]; className: string }> = {
  deactivate: { variant: "danger", className: "" },
  activate: {
    variant: "primary",
    className: "bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700",
  },
};

interface StatusToggleActionProps {
  active: boolean;
  copy: StatusToggleCopy;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function StatusToggleAction({
  active,
  copy,
  isOpen,
  onOpenChange,
  onConfirm,
  isSubmitting,
}: StatusToggleActionProps) {
  const action = active ? "deactivate" : "activate";
  const text = copy[action];
  const style = STATUS_STYLE[action];

  return (
    <>
      <Button
        variant={style.variant}
        className={`w-full ${style.className}`}
        onClick={() => onOpenChange(true)}
        disabled={isSubmitting}
      >
        <Power className="mr-2 h-5 w-5" />
        {text.button}
      </Button>

      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{text.title}</AlertDialogTitle>
            <AlertDialogDescription>{text.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Cancelar
              </Button>
            </AlertDialogCancel>
            <Button
              variant={style.variant}
              className={style.className}
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Confirmar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
