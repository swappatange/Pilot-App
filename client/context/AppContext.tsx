import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, translations } from '@/constants/translations';

export type BookingStatus = 'pending' | 'active' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  acreage: number;
  cropType: string;
  sprayType: 'pesticide' | 'fertilizer';
  scheduledDate: string;
  scheduledTime: string;
  specialInstructions?: string;
  amount: number;
  paymentStatus: 'paid' | 'unpaid';
  status: BookingStatus;
  completedAt?: string;
  latitude: number;
  longitude: number;
}

export interface Operator {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  licenseNumber: string;
  droneModel: string;
  droneRegistration: string;
  insuranceExpiry: string;
  homeLatitude: number;
  homeLongitude: number;
}

interface AppState {
  language: Language;
  isAuthenticated: boolean;
  operator: Operator | null;
  bookings: Booking[];
}

interface AppContextType extends AppState {
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  login: (phone: string) => void;
  logout: () => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => void;
  updateOperator: (updates: Partial<Operator>) => void;
  getBookingsByStatus: (status: BookingStatus | BookingStatus[]) => Booking[];
  getTodayBookings: () => Booking[];
  getEarnings: (period: 'today' | 'week' | 'month') => { total: number; count: number; acres: number };
}

const mockOperator: Operator = {
  id: '1',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh@example.com',
  address: 'Village Khera, Ludhiana, Punjab',
  licenseNumber: 'DRN-PB-2024-001234',
  droneModel: 'DJI Agras T40',
  droneRegistration: 'UA-PB-2024-00567',
  insuranceExpiry: '2025-06-30',
  homeLatitude: 30.9010,
  homeLongitude: 75.8573,
};

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

const mockBookings: Booking[] = [
  {
    id: '1',
    farmerName: 'Gurpreet Singh',
    farmerPhone: '+91 98123 45678',
    village: 'Moga',
    district: 'Punjab',
    acreage: 15,
    cropType: 'Wheat',
    sprayType: 'pesticide',
    scheduledDate: formatDate(today),
    scheduledTime: '09:00 AM',
    amount: 4500,
    paymentStatus: 'unpaid',
    status: 'pending',
    latitude: 30.8162,
    longitude: 75.1741,
  },
  {
    id: '2',
    farmerName: 'Harinder Kaur',
    farmerPhone: '+91 99876 54321',
    village: 'Barnala',
    district: 'Punjab',
    acreage: 8,
    cropType: 'Rice',
    sprayType: 'fertilizer',
    scheduledDate: formatDate(today),
    scheduledTime: '11:30 AM',
    specialInstructions: 'Please spray only in the morning before 12 PM',
    amount: 2400,
    paymentStatus: 'paid',
    status: 'active',
    latitude: 30.3815,
    longitude: 75.5472,
  },
  {
    id: '3',
    farmerName: 'Manjeet Singh',
    farmerPhone: '+91 97654 32109',
    village: 'Sangrur',
    district: 'Punjab',
    acreage: 20,
    cropType: 'Cotton',
    sprayType: 'pesticide',
    scheduledDate: formatDate(today),
    scheduledTime: '02:00 PM',
    amount: 6000,
    paymentStatus: 'unpaid',
    status: 'pending',
    latitude: 30.2331,
    longitude: 75.8406,
  },
  {
    id: '4',
    farmerName: 'Sukhdev Sharma',
    farmerPhone: '+91 96543 21098',
    village: 'Bathinda',
    district: 'Punjab',
    acreage: 12,
    cropType: 'Mustard',
    sprayType: 'fertilizer',
    scheduledDate: formatDate(new Date(today.getTime() - 86400000)),
    scheduledTime: '10:00 AM',
    amount: 3600,
    paymentStatus: 'paid',
    status: 'completed',
    completedAt: new Date(today.getTime() - 86400000).toISOString(),
    latitude: 30.2110,
    longitude: 74.9455,
  },
  {
    id: '5',
    farmerName: 'Amarjeet Gill',
    farmerPhone: '+91 95432 10987',
    village: 'Faridkot',
    district: 'Punjab',
    acreage: 25,
    cropType: 'Sugarcane',
    sprayType: 'pesticide',
    scheduledDate: formatDate(new Date(today.getTime() - 172800000)),
    scheduledTime: '08:00 AM',
    amount: 7500,
    paymentStatus: 'paid',
    status: 'completed',
    completedAt: new Date(today.getTime() - 172800000).toISOString(),
    latitude: 30.6740,
    longitude: 74.7580,
  },
  {
    id: '6',
    farmerName: 'Kuldeep Dhillon',
    farmerPhone: '+91 94321 09876',
    village: 'Amritsar',
    district: 'Punjab',
    acreage: 18,
    cropType: 'Wheat',
    sprayType: 'pesticide',
    scheduledDate: formatDate(new Date(today.getTime() - 259200000)),
    scheduledTime: '09:30 AM',
    amount: 5400,
    paymentStatus: 'paid',
    status: 'completed',
    completedAt: new Date(today.getTime() - 259200000).toISOString(),
    latitude: 31.6340,
    longitude: 74.8723,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    language: 'en',
    isAuthenticated: false,
    operator: null,
    bookings: mockBookings,
  });

  const t = useCallback((key: string): string => {
    return translations[state.language][key] || key;
  }, [state.language]);

  const setLanguage = useCallback((lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  }, []);

  const login = useCallback((phone: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      operator: { ...mockOperator, phone },
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      operator: null,
    }));
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: BookingStatus) => {
    setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(b =>
        b.id === bookingId
          ? {
              ...b,
              status,
              ...(status === 'completed' ? { completedAt: new Date().toISOString() } : {}),
            }
          : b
      ),
    }));
  }, []);

  const updateOperator = useCallback((updates: Partial<Operator>) => {
    setState(prev => ({
      ...prev,
      operator: prev.operator ? { ...prev.operator, ...updates } : null,
    }));
  }, []);

  const getBookingsByStatus = useCallback((status: BookingStatus | BookingStatus[]) => {
    const statuses = Array.isArray(status) ? status : [status];
    return state.bookings.filter(b => statuses.includes(b.status));
  }, [state.bookings]);

  const getTodayBookings = useCallback(() => {
    const todayStr = formatDate(new Date());
    return state.bookings.filter(b => b.scheduledDate === todayStr);
  }, [state.bookings]);

  const getEarnings = useCallback((period: 'today' | 'week' | 'month') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 86400000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredBookings = state.bookings.filter(b => {
      if (b.status !== 'completed' || !b.completedAt) return false;
      const completedDate = new Date(b.completedAt);
      return completedDate >= startDate;
    });

    return {
      total: filteredBookings.reduce((sum, b) => sum + b.amount, 0),
      count: filteredBookings.length,
      acres: filteredBookings.reduce((sum, b) => sum + b.acreage, 0),
    };
  }, [state.bookings]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        t,
        setLanguage,
        login,
        logout,
        updateBookingStatus,
        updateOperator,
        getBookingsByStatus,
        getTodayBookings,
        getEarnings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
