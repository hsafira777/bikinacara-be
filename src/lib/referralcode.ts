export function generateReferralCode(name: string) {
  return (
    name.split(" ").join("").substring(0, 4).toUpperCase() +
    Math.floor(1000 + Math.random() * 9000)
  );
}
