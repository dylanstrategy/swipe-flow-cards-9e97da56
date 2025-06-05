
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, Clock, AlertTriangle } from 'lucide-react';

const NotificationSetup = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'Emergency Alert',
      enabled: true,
      recipients: 'Management + Maintenance',
      method: 'SMS + Email',
      escalation: '15 minutes'
    },
    {
      id: 2,
      type: 'Work Order Overdue',
      enabled: true,
      recipients: 'Maintenance Team',
      method: 'Email',
      escalation: '2 hours'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Alert & Notification Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Emergency Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="emergency-alerts">Enable Emergency Alerts</Label>
            <Switch id="emergency-alerts" defaultChecked />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency-escalation">Escalation Time</Label>
              <Select defaultValue="15min">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5min">5 minutes</SelectItem>
                  <SelectItem value="15min">15 minutes</SelectItem>
                  <SelectItem value="30min">30 minutes</SelectItem>
                  <SelectItem value="1hr">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="emergency-method">Notification Method</Label>
              <Select defaultValue="sms-email">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="sms">SMS Only</SelectItem>
                  <SelectItem value="sms-email">SMS + Email</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Work Order Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="overdue-alerts">Overdue Work Order Alerts</Label>
              <Switch id="overdue-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="completion-alerts">Completion Notifications</Label>
              <Switch id="completion-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="assignment-alerts">Assignment Notifications</Label>
              <Switch id="assignment-alerts" defaultChecked />
            </div>
          </div>
          <div>
            <Label htmlFor="overdue-threshold">Mark Overdue After</Label>
            <Select defaultValue="24hr">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4hr">4 hours</SelectItem>
                <SelectItem value="8hr">8 hours</SelectItem>
                <SelectItem value="24hr">24 hours</SelectItem>
                <SelectItem value="48hr">48 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inventory Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
            <Switch id="low-stock-alerts" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="reorder-alerts">Automatic Reorder Alerts</Label>
            <Switch id="reorder-alerts" />
          </div>
          <div>
            <Label htmlFor="stock-threshold">Low Stock Threshold</Label>
            <Select defaultValue="20">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10%</SelectItem>
                <SelectItem value="20">20%</SelectItem>
                <SelectItem value="30">30%</SelectItem>
                <SelectItem value="50">50%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="manager-email">Manager Email</Label>
              <Input id="manager-email" type="email" placeholder="manager@property.com" />
            </div>
            <div>
              <Label htmlFor="manager-phone">Manager Phone</Label>
              <Input id="manager-phone" placeholder="(555) 123-4567" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency-contact">Emergency Contact</Label>
              <Input id="emergency-contact" placeholder="(555) 999-0000" />
            </div>
            <div>
              <Label htmlFor="maintenance-lead">Maintenance Lead</Label>
              <Input id="maintenance-lead" type="email" placeholder="maintenance@property.com" />
            </div>
          </div>
          <Button>Save Contact Information</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSetup;
