
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, AlertTriangle } from 'lucide-react';

const InventorySetup = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Air Filter 16x20',
      category: 'HVAC',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      cost: '$12.99',
      supplier: 'HVAC Supply Co'
    },
    {
      id: 2,
      name: 'Toilet Flapper',
      category: 'Plumbing',
      currentStock: 2,
      minStock: 5,
      maxStock: 20,
      cost: '$8.50',
      supplier: 'Plumbing Parts Plus'
    }
  ]);

  const categories = ['HVAC', 'Plumbing', 'Electrical', 'Appliances', 'Hardware', 'Cleaning', 'Safety'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inventory Management</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Inventory Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-name">Item Name</Label>
              <Input id="item-name" placeholder="Air Filter 16x20" />
            </div>
            <div>
              <Label htmlFor="item-category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="current-stock">Current Stock</Label>
              <Input id="current-stock" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="min-stock">Minimum Stock</Label>
              <Input id="min-stock" type="number" placeholder="5" />
            </div>
            <div>
              <Label htmlFor="max-stock">Maximum Stock</Label>
              <Input id="max-stock" type="number" placeholder="50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="item-cost">Unit Cost</Label>
              <Input id="item-cost" placeholder="$12.99" />
            </div>
            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Input id="supplier" placeholder="Supplier name" />
            </div>
          </div>
          <Button>Add Item</Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {items.map(item => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant="outline">{item.category}</Badge>
                  {item.currentStock <= item.minStock && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Low Stock
                    </Badge>
                  )}
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                <div>Stock: {item.currentStock}</div>
                <div>Min: {item.minStock}</div>
                <div>Cost: {item.cost}</div>
                <div>Supplier: {item.supplier}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventorySetup;
