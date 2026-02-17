<template>
  <div class="w-full">
    <div v-if="!isMounted" class="w-full h-96 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
    <div v-else class="grid-view">
      <div
        v-for="action in shuffledActions"
        :key="action.date.toISOString()"
        :class="[
          'card-flip cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]',
          { flipped: flippedCards.has(action.date.toISOString()) }
        ]"
        @click="handleCardClick(action.date.toISOString(), $event)"
      >
        <div
          class="card-flip-inner"
          :style="{ height: `${action.height}px` }"
        >
          <!-- Front: Image Background + Overlay + Date -->
          <div class="card-front relative rounded-lg overflow-hidden">
            <!-- Background Image -->
            <img
              :src="action.image || defaultImage"
              :alt="action.headline"
              class="absolute inset-0 w-full h-full object-cover"
            />

            <!-- Colored Overlay (25% opacity) -->
            <div class="absolute inset-0 bg-black/25 transition-colors duration-300"></div>

            <!-- Content (Date) -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="text-center p-4">
                <div class="text-7xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {{ `${action.date.getMonth() + 1}/${action.date.getDate()}` }}
                </div>
                <div
                  v-if="action.date.getDate() === currentDay"
                  class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mt-2 inline-block"
                >
                  Today
                </div>
              </div>
            </div>
          </div>

          <!-- Back: Content (Image + Headline + Link) -->
          <div
            class="card-back bg-white flex flex-col h-full rounded-lg overflow-hidden"
            @click="handleLinkClick(action.link_url, action.date.toISOString(), $event)"
          >
            <div class="relative h-full flex flex-col">
              <!-- Image header on back - flexible height, can shrink -->
              <div class="relative flex-1 overflow-hidden min-h-0">
                <img
                  :src="action.image || defaultImage"
                  :alt="action.headline"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/20"></div>
              </div>

              <div class="p-5 bg-white flex-shrink-0 flex flex-col justify-between">
                <div>
                  <h3 class="font-bold text-gray-900 leading-tight text-lg mb-2">
                    {{ action.headline }}
                  </h3>
                  <p class="text-zinc-600 text-sm">
                    {{ action.details }}
                  </p>
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100">
                  <div class="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    <span>Take Action</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCurrentDay } from '~/composables/dateHelpers';
import { defaultImage } from '~/composables/constants';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

const props = defineProps<Props>();

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Assign random heights for Pinterest-style layout
const heights = [200, 250, 300, 350, 280, 320, 240, 360];

// Random overlay colors (25% opacity)
const overlayClasses = [
  "bg-red-600/25",
  "bg-blue-600/25",
  "bg-white/25",
];

const shuffledActions = ref<any[]>([]);
const currentDay = ref<number>(0);
const flippedCards = ref<Set<string>>(new Set());
const isMounted = ref(false);

const handleCardClick = (key: string, e: Event) => {
  e.preventDefault();
  if (flippedCards.value.has(key)) {
    flippedCards.value.delete(key);
  } else {
    flippedCards.value.add(key);
  }
  flippedCards.value = new Set(flippedCards.value);
};

const handleLinkClick = (link: string, key: string, e: Event) => {
  if (!flippedCards.value.has(key)) {
    e.preventDefault();
    flippedCards.value.add(key);
    flippedCards.value = new Set(flippedCards.value);
  } else {
    // Allow the link to work normally
    window.open(link, "_blank", "noopener,noreferrer");
    e.preventDefault();
  }
};

onMounted(() => {
  // Determine current day only on client
  currentDay.value = getCurrentDay();

  // Shuffle and assign properties only on client to ensure deterministic render match
  const shuffled = shuffleArray(props.actions).map((action, index) => {
    const overlayClass =
      overlayClasses[Math.floor(Math.random() * overlayClasses.length)];
    return {
      ...action,
      height: heights[index % heights.length],
      overlayClass: overlayClass,
    };
  });
  shuffledActions.value = shuffled;
  isMounted.value = true;
});
</script>

<style scoped>
.card-flip {
  perspective: 1000px;
  width: 100%;
}

.card-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card-flip.flipped .card-flip-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  top: 0;
  left: 0;
}

.card-back {
  transform: rotateY(180deg);
}

.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

@media (min-width: 640px) {
  .grid-view {
    gap: 1.5rem;
  }
}

@media (min-width: 768px) {
  .grid-view {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-view {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}
</style>
