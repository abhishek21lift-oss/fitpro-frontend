export function getGoalIcon(goal: string): string {
  if (goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('weight')) return 'target';
  if (goal.toLowerCase().includes('muscle')) return 'zap';
  return 'activity';
}

export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#22C55E';
    case 'review': return '#F59E0B';
    case 'delivered': return '#2563EB';
    default: return '#6B7280';
  }
}

export function getInitialsColor(id: number): string {
  const colors = ['#2563EB', '#8B5CF6', '#F59E0B', '#22C55E', '#EC4899', '#06B6D4'];
  return colors[id % colors.length];
}
