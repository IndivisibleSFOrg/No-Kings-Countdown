<template>
  <div class="w-full">
    <ClientOnly>
      <MasonryWall :items="actions" :ssr-columns="1" :column-width="300" :gap="16">
        <template #default="{ item }">
          <div
            :class="[
              'card-flip cursor-pointer rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]',
              { flipped: flippedCards.has(item.date.toISOString()) }
            ]"
            @click="handleCardClick(item.date.toISOString(), $event)"
          >
            <div class="card-flip-inner" :style="{ height: `${getRandomHeight()}px` }">
              <!-- Front: Image Background + Overlay + Date -->
              <div class="card-front relative rounded-lg overflow-hidden">
                <!-- Background Image -->
                <img
                  :src="item.image || defaultImage"
                  :alt="item.headline"
                  class="absolute inset-0 w-full h-full object-cover"
                />

                <!-- Colored Overlay -->
                <div class="absolute inset-0 bg-black/25 transition-colors duration-300"></div>

                <!-- Content (Date) -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div class="text-center p-4">
                    <div class="text-7xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {{ `${item.date.getMonth() + 1}/${item.date.getDate()}` }}
                    </div>
                    <div
                      v-if="item.date.getDate() === currentDay"
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
                @click="handleLinkClick(item.link_url, item.date.toISOString(), $event)"
              >
                <div class="relative h-full flex flex-col">
                  <!-- Image header on back -->
                  <div class="relative flex-1 overflow-hidden min-h-0">
                    <img
                      :src="item.image || defaultImage"
                      :alt="item.headline"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-black/20"></div>
                  </div>

                  <div class="p-5 bg-white flex-shrink-0 flex flex-col justify-between">
                    <div>
                      <h3 class="font-bold text-gray-900 leading-tight text-lg mb-2">
                        {{ item.headline }}
                      </h3>
                      <p class="text-zinc-600 text-sm">
                        {{ item.details }}
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
        </template>
      </MasonryWall>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MasonryWall from '@yeger/vue-masonry-wall';
import { getCurrentDay } from '~/composables/dateHelpers';
import { defaultImage } from '~/composables/constants';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

defineProps<Props>();

const currentDay = ref<number>(0);
const flippedCards = ref<Set<string>>(new Set());

// Random heights for variety
const heights = [250, 300, 350, 400, 320, 360, 280];
let heightIndex = 0;

const getRandomHeight = () => {
  const height = heights[heightIndex % heights.length];
  heightIndex++;
  return height;
};

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
  currentDay.value = getCurrentDay();
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
</style>
