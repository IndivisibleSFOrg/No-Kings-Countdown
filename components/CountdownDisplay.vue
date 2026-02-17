<template>
  <div>
    <!-- Header -->
    <header class="bg-white border-b-4 border-red-500 shadow-md">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-red-600 bg-clip-text text-transparent">
              30 Days Until No Kings March
            </h1>
            <p class="mt-2 text-gray-600">
              30 ways to make a difference before then
            </p>
          </div>

          <!-- Layout Switcher -->
          <div class="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              @click="layout = 'masonry'"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'masonry'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Grid3x3 :size="16" />
              <span class="hidden sm:inline">Grid</span>
            </button>
            <button
              @click="layout = 'masonryWall'"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'masonryWall'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <LayoutGrid :size="16" />
              <span class="hidden sm:inline">Masonry</span>
            </button>
            <button
              @click="layout = 'carousel'"
              :class="[
                'flex items-center gap-2 px-4 py-2 rounded-md transition-all',
                layout === 'carousel'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              ]"
            >
              <Image :size="16" />
              <span class="hidden sm:inline">Carousel</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="py-8 md:py-12 max-w-7xl mx-auto px-4">
      <GridView v-if="layout === 'masonry'" :actions="actions" />
      <MasonryWallView v-else-if="layout === 'masonryWall'" :actions="actions" />
      <div v-else class="max-w-6xl mx-auto">
        <CarouselView :key="'carousel'" :actions="actions" />
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-16 bg-gradient-to-r from-red-600 to-blue-600 text-white py-8">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-lg font-semibold">
          Every action counts. Start making a difference today!
        </p>
        <p class="mt-2 text-sm text-white/80">
          Together, we can build stronger, more connected communities.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Grid3x3, Image, LayoutGrid } from 'lucide-vue-next';
import type { CountdownItem } from '~/composables/googleSheets';

interface Props {
  actions: CountdownItem[];
}

defineProps<Props>();

type LayoutType = 'masonry' | 'masonryWall' | 'carousel';
const layout = ref<LayoutType>('carousel');
</script>
