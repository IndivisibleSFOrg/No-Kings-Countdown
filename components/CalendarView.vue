<template>
  <div class="w-full">
    <div v-if="!isMounted" class="w-full h-96 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
    <div v-else class="calendar-view">
      <h2 class="text-3xl font-bold text-gray-900 mb-4">February 1 - March 28, 2026</h2>
      <div class="calendar-grid">
        <!-- Day headers (Monday as week start) -->
        <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" 
             :key="day"
             class="text-center font-semibold text-gray-600 py-2">
          {{ day }}
        </div>
        
        <!-- Calendar cells -->
        <div v-for="(dateInfo, index) in allDates" :key="`${dateInfo.month}-${dateInfo.date}-${index}`" class="calendar-cell">
          <CalendarCard
            v-if="dateInfo.date !== null"
            :date="dateInfo.date"
            :month="dateInfo.month"
            :action="getActionForDate(dateInfo.date, dateInfo.month)"
            :is-today="isToday(dateInfo.date, dateInfo.month)"
            @flip="handleCardFlip"
          />
          <div v-else class="calendar-cell-empty"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getCurrentDay } from '~/composables/dateHelpers';
import type { CountdownItem } from '~/composables/googleSheets';
import CalendarCard from './CalendarCard.vue';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

const currentDay = ref<number>(0);
const currentMonth = ref<number>(0);
const isMounted = ref(false);

// Calendar date range settings
const CALENDAR_START_DATE = 1;  // Start day of February
const CALENDAR_START_MONTH = 2; // February
const CALENDAR_END_DATE = 28;   // End day of March
const CALENDAR_END_MONTH = 3;   // March

// Create array of all dates from Feb 1 to Mar 28
// Feb 1, 2026 is a Sunday, so we offset by 6 to start on Monday
const allDates = computed(() => {
  const dates = [];
  
  // Calculate offset for Monday start
  // Feb 1, 2026 is Sunday (day 0), so offset = 6 days to show empty cells before it
  const febStartDay = new Date(2026, CALENDAR_START_MONTH - 1, CALENDAR_START_DATE).getDay();
  const offsetDays = febStartDay === 0 ? 6 : febStartDay - 1; // Monday = 0 offset, Sunday = 6 offset
  
  // Add empty cells for alignment
  for (let i = 0; i < offsetDays; i++) {
    dates.push({ date: null, month: null });
  }
  
  // February dates (from start date to 28)
  for (let day = CALENDAR_START_DATE; day <= 28; day++) {
    dates.push({ date: day, month: 2 });
  }
  
  // March dates (1 to end date)
  for (let day = 1; day <= CALENDAR_END_DATE; day++) {
    dates.push({ date: day, month: 3 });
  }
  
  return dates;
});

const getActionForDate = (day: number, month: number) => {
  return props.actions.find(action => {
    const actionDate = action.date;
    return actionDate.getDate() === day && (actionDate.getMonth() + 1) === month;
  });
};

const isToday = (day: number, month: number) => {
  return day === currentDay.value && month === currentMonth.value;
};

const handleCardFlip = (key: string) => {
  // Cards manage their own flip state
};

onMounted(() => {
  const today = new Date();
  currentDay.value = today.getDate();
  currentMonth.value = today.getMonth() + 1;
  isMounted.value = true;
});
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.calendar-cell {
  aspect-ratio: 1;
  min-height: 150px;
.calendar-cell-empty {
  aspect-ratio: 1;
  min-height: 150px;
}

}

@media (max-width: 768px) {
  .calendar-grid {
    gap: 0.25rem;
  }
  
  .calendar-cell {
    min-height: 120px;
  }
}

@media (max-width: 640px) {
  .calendar-cell {
    min-height: 100px;
  }
}
</style>
