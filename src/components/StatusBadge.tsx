import { PaymentStatus } from '../types';
import { cn } from '../lib/utils';

export default function StatusBadge({ status }: { status: PaymentStatus }) {
  const styles = {
    paid: 'bg-[#33D69F]/10 text-[#33D69F]',
    pending: 'bg-[#FF8F00]/10 text-[#FF8F00]',
    draft: 'bg-[#373B53]/10 text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]',
  };

  const dotStyles = {
    paid: 'bg-[#33D69F]',
    pending: 'bg-[#FF8F00]',
    draft: 'bg-[#373B53] dark:bg-[#DFE3FA]',
  };

  return (
    <div className={cn(
      "flex items-center justify-center gap-2 w-[104px] h-10 rounded-md font-bold capitalize text-sm",
      styles[status]
    )}>
      <span className={cn("w-2 h-2 rounded-full", dotStyles[status])} />
      {status}
    </div>
  );
}
