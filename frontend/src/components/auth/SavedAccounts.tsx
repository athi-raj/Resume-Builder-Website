
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';

interface SavedAccountsProps {
  accounts: Array<{email: string; timestamp: string}>;
  onSelectAccount: (email: string) => void;
  onRemoveAccount: (e: React.MouseEvent, email: string) => void;
}

const SavedAccounts = ({ accounts, onSelectAccount, onRemoveAccount }: SavedAccountsProps) => {
  if (accounts.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-sm mb-2 text-muted-foreground">Saved accounts:</p>
      <div className="space-y-2">
        {accounts.map((account) => (
          <div 
            key={account.email}
            onClick={() => onSelectAccount(account.email)}
            className="flex items-center justify-between p-2 rounded-md border hover:bg-accent/10 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{account.email}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => onRemoveAccount(e, account.email)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="my-6 border-t border-border/50"></div>
    </div>
  );
};

export default SavedAccounts;
