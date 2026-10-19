'use client';

import { Button } from '@/components/ui/button';
import { Power } from "lucide-react";
import type { ComponentType } from 'react';

interface DialogParts {
  Dialog: ComponentType<any>;
  Content: ComponentType<any>;
  Header: ComponentType<any>;
  Title: ComponentType<any>;
  Description: ComponentType<any>;
  Footer: ComponentType<any>;
  Cancel: ComponentType<any> | null;
  Action: ComponentType<any>;
}

interface StatusToggleActionProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  active: boolean;
  labelA: string;
  labelB: string;
  titleA: string;
  titleB: string;
  descriptionA: string;
  descriptionB: string;
  variantA: string;
  variantB: string;
  activeClass: string;
  cancelLabel?: string;
  confirmationLabel?: string;
  dialog: DialogParts;
}

export default function StatusToggleAction({
  isOpen,
  onOpenChange,
  onConfirm,
  isSubmitting,
  active,
  labelA,
  labelB,
  titleA,
  titleB,
  descriptionA,
  descriptionB,
  variantA,
  variantB,
  activeClass,
  cancelLabel = 'Cancelar',
  confirmationLabel = 'Confirmar',
  dialog,
}: StatusToggleActionProps) {
  const label = active ? labelA : labelB;
  const variant = active ? variantA : variantB;
  const title = active ? titleA : titleB;
  const description = active ? descriptionA : descriptionB;
  const tipo = active ? variantA : variantB;

  const Comp = dialog.Dialog;
  const Content = dialog.Content;
  const Header = dialog.Header;
  const Title = dialog.Title;
  const Description = dialog.Description;
  const Footer = dialog.Footer;
  const Cancel = dialog.Cancel;
  const Action = dialog.Action;

  return (
    <>
      <Button
        variant={tipo as any}
        onClick={() => onOpenChange(true)}
        className={`w-full ${!active ? activeClass : ''}`}
        disabled={isSubmitting}
      >
        <Power className="mr-2 h-5 w-5" />
        {label}
      </Button>

      <Comp open={isOpen} onOpenChange={onOpenChange}>
        <Content className="max-w-[95vw] sm:max-w-[425px] w-full">
          <Header>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Header>
          <Footer>
            {Cancel ? (
              <Cancel asChild>
                <Button variant="outline" disabled={isSubmitting}>
                  {cancelLabel}
                </Button>
              </Cancel>
            ) : (
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
            )}
            <Action
              variant={tipo as any}
              className={!active ? activeClass : ''}
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processando...' : confirmationLabel}
            </Action>
          </Footer>
        </Content>
      </Comp>
    </>
  );
}
