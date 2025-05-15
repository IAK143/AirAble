import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Trash2 } from 'lucide-react';
import { addKeyCode, removeKeyCode, getAllKeyCodes } from '@/config/keys';
import { useToast } from '@/hooks/use-toast';

const KeyCodeManager = () => {
  const [newCode, setNewCode] = useState('');
  const [keyCodes, setKeyCodes] = useState(getAllKeyCodes());
  const { toast } = useToast();

  const handleAddCode = () => {
    if (newCode.trim()) {
      addKeyCode(newCode.trim());
      setKeyCodes(getAllKeyCodes());
      setNewCode('');
      toast({
        title: "Key Code Added",
        description: "New key code has been added successfully.",
      });
    }
  };

  const handleRemoveCode = (code: string) => {
    removeKeyCode(code);
    setKeyCodes(getAllKeyCodes());
    toast({
      title: "Key Code Removed",
      description: "Key code has been removed successfully.",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Key Code Management</CardTitle>
        <CardDescription>
          Add or remove key codes for trial access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter new key code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddCode}>
            <Plus className="h-4 w-4 mr-2" />
            Add Code
          </Button>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Active Key Codes</h3>
          {keyCodes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No key codes available. Add one to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-2">
              {keyCodes.map((code) => (
                <div
                  key={code}
                  className="flex items-center justify-between p-2 bg-muted rounded-lg"
                >
                  <span className="font-mono">{code}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCode(code)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyCodeManager; 