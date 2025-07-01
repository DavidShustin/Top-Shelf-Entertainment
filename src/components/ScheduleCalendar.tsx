import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

/** Fetch one‐off availability slots for a date range */
async function fetchOneOffSlots(
  userId: string,
  dateFrom: string,
  dateTo: string
) {
  const { data, error } = await supabase
    .from('availabilities')
    .select('id, start_time, end_time')
    .eq('user_id', userId)
    .gte('start_time', dateFrom)
    .lte('end_time', dateTo)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return data;
}

/** Fetch recurring weekly slots */
async function fetchRecurringSlots(userId: string) {
  const { data, error } = await supabase
    .from('recurring_availabilities')
    .select('id, weekday, start_time, end_time')
    .eq('user_id', userId)
    .order('weekday', { ascending: true });
  if (error) throw error;
  return data;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  is_recurring?: boolean;
}

export default function ScheduleCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const { toast } = useToast();

  /** Insert a new one‐off slot into availabilities */
  const addTimeSlot = async () => {
    if (!selectedDate || !startTime || !endTime) return;
    try {
      const userRes = await supabase.auth.getUser();
      const userId = userRes.data.user?.id;
      if (!userId) throw new Error('Not signed in');
      await supabase
        .from('availabilities')
        .insert({
          user_id: userId,
          start_time: `${selectedDate.toISOString().split('T')[0]}T${startTime}:00Z`,
          end_time: `${selectedDate.toISOString().split('T')[0]}T${endTime}:00Z`
        });
      toast({ title: 'Success', description: 'Time slot added successfully' });
      loadSlots();
      setStartTime('');
      setEndTime('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add time slot', variant: 'destructive' });
    }
  };

  /** Update an existing one‐off slot’s times */
  const updateTimeSlot = async (slotId: string, newStart: string, newEnd: string) => {
    try {
      await supabase
        .from('availabilities')
        .update({ start_time: newStart, end_time: newEnd })
        .eq('id', slotId);
      toast({ title: 'Success', description: 'Time slot updated' });
      loadSlots();
    } catch {
      toast({ title: 'Error', description: 'Couldn’t update slot', variant: 'destructive' });
    }
  };

  /** Load both one‐off and recurring slots for the selected date */
  const loadSlots = useCallback(async () => {
    if (!selectedDate) return;
    const userRes = await supabase.auth.getUser();
    const user = userRes.data.user;
    const userErr = userRes.error;
    if (userErr || !user) {
      console.error('Not signed in', userErr);
      return;
    }
    const userId = user.id;

    // One‐off for the selected date
    const baseDate = selectedDate.toISOString().split('T')[0];
    const from = `${baseDate}T00:00:00Z`;
    const to = `${baseDate}T23:59:59Z`;
    const oneOff = (await fetchOneOffSlots(userId, from, to)) || [];

    // Recurring for the weekday of selectedDate
    const allRecurring = (await fetchRecurringSlots(userId)) || [];
    const weekday = selectedDate.getDay();
    const recurring = allRecurring
      .filter(r => r.weekday === weekday)
      .map(r => ({ ...r, is_recurring: true }));

    setTimeSlots([
      ...oneOff.map(slot => ({ ...slot, is_recurring: false })),
      ...recurring
    ]);
  }, [selectedDate]);

  useEffect(() => {
    loadSlots().catch(err => console.error('Error loading availability', err));
  }, [loadSlots]);

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
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </div>
                  <Button onClick={addTimeSlot} className="w-full">
                    Add Slot
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="space-y-2">
              {timeSlots.map(slot => (
                <Dialog key={slot.id}>
                  <DialogTrigger asChild>
                    <div className={`p-3 rounded border ${
                      slot.is_recurring ? 'bg-blue-50 border-blue-200' :
                      'bg-green-50 border-green-200'
                    } flex justify-between items-center cursor-pointer`}> 
                      <span className="font-medium">
                        {slot.start_time.split('T')[1].replace('Z', '')} - {slot.end_time.split('T')[1].replace('Z', '')}
                      </span>
                      <button className="text-sm text-blue-600">Edit</button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Slot</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        defaultValue={slot.start_time.split('T')[1].replace('Z','')}
                        onChange={e => setEditStart(e.target.value)}
                      />
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        defaultValue={slot.end_time.split('T')[1].replace('Z','')}
                        onChange={e => setEditEnd(e.target.value)}
                      />
                      <Button onClick={() => {
                        const baseDate = slot.start_time.split('T')[0];
                        const newStart = `${baseDate}T${editStart}:00Z`;
                        const newEnd = `${baseDate}T${editEnd}:00Z`;
                        updateTimeSlot(slot.id, newStart, newEnd);
                      }} className="w-full">
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
