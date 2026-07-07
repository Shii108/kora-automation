export function createPassData() {
  return {
    name: `Gym Pass ${Date.now()}`,
    description: 'Access pass for the gym and related member perks.',
    numberOfDays: 30,
    price: 1000,
    discount: 0,
    isActive: true,
  };
}
