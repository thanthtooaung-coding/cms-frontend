import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@cms/ui/components/button';
import { Input } from '@cms/ui/components/input';
import { Label } from '@cms/ui/components/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@cms/ui/components/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@cms/ui/components/select';
import { ecsApiFetch } from '../../../utils/apiClient';

const promotionSchema = z.object({
  name: z.string().min(1, 'Promotion name is required'),
  code: z.string().min(1, 'Promotion code is required'),
  promotionType: z.string().min(1, 'Promotion type is required'),
  discountValue: z.string().min(1, 'Discount value is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Discount value must be a positive number'),
  minPurchaseAmount: z.string().optional(),
  maxDiscountAmount: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PromotionFormData = z.infer<typeof promotionSchema>;

interface Promotion {
  id: number;
  name: string;
  code: string;
  promotionType: string;
  discountValue: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate?: string;
  usageLimit?: number;
  isActive?: boolean;
  active?: boolean; // Handle both naming conventions
}

interface PromotionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion?: Promotion | null;
  tenantId: number | null;
  onSuccess: () => void;
}

const promotionTypes = [
  { value: 'PERCENTAGE_DISCOUNT', label: 'Percentage Discount' },
  { value: 'FIXED_DISCOUNT', label: 'Fixed Discount' },
  { value: 'FREE_SHIPPING', label: 'Free Shipping' },
  { value: 'BUY_ONE_GET_ONE', label: 'Buy One Get One' },
];

export function PromotionForm({ open, onOpenChange, promotion, tenantId, onSuccess }: PromotionFormProps) {
  const [loading, setLoading] = useState(false);
  const isEdit = !!promotion;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      name: '',
      code: '',
      promotionType: '',
      discountValue: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (promotion) {
        reset({
          name: promotion.name,
          code: promotion.code,
          promotionType: promotion.promotionType,
          discountValue: promotion.discountValue.toString(),
          minPurchaseAmount: promotion.minPurchaseAmount?.toString() || '',
          maxDiscountAmount: promotion.maxDiscountAmount?.toString() || '',
          startDate: promotion.startDate ? promotion.startDate.split('T')[0] : '',
          endDate: promotion.endDate ? promotion.endDate.split('T')[0] : '',
          usageLimit: promotion.usageLimit?.toString() || '',
          isActive: promotion.isActive ?? promotion.active ?? true,
        });
      } else {
        reset({
          name: '',
          code: '',
          promotionType: '',
          discountValue: '',
          minPurchaseAmount: '',
          maxDiscountAmount: '',
          startDate: '',
          endDate: '',
          usageLimit: '',
          isActive: true,
        });
      }
    }
  }, [open, promotion, reset]);

  const onSubmit = async (data: PromotionFormData) => {
    if (!tenantId) return;
    setLoading(true);
    try {
      const payload: any = {
        name: data.name,
        code: data.code.toUpperCase(),
        promotionType: data.promotionType,
        discountValue: parseFloat(data.discountValue),
        isActive: data.isActive,
      };

      if (data.minPurchaseAmount) {
        payload.minPurchaseAmount = parseFloat(data.minPurchaseAmount);
      }
      if (data.maxDiscountAmount) {
        payload.maxDiscountAmount = parseFloat(data.maxDiscountAmount);
      }
      if (data.startDate) {
        payload.startDate = new Date(data.startDate).toISOString();
      }
      if (data.endDate) {
        payload.endDate = new Date(data.endDate).toISOString();
      }
      if (data.usageLimit) {
        payload.usageLimit = parseInt(data.usageLimit);
      }

      const url = isEdit
        ? `/promotions/${promotion.id}?tenantId=${tenantId}`
        : `/promotions?tenantId=${tenantId}`;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await ecsApiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        onOpenChange(false);
        reset();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save promotion');
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('An error occurred while saving the promotion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Promotion' : 'Add New Promotion'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update promotion details' : 'Create a new promotion to attract customers'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Promotion Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Summer Sale"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="code">Promotion Code *</Label>
              <Input
                id="code"
                {...register('code')}
                placeholder="SUMMER2025"
                className="uppercase"
              />
              {errors.code && (
                <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="promotionType">Promotion Type *</Label>
              <Select
                value={watch('promotionType') || ''}
                onValueChange={(value) => setValue('promotionType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select promotion type" />
                </SelectTrigger>
                <SelectContent>
                  {promotionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.promotionType && (
                <p className="text-sm text-red-500 mt-1">{errors.promotionType.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="discountValue">Discount Value *</Label>
              <Input
                id="discountValue"
                type="number"
                step="0.01"
                {...register('discountValue')}
                placeholder="10.00"
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500 mt-1">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minPurchaseAmount">Min Purchase Amount</Label>
              <Input
                id="minPurchaseAmount"
                type="number"
                step="0.01"
                {...register('minPurchaseAmount')}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="maxDiscountAmount">Max Discount Amount</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                step="0.01"
                {...register('maxDiscountAmount')}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="usageLimit">Usage Limit</Label>
            <Input
              id="usageLimit"
              type="number"
              {...register('usageLimit')}
              placeholder="Unlimited"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={watch('isActive')}
              onChange={(e) => setValue('isActive', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Promotion is active
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Promotion' : 'Create Promotion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

