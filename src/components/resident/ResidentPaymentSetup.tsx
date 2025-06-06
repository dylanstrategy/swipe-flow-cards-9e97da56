
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, CreditCard, Building2, Wallet, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useSettings } from '@/hooks/useSettings';

interface ResidentPaymentSetupProps {
  onBack: () => void;
}

interface PaymentMethod {
  id: string;
  type: 'ach' | 'credit_card' | 'debit_card';
  name: string;
  last4: string;
  isDefault: boolean;
  bankName?: string;
  cardBrand?: string;
}

const ResidentPaymentSetup: React.FC<ResidentPaymentSetupProps> = ({ onBack }) => {
  const { toast } = useToast();
  const { settings: paymentData, saveSettings, loading } = useSettings('payment');
  
  // Default payment settings
  const defaultSettings = {
    autoPayEnabled: false,
    autoPayDate: 1,
    defaultPaymentMethodId: '',
    paymentMethods: [] as PaymentMethod[],
    paymentReminders: true,
    latePaymentNotifications: true
  };

  const [currentSettings, setCurrentSettings] = useState(defaultSettings);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState({
    type: 'ach' as 'ach' | 'credit_card' | 'debit_card',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    bankName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardName: '',
    billingZip: ''
  });

  // Update local state when settings load
  useEffect(() => {
    if (!loading) {
      setCurrentSettings({ ...defaultSettings, ...paymentData });
    }
  }, [paymentData, loading]);

  const handleToggleChange = async (key: keyof typeof currentSettings, value: boolean) => {
    console.log(`Toggling ${key} to ${value}`);
    const newData = { ...currentSettings, [key]: value };
    
    setCurrentSettings(newData);
    
    try {
      await saveSettings(newData);
      console.log(`Successfully saved ${key} setting:`, value);
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
      setCurrentSettings(currentSettings);
      toast({
        title: "Save Failed",
        description: `Failed to save ${key} setting. Please try again.`,
        duration: 3000,
      });
    }
  };

  const handleSelectChange = async (key: keyof typeof currentSettings, value: string | number) => {
    console.log(`Changing ${key} to ${value}`);
    const newData = { ...currentSettings, [key]: value };
    
    setCurrentSettings(newData);
    
    try {
      await saveSettings(newData);
      console.log(`Successfully saved ${key} setting:`, value);
    } catch (error) {
      console.error(`Error saving ${key} setting:`, error);
      setCurrentSettings(currentSettings);
      toast({
        title: "Save Failed",
        description: `Failed to save ${key} setting. Please try again.`,
        duration: 3000,
      });
    }
  };

  const handleAddPaymentMethod = async () => {
    if (newPaymentForm.type === 'ach') {
      if (!newPaymentForm.accountNumber || !newPaymentForm.routingNumber || !newPaymentForm.bankName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields for ACH setup.",
          duration: 3000,
        });
        return;
      }
    } else {
      if (!newPaymentForm.cardNumber || !newPaymentForm.expiryMonth || !newPaymentForm.expiryYear || !newPaymentForm.cvv) {
        toast({
          title: "Missing Information", 
          description: "Please fill in all required fields for card setup.",
          duration: 3000,
        });
        return;
      }
    }

    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: newPaymentForm.type,
      name: newPaymentForm.type === 'ach' ? 
        `${newPaymentForm.bankName} ${newPaymentForm.accountType}` : 
        `${newPaymentForm.cardName || 'Card'}`,
      last4: newPaymentForm.type === 'ach' ? 
        newPaymentForm.accountNumber.slice(-4) : 
        newPaymentForm.cardNumber.slice(-4),
      isDefault: currentSettings.paymentMethods.length === 0,
      bankName: newPaymentForm.type === 'ach' ? newPaymentForm.bankName : undefined,
      cardBrand: newPaymentForm.type !== 'ach' ? 'Visa' : undefined
    };

    const newData = {
      ...currentSettings,
      paymentMethods: [...currentSettings.paymentMethods, newPaymentMethod],
      defaultPaymentMethodId: newPaymentMethod.isDefault ? newPaymentMethod.id : currentSettings.defaultPaymentMethodId
    };

    try {
      await saveSettings(newData);
      setCurrentSettings(newData);
      setShowAddPayment(false);
      setNewPaymentForm({
        type: 'ach',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        bankName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardName: '',
        billingZip: ''
      });
      
      toast({
        title: "✅ Payment Method Added",
        description: "Your payment method has been added successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "❌ Add Failed",
        description: "Failed to add payment method. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleRemovePaymentMethod = async (methodId: string) => {
    const newData = {
      ...currentSettings,
      paymentMethods: currentSettings.paymentMethods.filter(pm => pm.id !== methodId),
      defaultPaymentMethodId: currentSettings.defaultPaymentMethodId === methodId ? '' : currentSettings.defaultPaymentMethodId
    };

    try {
      await saveSettings(newData);
      setCurrentSettings(newData);
      
      toast({
        title: "✅ Payment Method Removed",
        description: "Payment method has been removed successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: "❌ Remove Failed",
        description: "Failed to remove payment method. Please try again.",
        duration: 4000,
      });
    }
  };

  const handleSetDefault = async (methodId: string) => {
    const newData = {
      ...currentSettings,
      defaultPaymentMethodId: methodId,
      paymentMethods: currentSettings.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === methodId
      }))
    };

    try {
      await saveSettings(newData);
      setCurrentSettings(newData);
      
      toast({
        title: "✅ Default Payment Updated",
        description: "Default payment method has been updated.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast({
        title: "❌ Update Failed",
        description: "Failed to update default payment method.",
        duration: 3000,
      });
    }
  };

  const handleSave = async () => {
    try {
      await saveSettings(currentSettings);
      
      toast({
        title: "✅ Payment Settings Updated",
        description: "Your payment preferences have been saved successfully.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error saving payment settings:', error);
      toast({
        title: "❌ Save Failed",
        description: "Failed to save payment settings. Please try again.",
        duration: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-600">Loading payment settings...</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
            <p className="text-sm text-gray-600">Manage your payment options and auto-pay settings</p>
          </div>
        </div>

        {/* Auto-Pay Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Auto-Pay Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable Auto-Pay</div>
                <div className="text-sm text-gray-600">Automatically pay rent on the due date</div>
              </div>
              <Switch 
                checked={currentSettings.autoPayEnabled}
                onCheckedChange={(checked) => handleToggleChange('autoPayEnabled', checked)}
              />
            </div>
            
            {currentSettings.autoPayEnabled && (
              <>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Auto-Pay Date
                  </label>
                  <Select 
                    value={currentSettings.autoPayDate.toString()} 
                    onValueChange={(value) => handleSelectChange('autoPayDate', parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 28}, (_, i) => i + 1).map(day => (
                        <SelectItem key={day} value={day.toString()}>
                          {day === 1 ? '1st' : day === 2 ? '2nd' : day === 3 ? '3rd' : `${day}th`} of the month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Payment Methods
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddPayment(true)}
                disabled={showAddPayment}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Method
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSettings.paymentMethods.length === 0 && !showAddPayment && (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No payment methods added yet</p>
                <p className="text-sm">Add a payment method to enable auto-pay</p>
              </div>
            )}

            {currentSettings.paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {method.type === 'ach' ? (
                    <Building2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-green-600" />
                  )}
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {method.name}
                      {method.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.type === 'ach' ? 'Bank Account' : 'Card'} ending in {method.last4}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Set Default
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemovePaymentMethod(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {showAddPayment && (
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg">Add Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={newPaymentForm.type} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, type: value as any})}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="ach">ACH/Bank</TabsTrigger>
                      <TabsTrigger value="credit_card">Credit Card</TabsTrigger>
                      <TabsTrigger value="debit_card">Debit Card</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="ach" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={newPaymentForm.bankName}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, bankName: e.target.value})}
                          placeholder="e.g., Chase, Bank of America"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input
                            id="routingNumber"
                            value={newPaymentForm.routingNumber}
                            onChange={(e) => setNewPaymentForm({...newPaymentForm, routingNumber: e.target.value})}
                            placeholder="9 digits"
                            maxLength={9}
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountType">Account Type</Label>
                          <Select value={newPaymentForm.accountType} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, accountType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={newPaymentForm.accountNumber}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, accountNumber: e.target.value})}
                          placeholder="Account number"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="credit_card" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={newPaymentForm.cardName}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, cardName: e.target.value})}
                          placeholder="Full name as on card"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentForm.cardNumber}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Select value={newPaymentForm.expiryMonth} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, expiryMonth: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expiryYear">Year</Label>
                          <Select value={newPaymentForm.expiryYear} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, expiryYear: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentForm.cvv}
                            onChange={(e) => setNewPaymentForm({...newPaymentForm, cvv: e.target.value})}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="billingZip">Billing ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={newPaymentForm.billingZip}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, billingZip: e.target.value})}
                          placeholder="12345"
                          maxLength={10}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="debit_card" className="space-y-4 mt-4">
                      {/* Same fields as credit card */}
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={newPaymentForm.cardName}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, cardName: e.target.value})}
                          placeholder="Full name as on card"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={newPaymentForm.cardNumber}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Month</Label>
                          <Select value={newPaymentForm.expiryMonth} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, expiryMonth: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="expiryYear">Year</Label>
                          <Select value={newPaymentForm.expiryYear} onValueChange={(value) => setNewPaymentForm({...newPaymentForm, expiryYear: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={newPaymentForm.cvv}
                            onChange={(e) => setNewPaymentForm({...newPaymentForm, cvv: e.target.value})}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="billingZip">Billing ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={newPaymentForm.billingZip}
                          onChange={(e) => setNewPaymentForm({...newPaymentForm, billingZip: e.target.value})}
                          placeholder="12345"
                          maxLength={10}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setShowAddPayment(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddPaymentMethod}>
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Payment Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Payment Reminders</div>
                  <div className="text-sm text-gray-600">Get reminders before rent is due</div>
                </div>
                <Switch 
                  checked={currentSettings.paymentReminders}
                  onCheckedChange={(checked) => handleToggleChange('paymentReminders', checked)}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Late Payment Notifications</div>
                  <div className="text-sm text-gray-600">Receive alerts for overdue payments</div>
                </div>
                <Switch 
                  checked={currentSettings.latePaymentNotifications}
                  onCheckedChange={(checked) => handleToggleChange('latePaymentNotifications', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ResidentPaymentSetup;
