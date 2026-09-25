import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle, 
  HelpCircle,
  FileCheck,
  RotateCw
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'sm' }) => {
  const norm = status.toLowerCase();

  let textClass = 'text-slate-600 bg-slate-100 border-slate-200';
  let Icon = HelpCircle;

  if (norm === 'active' || norm === 'open' || norm === 'available' || norm === 'accepted' || norm === 'approved') {
    textClass = 'text-emerald-700 bg-emerald-50 border-emerald-200/80';
    Icon = CheckCircle2;
  } else if (norm === 'pending' || norm === 'awaiting start' || norm === 'draft' || norm === 'under review') {
    textClass = 'text-amber-700 bg-amber-50 border-amber-200/80';
    Icon = Clock;
  } else if (norm === 'in progress' || norm === 'shortlisted' || norm === 'submitted' || norm === 'busy') {
    textClass = 'text-indigo-700 bg-indigo-50 border-indigo-200/80';
    Icon = norm === 'submitted' ? FileCheck : RotateCw;
  } else if (norm === 'completed' || norm === 'resolved') {
    textClass = 'text-blue-700 bg-blue-50 border-blue-200/80';
    Icon = CheckCircle2;
  } else if (norm === 'rejected' || norm === 'cancelled' || norm === 'suspended' || norm === 'not available' || norm === 'closed') {
    textClass = 'text-rose-700 bg-rose-50 border-rose-200/80';
    Icon = XCircle;
  } else if (norm === 'revision requested') {
    textClass = 'text-orange-700 bg-orange-50 border-orange-200/80';
    Icon = AlertCircle;
  }

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${textClass} ${paddingClass} ${className}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};
