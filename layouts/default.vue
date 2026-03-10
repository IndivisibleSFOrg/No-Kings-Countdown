<template>
  <div class="min-h-screen bg-isf-tinted">
    <CountdownActions
      v-if="communityActions"
      :actions="visibleActions"
    />
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-isf-red" />
    </div>
    <!-- Modal pages render here via <slot> and teleport themselves to <body> -->
    <slot />
    <ReleaseModal v-if="showReleaseModal" @close="showReleaseModal = false" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const { communityActions, loadData } = useGoogleSheetsData()
const visibleActions = useVisibleActions(communityActions)
const { trackFirstVisit } = useAnalytics()
const { shouldShowReleaseNotes } = useReleaseModal()
const route = useRoute()

const showReleaseModal = ref(false)

onMounted(() => {
  loadData()
  trackFirstVisit()
  // Suppress auto-show when the /releases page is already rendering the modal
  if (route.path !== '/releases') {
    showReleaseModal.value = shouldShowReleaseNotes.value
  }
})
</script>
