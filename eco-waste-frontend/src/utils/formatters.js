// src/utils/formatters.js

import { LEVELS, WASTE_TYPES } from './constants';

export const formatters = {
  points: (points) => {
    if (!points || points === 0) return '0';
    if (points >= 1000000) return `${(points / 1000000).toFixed(1)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(1)}K`;
    return points.toLocaleString();
  },

  co2: (kg) => {
    if (!kg || kg === 0) return '0 kg';
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tons`;
    return `${kg.toFixed(0)} kg`;
  },

  percentage: (value, total, decimals = 1) => {
    if (!total || total === 0) return '0%';
    return `${((value / total) * 100).toFixed(decimals)}%`;
  },

  wasteType: (type) => {
    const types = {
      [WASTE_TYPES.RECYCLABLE]: 'Recyclable ♻️',
      [WASTE_TYPES.ORGANIC]: 'Organic 🌱',
      [WASTE_TYPES.GENERAL]: 'General 🗑️',
      [WASTE_TYPES.HAZARDOUS]: 'Hazardous ⚠️'
    };
    return types[type] || type;
  },

  wasteCategory: (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  },

  badge: (badge) => {
    return `${badge.icon} ${badge.name}`;
  },

  level: (level) => {
    const levelData = LEVELS.find(l => l.level === level);
    return levelData ? `${levelData.icon} ${levelData.title}` : 'Unknown';
  },

  rank: (rank) => {
    if (!rank || rank === 0) return 'Unranked';
    if (rank === 1) return '🥇 1st';
    if (rank === 2) return '🥈 2nd';
    if (rank === 3) return '🥉 3rd';
    
    const lastDigit = rank % 10;
    const lastTwoDigits = rank % 100;
    
    if (lastDigit === 1 && lastTwoDigits !== 11) return `#${rank}st`;
    if (lastDigit === 2 && lastTwoDigits !== 12) return `#${rank}nd`;
    if (lastDigit === 3 && lastTwoDigits !== 13) return `#${rank}rd`;
    return `#${rank}th`;
  },

  streak: (days) => {
    if (!days || days === 0) return 'No streak';
    if (days === 1) return '1 day 🔥';
    return `${days} days 🔥`;
  },

  impact: (impact) => {
    if (!impact) return 'No impact yet';
    
    const parts = [];
    if (impact.co2) parts.push(`${formatters.co2(impact.co2)} CO₂`);
    if (impact.trees) parts.push(`${impact.trees} trees 🌲`);
    if (impact.water) parts.push(`${impact.water}L water 💧`);
    if (impact.energy) parts.push(`${impact.energy}kWh energy ⚡`);
    
    return parts.join(' • ');
  },

  timeRemaining: (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry - now;
    
    if (diffMs <= 0) return 'Expired';
    
    const diffDays = Math.floor(diffMs / 86400000);
    const diffHours = Math.floor((diffMs % 86400000) / 3600000);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    return 'Less than 1 hour left';
  },

  userName: (user) => {
    if (!user) return 'Anonymous';
    return user.name || user.email?.split('@')[0] || 'User';
  },

  initials: (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  },

  truncate: (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  list: (items, conjunction = 'and') => {
    if (!items || items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
    
    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1).join(', ');
    return `${otherItems}, ${conjunction} ${lastItem}`;
  },

  boolean: (value) => {
    return value ? 'Yes ✓' : 'No ✗';
  },

  status: (status) => {
    const statusMap = {
      active: '🟢 Active',
      pending: '🟡 Pending',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
      open: '🟢 Open',
      closed: '🔴 Closed'
    };
    return statusMap[status?.toLowerCase()] || status;
  },

  priority: (priority) => {
    const priorityMap = {
      low: '🟢 Low',
      medium: '🟡 Medium',
      high: '🔴 High',
      urgent: '🚨 Urgent'
    };
    return priorityMap[priority?.toLowerCase()] || priority;
  },

  frequency: (frequency) => {
    const frequencyMap = {
      daily: 'Every day',
      weekly: 'Once a week',
      'bi-weekly': 'Every 2 weeks',
      monthly: 'Once a month'
    };
    return frequencyMap[frequency] || frequency;
  }
};

export default formatters;