<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <!-- Filters -->
    <div class="mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <MapPinIcon class="w-3 h-3" />
            Destination
          </label>
          <input 
            v-model="filters.plan_name"
            type="text" 
            placeholder="Search destination..." 
            class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>

        <!-- Budget Range -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <CurrencyDollarIcon class="w-3 h-3" />
            Budget Range
          </label>
          <div class="flex items-center gap-2">
            <input 
              v-model.number="filters.budget_min"
              type="number" 
              placeholder="Min" 
              class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <span class="text-gray-400 text-xs">to</span>
            <input 
              v-model.number="filters.budget_max"
              type="number" 
              placeholder="Max" 
              class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>

        <!-- Activities Search -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <StarIcon class="w-3 h-3" />
            Activities
          </label>
          <input 
            v-model="filters.activity"
            type="text" 
            placeholder="Hiking, Beach, etc..." 
            class="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
          />
        </div>

        <!-- Date Range -->
        <div class="space-y-2 md:col-span-1 lg:col-span-1">
          <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon class="w-3 h-3" />
            Travel Dates
          </label>
          <div class="grid grid-cols-2 gap-2">
            <input 
              v-model="filters.day_from"
              type="date" 
              class="bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
            <input 
              v-model="filters.day_to"
              type="date" 
              class="bg-gray-50 dark:bg-gray-900 border-none rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="flex gap-2">
          <button 
            @click="fetchDestinations"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 text-sm font-bold transition-all shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
          >
            <FunnelIcon class="w-4 h-4" />
            Apply Filters
          </button>
          <button 
            @click="clearFilters"
            class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-xl px-3 py-2.5 transition-colors"
            title="Clear Filters"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Destinations -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <div 
        v-for="(plan, index) in limitedPlans" 
        :key="plan.id || index"
        @click="openDetailModal(plan)"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="plan.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'"
            >
              {{ plan.is_active ? 'Available' : 'Unavailable' }}
            </span>
            <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">
              #{{ index + 1 }}
            </span>
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
            {{ plan.title || 'Trip Package' }}
          </h3>
          <p class="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter mb-2">
            {{ plan.city?.city_name || 'Various Locations' }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {{ plan.activity?.activity_name || 'Explore and more' }}
          </p>
        </div>

        <div class="pt-6 border-t border-gray-50 dark:border-gray-700">
          <div class="flex justify-between items-end">
            <div>
              <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Price</p>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                ${{ plan.price || '0.00' }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">View Details</p>
              <ArrowRightIcon class="w-4 h-4 ml-auto text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <template v-if="loading">
        <div 
          v-for="i in 10" 
          :key="'skeleton-' + i"
          class="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center items-center h-64 animate-pulse"
        >
          <div class="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div class="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div class="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </template>
      
      <div 
        v-if="!loading && travelPlans.length === 0" 
        class="col-span-full py-20 text-center"
      >
        <p class="text-lg text-gray-400 dark:text-gray-500 italic">No travel plans found at the moment.</p>
      </div>
    </div>

    <!-- Details go here -->
    <TransitionRoot appear :show="isDetailModalOpen" as="template">
      <Dialog as="div" @close="closeDetailModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 shadow-inner" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 text-left align-middle shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
                <div v-if="selectedPlan">
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <DialogTitle as="h3" class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {{ selectedPlan.title }}
                      </DialogTitle>
                      <p class="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-widest text-sm flex items-center">
                        <MapPinIcon class="w-4 h-4 mr-1" />
                        {{ selectedPlan.city?.city_name }}
                      </p>
                    </div>
                    <button 
                      @click="closeDetailModal" 
                      class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <XMarkIcon class="w-6 h-6" />
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-gray-100 dark:border-gray-800">
                    <div>
                      <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Trip Overview</h4>
                      <div class="space-y-4">
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-indigo-500">
                            <CalendarIcon class="w-5 h-5" />
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Travel Period</p>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ formatDate(selectedPlan.day_from) }} - {{ formatDate(selectedPlan.day_to) }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-emerald-500">
                            <CurrencyDollarIcon class="w-5 h-5" />
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Package Price</p>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              ${{ selectedPlan.price }}
                            </p>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <div class="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-amber-500">
                            <StarIcon class="w-5 h-5" />
                          </div>
                          <div>
                            <p class="text-xs text-gray-500">Main Experience</p>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ selectedPlan.activity?.activity_name }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Must-Visit Spots</h4>
                      <ul v-if="selectedPlan.tourist_spots?.length > 0" class="space-y-3">
                        <li v-for="spot in selectedPlan.tourist_spots" :key="spot.id" class="flex items-start gap-2">
                          <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ spot.tourist_spot_name }}</p>
                            <p class="text-xs text-gray-500 line-clamp-1">{{ spot.tourist_spot_address }}</p>
                          </div>
                        </li>
                      </ul>
                      <p v-else class="text-sm text-gray-400 italic">No specific spots listed for this plan.</p>
                    </div>
                  </div>

                  <div class="mt-8">
                    <h4 class="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Included Activities</h4>
                    <div class="flex flex-wrap gap-2">
                       <span 
                        v-for="dest in selectedPlan.destinations" 
                        :key="dest.id"
                        class="px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium border border-gray-100 dark:border-gray-700"
                       >
                         {{ dest.activity?.activity_name || 'Additional Activity' }}
                       </span>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
// import { useAuthStore } from '@/stores/auth';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { 
  MapPinIcon, 
  XMarkIcon, 
  CalendarIcon, 
  CurrencyDollarIcon, 
  StarIcon,
  ArrowRightIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline';

// const auth = useAuthStore();
const travelPlans = ref([]);
const loading = ref(true);

// Modal State
const isDetailModalOpen = ref(false);
const selectedPlan = ref(null);

// Filters state
const filters = ref({
  plan_name: '',
  activity: '',
  budget_min: null,
  budget_max: null,
  day_from: '',
  day_to: '',
});

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

const fetchDestinations = async () => {
  try {
    loading.value = true;
    
    // Clean filters to remove empty values
    const params = { per_page: 10 };
    if (filters.value.plan_name) params.plan_name = filters.value.plan_name;
    if (filters.value.activity) params.activity = filters.value.activity;
    if (filters.value.budget_min) params.budget_min = filters.value.budget_min;
    if (filters.value.budget_max) params.budget_max = filters.value.budget_max;
    if (filters.value.day_from) params.day_from = filters.value.day_from;
    if (filters.value.day_to) params.day_to = filters.value.day_to;

    const res = await api.get('/destination/search', { params });
    // Robust extraction: Handle data.data.data (paginated), data.data, or data
    const rawData = res.data?.data?.data || res.data?.data || res.data || [];
    travelPlans.value = Array.isArray(rawData) ? rawData : [];
  } catch (err) {
    console.error('Failed to fetch destinations', err);
    travelPlans.value = [];
  } finally {
    loading.value = false;
  }
};

const clearFilters = () => {
  filters.value = {
    plan_name: '',
    activity: '',
    budget_min: null,
    budget_max: null,
    day_from: '',
    day_to: '',
  };
  fetchDestinations();
};

const openDetailModal = (plan) => {
  selectedPlan.value = plan;
  isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  setTimeout(() => { selectedPlan.value = null; }, 200);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

const limitedPlans = computed(() => {
  return travelPlans.value.slice(0, 10);
});

onMounted(() => {
  fetchDestinations();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>