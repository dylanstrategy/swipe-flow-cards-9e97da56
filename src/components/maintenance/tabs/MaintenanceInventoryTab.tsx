
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Edit,
  ShoppingCart,
  History,
  AlertTriangle
} from 'lucide-react';

const MaintenanceInventoryTab = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'kitchen', name: 'Kitchen', icon: '🍽️', budget: 5000, spent: 3200, items: 24 },
    { id: 'flooring', name: 'Flooring', icon: '🏠', budget: 8000, spent: 6500, items: 18 },
    { id: 'doors', name: 'Doors', icon: '🚪', budget: 3000, spent: 1800, items: 12 },
    { id: 'plumbing', name: 'Plumbing', icon: '🔧', budget: 6000, spent: 4200, items: 35 },
    { id: 'appliances', name: 'Appliances', icon: '📱', budget: 12000, spent: 9800, items: 8 },
    { id: 'electrical', name: 'Electrical', icon: '⚡', budget: 4000, spent: 2100, items: 28 },
    { id: 'hvac', name: 'HVAC', icon: '🌡️', budget: 10000, spent: 7500, items: 15 }
  ];

  const inventoryItems = [
    { 
      id: 1, 
      name: 'Cabinet Hinges', 
      category: 'kitchen', 
      count: 45, 
      cost: 12.50, 
      reorderLevel: 20,
      lastPurchase: '2024-05-15',
      supplier: 'Hardware Plus'
    },
    { 
      id: 2, 
      name: 'Vinyl Plank Flooring', 
      category: 'flooring', 
      count: 120, 
      cost: 28.99, 
      reorderLevel: 50,
      lastPurchase: '2024-05-20',
      supplier: 'Floor Depot'
    },
    { 
      id: 3, 
      name: 'Interior Door Handle', 
      category: 'doors', 
      count: 8, 
      cost: 35.00, 
      reorderLevel: 10,
      lastPurchase: '2024-05-10',
      supplier: 'Door Solutions'
    },
    { 
      id: 4, 
      name: 'PVC Pipe 1/2"', 
      category: 'plumbing', 
      count: 25, 
      cost: 8.75, 
      reorderLevel: 15,
      lastPurchase: '2024-05-25',
      supplier: 'Plumbing Supply Co'
    },
    { 
      id: 5, 
      name: 'Refrigerator Filter', 
      category: 'appliances', 
      count: 5, 
      cost: 42.00, 
      reorderLevel: 8,
      lastPurchase: '2024-05-18',
      supplier: 'Appliance Parts'
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? inventoryItems 
    : inventoryItems.filter(item => item.category === activeCategory);

  const lowStockItems = inventoryItems.filter(item => item.count <= item.reorderLevel);

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUsedPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="px-4 py-6 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Package className="w-6 h-6 text-orange-600" />
          Maintenance Inventory
        </h1>
        <p className="text-gray-600">Manage inventory, track budgets, and monitor stock levels</p>
      </div>

      {/* Budget Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Budget Overview</span>
            <span className="text-sm font-normal">${totalSpent.toLocaleString()} / ${totalBudget.toLocaleString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={budgetUsedPercentage} className="mb-4" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${(totalBudget - totalSpent).toLocaleString()}</div>
              <div className="text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
              <div className="text-gray-600">Low Stock</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inventory Items</span>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>${item.cost}</TableCell>
                      <TableCell>
                        {item.count <= item.reorderLevel ? (
                          <Badge variant="destructive">Low Stock</Badge>
                        ) : (
                          <Badge variant="default">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ShoppingCart className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const budgetUsed = (category.spent / category.budget) * 100;
              const remaining = category.budget - category.spent;
              
              return (
                <Card key={category.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <Badge>{category.items} items</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Budget Used</span>
                          <span>${category.spent.toLocaleString()} / ${category.budget.toLocaleString()}</span>
                        </div>
                        <Progress value={budgetUsed} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-lg font-bold text-green-600">${remaining.toLocaleString()}</div>
                          <div className="text-gray-600">Remaining</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">{budgetUsed.toFixed(0)}%</div>
                          <div className="text-gray-600">Used</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Current: {item.count} | Reorder Level: {item.reorderLevel}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No low stock alerts at this time
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.lastPurchase}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>50</TableCell>
                      <TableCell>${(item.cost * 50).toFixed(2)}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>
                        <Badge variant="default">Delivered</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaintenanceInventoryTab;
