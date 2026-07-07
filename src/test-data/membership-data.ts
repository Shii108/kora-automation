export type MembershipFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export function createMembershipData(frequency: MembershipFrequency = 'monthly') {
  const timestamp = Date.now();
  const membershipOption: {
    frequency: MembershipFrequency;
    price: number;
    isVisible: boolean;
    customDays?: number;
  } = {
    frequency,
    price: frequency === 'monthly' ? 2000 : 20000,
    isVisible: true,
  };

  if (frequency === 'custom') {
    membershipOption.customDays = 30;
  }

  return {
    name: `Gym Membership ${timestamp}`,
    currency: 'NPR',
    description: 'Access plan for the gym and related member perks.',
    isActive: true,
    capacity: 100,
    isFreezable: true,
    maxVisitors: 2,
    freezeDays: 30,
    spaBenefit: 10,
    classBenefit: 100,
    eventBenefit: 10,
    workshopBenefit: 10,
    spaGuestBenefit: 10,
    classGuestBenefit: 100,
    eventGuestBenefit: 10,
    workshopGuestBenefit: 10,
    options: [membershipOption],
  };
}
