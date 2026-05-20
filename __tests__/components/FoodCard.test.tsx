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
let mockTriedIds = ['tried1'];

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

const samplePlace: Place = {
  id: 'place1',
  name: 'Geewan Naga',
  categories: ['filipino'],
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
};

describe('FoodCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { uid: 'user123' };
    mockWishlistIds = ['wishlist1'];
    mockTriedIds = ['tried1'];
  });

  it('renders place details correctly', () => {
    const { getByText } = render(<FoodCard place={samplePlace} distance={1.5} />);

    expect(getByText('Geewan Naga')).toBeTruthy();
    expect(getByText('1.5 away')).toBeTruthy();
  });

  it('renders community added badge if place is not seeded', () => {
    const communityPlace = { ...samplePlace, isSeeded: false };
    const { getByText } = render(<FoodCard place={communityPlace} />);

    expect(getByText('Community Added')).toBeTruthy();
  });

  it('does not render community added badge if place is seeded', () => {
    const { queryByText } = render(<FoodCard place={samplePlace} />);

    expect(queryByText('Community Added')).toBeNull();
  });

  it('displays active state for tried/wishlist if IDs are in respective stores', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);

    expect(getByText('Mark as Tried')).toBeTruthy();
    expect(getByText('12')).toBeTruthy();
  });

  it('calls toggleWishlist when heart icon button is pressed', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    const wishlistButton = getByText('12');

    fireEvent.press(wishlistButton);

    expect(mockToggleWishlist).toHaveBeenCalledWith('user123', 'place1');
  });

  it('calls toggleTried when check circle button is pressed', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    const triedButton = getByText('Mark as Tried');

    fireEvent.press(triedButton);

    expect(mockToggleTried).toHaveBeenCalledWith('user123', 'place1');
  });

  it('navigates to details screen on press of the card', () => {
    const { getByText } = render(<FoodCard place={samplePlace} />);
    const titleText = getByText('Geewan Naga');

    fireEvent.press(titleText);

    expect(mockOpenDetails).toHaveBeenCalledWith(samplePlace);
  });
});
