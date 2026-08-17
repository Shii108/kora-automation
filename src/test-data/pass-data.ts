export function createPassData() {
  return {
    name: `E2E Gym Pass ${Date.now()}`,
    description: 'Access pass for the gym and related member perks.',
    numberOfDays: 30,
    price: 0,
    discount: 0,
    isActive: true,
  };
}
