import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FoodCard } from '@/components/FoodCard';
import type { Place } from '@/types';

// MOCKS
const mockOpenDetails = jest.fn();
jest.mock('@/hooks/details_screen_hook', () => ({
  useDetailsNavigation: () => ({
    openDetailsForPlace: mockOpenDetails,
  }),
}));

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: {
      foodCard: {
        communityAdded: 'Community Added',
        distanceAway: 'away',
        triedItYes: 'Tried It!',
        triedItNo: 'Mark as Tried',
      },
    },
  }),
}));

const mockToggleWishlist = jest.fn();
const mockToggleTried = jest.fn();
let mockUser: { uid: string } | null = { uid: 'user123' };
let mockWishlistIds = ['wishlist1'];
let mockTriedIds: string[] = [];

jest.mock('@/store/auth_store', () => ({
  useAuthStore: () => ({
    user: mockUser,
  }),
}));

jest.mock('@/store/list_store', () => ({
  useListStore: () => ({
    wishlistIds: mockWishlistIds,
    toggleWishlist: mockToggleWishlist,
    triedIds: mockTriedIds,
    toggleTried: mockToggleTried,
  }),
}));

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: (props: any) => <View {...props} testID="mock-image" />,
  };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    CheckCircle2: () => <View testID="mock-check-icon" />,
    Heart: () => <View testID="mock-heart-icon" />,
    MapPin: () => <View testID="mock-mappin-icon" />,
    Star: () => <View testID="mock-star-icon" />,
  };
});

jest.mock('@/components/ui/CategoryChip', () => {
  const { View } = require('react-native');
  return { CategoryChip: () => <View testID="mock-category-chip" /> };
});

jest.mock('@/components/ui/PriceBadge', () => {
  const { View } = require('react-native');
  return { PriceBadge: () => <View testID="mock-price-badge" /> };
});

const samplePlace: Place = {
  id: 'place1',
  name: 'Geewan Naga',
  categories: ['silog'],
  priceTier: 'affordable',
  priceMin: 100,
  priceMax: 200,
  description: 'Famous Silog spot',
  latitude: 13.6217,
  longitude: 123.1948,
  googleMapsUrl: 'https://maps.google.com',
  createdBy: 'user123',
  isSeeded: true,
  likes: 12,
  communityPriceTier: null,
  totalVotes: 0,
  createdAt: null,
};

describe('FoodCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { uid: 'user123' };
    mockWishlistIds = ['wishlist1'];
    mockTriedIds = [];
  });

  it('renders the establishment name', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    expect(getByText('Geewan Naga')).toBeTruthy();
  });

  it('renders distance with unit when distance prop is provided', () => {
    const { getByText } = render(<FoodCard place={samplePlace} distance={1.5} />);
    expect(getByText('1.5 away')).toBeTruthy();
  });

  it('shows tried label when place is not yet tried', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    expect(getByText(/Mark as Tried/)).toBeTruthy();
  });

  it('shows tried-it label when place is already tried', () => {
    mockTriedIds = ['place1'];
    const { getByText } = render(<FoodCard place={samplePlace} />);
    expect(getByText(/Tried It!/)).toBeTruthy();
  });

  it('calls toggleWishlist when wishlist button is pressed', () => {
    const { getByTestId } = render(<FoodCard place={samplePlace} />);
    fireEvent.press(getByTestId('wishlist-button'));
    expect(mockToggleWishlist).toHaveBeenCalledWith('user123', 'place1');
  });

  it('calls toggleTried when tried button is pressed', () => {
    const { getByTestId } = render(<FoodCard place={samplePlace} />);
    fireEvent.press(getByTestId('tried-button'));
    expect(mockToggleTried).toHaveBeenCalledWith('user123', 'place1');
  });

  it('navigates to details screen when card is pressed', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    fireEvent.press(getByText('Geewan Naga'));
    expect(mockOpenDetails).toHaveBeenCalledWith(samplePlace);
  });

  it('does not call toggleWishlist or toggleTried when user is not logged in', () => {
    mockUser = null;
    const { getByTestId } = render(<FoodCard place={samplePlace} />);
    fireEvent.press(getByTestId('wishlist-button'));
    fireEvent.press(getByTestId('tried-button'));
    expect(mockToggleWishlist).not.toHaveBeenCalled();
    expect(mockToggleTried).not.toHaveBeenCalled();
  });
});
