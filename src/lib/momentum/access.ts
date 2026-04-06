type UserWithMomentum = {
  momentumSubscriptions?: { status: string }[];
};

export function hasActiveMomentumPro(user: UserWithMomentum | null): boolean {
  if (!user?.momentumSubscriptions?.length) return false;
  return user.momentumSubscriptions.some((s) => s.status === "ACTIVE" || s.status === "TRIALING");
}
