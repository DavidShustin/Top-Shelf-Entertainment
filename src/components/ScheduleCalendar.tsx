import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_booked: boolean;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
}

const ScheduleCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const { toast } = useToast();

  const fetchTimeSlots = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('schedule_slots')
      .select('*')
      .eq('date', dateStr)
      .order('start_time');
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch time slots', variant: 'destructive' });
      return;
    }
    
    setTimeSlots(data || []);
  };

  const addTimeSlot = async () => {
    if (!selectedDate || !startTime || !endTime) return;
    
    const { error } = await supabase
      .from('schedule_slots')
      .insert({
        date: selectedDate.toISOString().split('T')[0],
        start_time: startTime,
        end_time: endTime,
        is_available: true
      });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to add time slot', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Success', description: 'Time slot added successfully' });
    fetchTimeSlots(selectedDate);
    setStartTime('');
    setEndTime('');
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Slots for {selectedDate?.toDateString()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Add Time Slot</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Time Slot</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                  <Button onClick={addTimeSlot} className="w-full">
                    Add Slot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="space-y-2">
              {timeSlots.map((slot) => (
                <div key={slot.id} className={`p-3 rounded border ${
                  slot.is_booked ? 'bg-red-50 border-red-200' : 
                  slot.is_available ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {slot.start_time} - {slot.end_time}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      slot.is_booked ? 'bg-red-100 text-red-800' :
                      slot.is_available ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                    }`}>
                      {slot.is_booked ? 'Booked' : slot.is_available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  {slot.client_name && (
                    <div className="text-sm text-gray-600 mt-1">
                      Client: {slot.client_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleCalendar;