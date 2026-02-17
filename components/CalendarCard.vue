<template>
  <div 
    :class="['card-flip', 'cursor-pointer', 'rounded-lg', 'shadow-lg', 'hover:shadow-xl', 'transition-all', 'duration-300', 'h-full', { 'flipped': isFlipped }]"
    @click="handleClick"
  >
    <div class="card-flip-inner h-full">
      <!-- Front: Date with Image -->
      <div class="card-front relative rounded-lg overflow-hidden h-full">
        <img
          :src="action ? (action.image || defaultImage) : defaultImage"
          :alt="action ? action.headline : 'Event'"
          class="absolute inset-0 w-full h-full object-cover"
        />
        
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
        
        <div class="absolute inset-0 flex flex-col items-end justify-end p-3">
          <div class="text-3xl font-bold text-white drop-shadow-lg">
            {{ month }}/{{ date }}
          </div>
          <div v-if="isToday" class="mt-1 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Today
          </div>
        </div>
      </div>
      
      <!-- Back: Content -->
      <div 
        v-if="action"
        class="card-back bg-white flex flex-col h-full rounded-lg overflow-hidden"
        @click="handleLinkClick(action.link_url, $event)"
      >
        <div class="relative h-full flex flex-col">
          <div class="relative flex-1 overflow-hidden min-h-0">
            <img
              :src="action.image || defaultImage"
              :alt="action.headline"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div class="p-3 bg-white flex-shrink-0">
            <div class="text-xs font-bold text-gray-900 mb-1 line-clamp-2">
              {{ action.headline }}
            </div>
            <div class="text-xs text-blue-600 hover:text-blue-800 font-semibold">
              Take Action →
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card-back bg-gray-100 flex items-center justify-center h-full rounded-lg">
        <div class="text-gray-400 text-sm">No event</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defaultImage } from '~/composables/constants';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  date: number;
  month: number;
  action: CountdownItem | undefined;
  isToday: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'flip', key: string): void;
}>();

const isFlipped = ref(false);

const handleClick = (e: Event) => {
  e.preventDefault();
  isFlipped.value = !isFlipped.value;
  emit('flip', `${props.month}-${props.date}`);
};

const handleLinkClick = (link: string, e: Event) => {
  if (!isFlipped.value) {
    e.preventDefault();
    isFlipped.value = true;
  } else {
    window.open(link, "_blank", "noopener,noreferrer");
    e.preventDefault();
  }
};
</script>

<style scoped>
.card-flip {
  perspective: 1000px;
  width: 100%;
  height: 100%;
}

.card-flip-inner {
  position: relative;
  width: 100%;
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
