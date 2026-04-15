<template>
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Travel Plans</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Add, edit, or remove destination packages for your customers.</p>
      </div>
      <button 
        @click="openCreateModal"
        class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
        Create New Plan
      </button>
    </div>

    <!-- Plans Table -->
    <div class="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Plan Details</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Location</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Price</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</th>
              <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-700 bg-transparent">
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-6 py-8"><div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-3/4"></div></td>
                <td class="px-6 py-8"><div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/2"></div></td>
                <td class="px-6 py-8"><div class="h-4 bg-gray-100 dark:bg-gray-700 rounded w-1/4"></div></td>
                <td class="px-6 py-8"><div class="h-6 bg-gray-100 dark:bg-gray-700 rounded-full w-20"></div></td>
                <td class="px-6 py-8"><div class="h-8 bg-gray-100 dark:bg-gray-700 rounded w-full ml-auto"></div></td>
              </tr>
            </template>
            <template v-else-if="plans.length === 0">
              <tr>
                <td colspan="5" class="px-6 py-20 text-center text-gray-400 italic">No plans found. Create your first one above!</td>
              </tr>
            </template>
            <tr v-for="plan in plans" :key="plan.id" class="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group">
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900 dark:text-white">{{ plan.title }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ plan.activity?.activity_name || 'No activity' }}</span>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                <div class="flex items-center gap-1.5">
                  <MapPinIcon class="w-3.5 h-3.5 text-gray-400" />
                  {{ plan.city?.city_name }}
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                ${{ plan.price }}
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight"
                  :class="plan.is_active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'"
                >
                  {{ plan.is_active ? 'Active' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  <button @click="editPlan(plan)" class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg transition-colors">
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button @click="confirmDelete(plan)" class="text-red-600 dark:text-red-400 hover:text-red-900 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition-colors">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Create/Edit -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
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
                <DialogTitle as="h3" class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {{ editingPlan ? 'Edit Travel Plan' : 'Create New Travel Plan' }}
                </DialogTitle>

                <form @submit.prevent="savePlan" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Plan Title</label>
                      <input 
                        v-model="form.title" 
                        type="text" 
                        required
                        placeholder="e.g. Coastal Explorer Package"
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">City</label>
                      <select 
                        v-model.number="form.city_id" 
                        required
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                      >
                        <option :value="null" disabled>Select a city</option>
                        <option v-for="city in cities" :key="city?.id" :value="city?.id">
                          {{ city?.city_name }}{{ city?.country ? `, ${city.country.country_name}` : '' }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Primary Activity</label>
                      <select 
                        v-model.number="form.activity_id" 
                        required
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                      >
                        <option :value="null" disabled>Select an activity</option>
                        <option v-for="act in activities" :key="act?.id" :value="act?.id">
                          {{ act?.activity_name }}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Price ($)</label>
                      <input 
                        v-model.number="form.price" 
                        type="number" 
                        step="0.01" 
                        required
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Status</label>
                      <select 
                        v-model="form.is_active"
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option :value="true">Active</option>
                        <option :value="false">Draft</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Travel From</label>
                      <input 
                        v-model="form.day_from" 
                        type="date" 
                        required
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label class="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Travel To</label>
                      <input 
                        v-model="form.day_to" 
                        type="date" 
                        required
                        class="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div class="mt-8 flex justify-end gap-3">
                    <button 
                      type="button" 
                      @click="closeModal"
                      class="px-6 py-3 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      :disabled="saving"
                      class="inline-flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span v-if="saving">Saving...</span>
                      <span v-else>{{ editingPlan ? 'Update Plan' : 'Create Plan' }}</span>
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="isDeleteModalOpen" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-50">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-3xl bg-white dark:bg-gray-900 p-8 text-center align-middle shadow-2xl transition-all border border-gray-100 dark:border-gray-800">
                <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
                  <ExclamationTriangleIcon class="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle as="h3" class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Delete Travel Plan?
                </DialogTitle>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">
                  Are you sure you want to delete "{{ planToDelete?.title }}"?
                </p>

                <div class="flex gap-3">
                  <button 
                    @click="closeDeleteModal"
                    class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="deletePlan"
                    :disabled="deleting"
                    class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 dark:shadow-none transition-all"
                  >
                    {{ deleting ? 'Deleting' : 'Yes, Delete' }}
                  </button>
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
import { ref, onMounted } from 'vue';
import api from '../services/api';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline';

const plans = ref([]);
const cities = ref([]);
const activities = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const editingPlan = ref(null);
const saving = ref(false);

const isDeleteModalOpen = ref(false);
const planToDelete = ref(null);
const deleting = ref(false);

const form = ref({
  title: '',
  city_id: null,
  activity_id: null,
  price: 0,
  day_from: '',
  day_to: '',
  is_active: true,
});

const fetchPlans = async () => {
  try {
    loading.value = true;
    const res = await api.get('/destination');
    // Robust extraction: Handle data.data.data (paginated), data.data, or data
    const rawData = res.data?.data?.data || res.data?.data || res.data || [];
    plans.value = Array.isArray(rawData) ? rawData : [];
  } catch (err) {
    console.error('Failed to fetch plans', err);
  } finally {
    loading.value = false;
  }
};

const fetchCities = async () => {
  try {
    const res = await api.get('/cities');
    const rawData = res.data?.data || res.data || [];
    cities.value = Array.isArray(rawData) ? rawData.filter(c => c && typeof c === 'object') : [];
  } catch (err) {
    console.error('Failed to fetch cities', err);
  }
};

const fetchActivities = async () => {
  try {
    const res = await api.get('/activities');
    const rawData = res.data?.data || res.data || [];
    activities.value = Array.isArray(rawData) ? rawData.filter(a => a && typeof a === 'object') : [];
  } catch (err) {
    console.error('Failed to fetch activities', err);
  }
};

const openCreateModal = () => {
  editingPlan.value = null;
  form.value = {
    title: '',
    city_id: null,
    activity_id: null,
    price: 0,
    day_from: '',
    day_to: '',
    is_active: true,
  };
  isModalOpen.value = true;
};

const editPlan = (plan) => {
  editingPlan.value = plan;
  form.value = {
    title: plan.title,
    city_id: plan.city?.id || plan.city_id,
    activity_id: plan.activity?.id || plan.activity_id,
    price: plan.price,
    day_from: plan.day_from,
    day_to: plan.day_to,
    is_active: plan.is_active,
  };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingPlan.value = null;
};

const savePlan = async () => {
  try {
    saving.value = true;
    if (editingPlan.value) {
      await api.put(`/destination/${editingPlan.value.id}`, form.value);
    } else {
      await api.post('/destination', form.value);
    }
    await fetchPlans();
    closeModal();
  } catch (err) {
    console.error('Failed to save plan', err);
    alert('Failed to save plan: ' + (err.response?.data?.message || err.message));
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (plan) => {
  planToDelete.value = plan;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  planToDelete.value = null;
};

const deletePlan = async () => {
  if (!planToDelete.value) return;
  try {
    deleting.value = true;
    await api.delete(`/destination/${planToDelete.value.id}`);
    await fetchPlans();
    closeDeleteModal();
  } catch (err) {
    console.error('Failed to delete plan', err);
    alert('Failed to delete plan');
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchPlans();
  fetchCities();
  fetchActivities();
});
</script>
