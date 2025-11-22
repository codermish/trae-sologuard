import { create } from 'zustand'

interface SearchFilters {
  destination: string
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  minPrice?: number
  maxPrice?: number
  rating?: number
  amenities?: string[]
}

interface FlightSearchFilters {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: 'economy' | 'business' | 'first'
  maxPrice?: number
  maxStops?: number
}

interface SearchState {
  hotelFilters: SearchFilters
  flightFilters: FlightSearchFilters
  searchType: 'hotels' | 'flights' | 'cars' | 'packages'
  setHotelFilters: (filters: Partial<SearchFilters>) => void
  setFlightFilters: (filters: Partial<FlightSearchFilters>) => void
  setSearchType: (type: 'hotels' | 'flights' | 'cars' | 'packages') => void
  resetFilters: () => void
}

const initialHotelFilters: SearchFilters = {
  destination: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  rooms: 1,
}

const initialFlightFilters: FlightSearchFilters = {
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  passengers: 1,
  cabinClass: 'economy',
}

export const useSearchStore = create<SearchState>()((set) => ({
  hotelFilters: initialHotelFilters,
  flightFilters: initialFlightFilters,
  searchType: 'hotels',
  setHotelFilters: (filters) =>
    set((state) => ({
      hotelFilters: { ...state.hotelFilters, ...filters },
    })),
  setFlightFilters: (filters) =>
    set((state) => ({
      flightFilters: { ...state.flightFilters, ...filters },
    })),
  setSearchType: (type) => set({ searchType: type }),
  resetFilters: () =>
    set({
      hotelFilters: initialHotelFilters,
      flightFilters: initialFlightFilters,
    }),
}))