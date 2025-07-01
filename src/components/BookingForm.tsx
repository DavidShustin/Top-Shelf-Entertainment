import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  is_booked: boolean;
}

const BookingForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const { toast } = useToast();

  // Fetch all available dates on component mount
  const fetchAvailableDates = async () => {
    const { data, error } = await supabase
      .from('schedule_slots')
      .select('date')
      .eq('is_available', true)
      .eq('is_booked', false)
      .gte('date', new Date().toISOString().split('T')[0]);
    
    if (error) {
      console.error('Error fetching available dates:', error);
      return;
    }
    
    const uniqueDates = [...new Set(data?.map(slot => slot.date) || [])];
    const dateObjects = uniqueDates.map(dateStr => new Date(dateStr + 'T00:00:00'));
    setAvailableDates(dateObjects);
  };

  const fetchAvailableSlots = async (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('schedule_slots')
      .select('*')
      .eq('date', dateStr)
      .eq('is_available', true)
      .eq('is_booked', false)
      .order('start_time');
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to fetch available slots', variant: 'destructive' });
      return;
    }
    
    setAvailableSlots(data || []);
  };

  const bookSlot = async () => {
    if (!selectedSlot || !clientName || !clientEmail) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    
    const { error } = await supabase
      .from('schedule_slots')
      .update({
        is_booked: true,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone,
        notes: notes
      })
      .eq('id', selectedSlot);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to book appointment', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Success', description: 'Appointment booked successfully!' });
    
    // Reset form and refresh available dates
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    setSelectedSlot('');
    setSelectedDate(undefined);
    fetchAvailableDates();
  };

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
      setSelectedSlot('');
    }
  }, [selectedDate]);

  // Function to disable dates that don't have available slots
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
    
    return !availableDates.some(availableDate => {
      const compareDate = new Date(availableDate);
      compareDate.setHours(0, 0, 0, 0);
      const inputDate = new Date(date);
      inputDate.setHours(0, 0, 0, 0);
      return compareDate.getTime() === inputDate.getTime();
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">Book a Call</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Schedule Your Consultation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center">
            <Label className="mb-2">Select Date</Label>
            <div className="flex justify-center w-full">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={isDateDisabled}
              />
            </div>
          </div>
          
          {selectedDate && availableSlots.length > 0 && (
            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot === slot.id ? "default" : "outline"}
                    onClick={() => setSelectedSlot(slot.id)}
                    className="justify-center"
                  >
                    {slot.start_time} - {slot.end_time}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {selectedDate && availableSlots.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No available slots for this date. Please select another date.
            </p>
          )}
          
          {selectedSlot && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about your event..."
                />
              </div>
              
              <Button onClick={bookSlot} className="w-full">
                Book Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingForm;