import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, MapPin, Bell, BellOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { scheduleAPI } from '../services/api';
import { toast } from 'react-toastify';

const ScheduleView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedules, setSchedules] = useState([]);
  const [nextPickups, setNextPickups] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
    loadNextPickups();
  }, []);

  const loadSchedules = async () => {
    try {
      const response = await scheduleAPI.getMySchedule();
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const loadNextPickups = async () => {
    try {
      const response = await scheduleAPI.getNextPickups();
      setNextPickups(response.data.data);
    } catch (error) {
      console.error('Failed to load pickups');
    }
  };

  const handleSubscribe = async (scheduleId) => {
    try {
      await scheduleAPI.subscribeToSchedule(scheduleId);
      toast.success('Subscribed to reminders! 🔔');
      loadSchedules();
    } catch (error) {
      toast.error('Failed to subscribe');
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPickupsForDate = (date) => {
    return nextPickups.filter(pickup => 
      isSameDay(new Date(pickup.date), date)
    );
  };

  const wasteTypeColors = {
    recyclable: 'bg-blue-100 text-blue-800',
    organic: 'bg-green-100 text-green-800',
    'e-waste': 'bg-orange-100 text-orange-800',
    hazardous: 'bg-red-100 text-red-800',
    general: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <CalendarIcon className="w-10 h-10" />
          Collection Schedule
        </h1>
        <p className="text-indigo-100 text-lg">
          Never miss a pickup with smart reminders
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card title="Calendar" icon="📅">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => {
                const pickups = getPickupsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <motion.button
                    key={day.toISOString()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square p-2 rounded-lg border-2 transition-all relative
                      ${!isCurrentMonth ? 'opacity-40' : ''}
                      ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                      ${isTodayDate ? 'bg-blue-50 border-blue-300' : ''}
                      ${pickups.length > 0 ? 'hover:shadow-lg' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="text-sm font-semibold text-gray-800">
                      {format(day, 'd')}
                    </div>
                    
                    {pickups.length > 0 && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {pickups.slice(0, 3).map((pickup, idx) => (
                          <div
                            key={idx}
                            className="w-1.5 h-1.5 rounded-full bg-green-500"
                          />
                        ))}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-50 border-2 border-blue-300 rounded" />
                <span className="text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Pickup</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Pickups for Selected Date */}
        <div>
          <Card 
            title={format(selectedDate, 'MMMM d, yyyy')} 
            icon="📋"
            subtitle={isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE')}
          >
            <div className="space-y-3">
              {getPickupsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No pickups scheduled</p>
                </div>
              ) : (
                getPickupsForDate(selectedDate).map((pickup, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      wasteTypeColors[pickup.wasteType] || 'bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold capitalize">
                        {pickup.wasteType.replace('_', ' ')}
                      </h4>
                      <Badge variant="success" size="sm">
                        {pickup.zone}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2 opacity-80">
                        <Clock className="w-4 h-4" />
                        <span>{pickup.time}</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-80">
                        <MapPin className="w-4 h-4" />
                        <span>{pickup.frequency}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* My Schedules */}
          <Card title="My Subscriptions" icon="🔔" className="mt-6">
            <div className="space-y-2">
              {schedules.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active subscriptions
                </p>
              ) : (
                schedules.map((schedule) => (
                  <div
                    key={schedule._id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{schedule.zone}</p>
                        <p className="text-xs text-gray-500">
                          {schedule.pickups?.length || 0} pickup types
                        </p>
                      </div>
                      <Bell className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ScheduleView;