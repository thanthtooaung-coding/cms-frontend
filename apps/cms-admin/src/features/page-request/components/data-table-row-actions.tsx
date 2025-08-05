import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { Row } from '@tanstack/react-table';
import {
  IconTrash,
  IconCheck,
  IconX,
  IconPencil,
} from '@tabler/icons-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@cms/ui/components/dropdown-menu';
import { PageRequestSchema } from '../data/schema';
import { usePageRequest } from '../context/page-request-context';
import { Button } from '@cms/ui/components/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePageRequestStatus } from '@cms/data';
import { ConfirmDialog } from '@cms/ui/components/comfirm-dialog';
import { useState } from 'react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const pageRequest = PageRequestSchema.parse(row.original);

  const { setOpen, setCurrentRow } = usePageRequest();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'Approved' | 'Rejected' | null>(null);

  const mutation = useMutation({
    mutationFn: updatePageRequestStatus,
    onSuccess: () => {
      console.log('Page request status updated successfully');
      
      queryClient.invalidateQueries({ queryKey: ['page-requests'] });
    },
    onError: (error) => {
      console.log('Error updating page request status:', error);
      
      console.error('Update error:', error);
    },
  });

  const handleConfirmAction = () => {
    if (!actionToConfirm) return;

    mutation.mutate({
      requestId: parseInt(pageRequest.id, 10),
      status: actionToConfirm,
    });
    setDialogOpen(false);
  };

  const handleApprove = () => {
    setActionToConfirm('Approved');
    setDialogOpen(true);
  };

  const handleReject = () => {
    setActionToConfirm('Rejected');
    setDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleApprove}>
            Approve
            <DropdownMenuShortcut className="cursor-pointer">
              <IconCheck size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleReject}>
            Reject
            <DropdownMenuShortcut className="cursor-pointer">
              <IconX size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(pageRequest);
              setOpen('edit');
            }}
          >
            Edit
            <DropdownMenuShortcut className="cursor-pointer">
              <IconPencil size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            variant="destructive"
            onClick={() => {
              setCurrentRow(pageRequest);
              setOpen('delete');
            }}
          >
            Delete
            <DropdownMenuShortcut className="cursor-pointer">
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              // Reset action when dialog is closed
              setActionToConfirm(null);
            }
            setDialogOpen(open);
          }}
          title={`Confirm ${actionToConfirm}`}
          desc={`Are you sure you want to ${actionToConfirm?.toLowerCase()} this page request for "${pageRequest.pageName}"?`}
          handleConfirm={handleConfirmAction}
          destructive={actionToConfirm === 'Rejected'}
        />
    </>
  );
}
