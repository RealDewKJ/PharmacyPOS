<template>
  <div class="min-h-screen bg-background">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-foreground">Prescriptions</h1>
        <p class="text-muted-foreground">Manage prescription orders and refills</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Total Prescriptions</p>
              <p class="text-2xl font-bold text-foreground">89</p>
            </div>
            <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FileTextIcon class="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Pending</p>
              <p class="text-2xl font-bold text-foreground">12</p>
            </div>
            <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
              <ClockIcon class="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Ready for Pickup</p>
              <p class="text-2xl font-bold text-foreground">8</p>
            </div>
            <div class="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon class="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
        <Card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-muted-foreground">Refills Due</p>
              <p class="text-2xl font-bold text-foreground">5</p>
            </div>
            <div class="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircleIcon class="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>
      </div>

      <!-- Search and Add Prescription -->
      <Card class="p-6 mb-8">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex flex-col md:flex-row gap-4 flex-1">
            <Input 
              v-model="searchQuery" 
              placeholder="Search prescriptions..." 
              class="max-w-md"
            />
            <select v-model="statusFilter" class="p-2 border border-input rounded-md bg-background text-foreground">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="ready">Ready for Pickup</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Input 
              type="date" 
              v-model="dateFilter" 
              class="max-w-md"
            />
          </div>
          <Button @click="showAddPrescription = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Add Prescription
          </Button>
        </div>
      </Card>

      <!-- Prescriptions Table -->
      <Card class="p-6">
        <CardHeader>
          <CardTitle>Prescription List</CardTitle>
          <CardDescription>All prescription orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-border">
                  <th class="text-left p-3 font-medium text-foreground">Rx Number</th>
                  <th class="text-left p-3 font-medium text-foreground">Patient</th>
                  <th class="text-left p-3 font-medium text-foreground">Medication</th>
                  <th class="text-left p-3 font-medium text-foreground">Doctor</th>
                  <th class="text-left p-3 font-medium text-foreground">Status</th>
                  <th class="text-left p-3 font-medium text-foreground">Date</th>
                  <th class="text-left p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prescription in filteredPrescriptions" :key="prescription.id" class="border-b border-border hover:bg-muted/50">
                  <td class="p-3">
                    <span class="font-medium text-foreground">#{{ prescription.rxNumber }}</span>
                  </td>
                  <td class="p-3">
                    <div>
                      <div class="font-medium text-foreground">{{ prescription.patient }}</div>
                      <div class="text-sm text-muted-foreground">{{ prescription.patientPhone }}</div>
                    </div>
                  </td>
                  <td class="p-3">
                    <div>
                      <div class="font-medium text-foreground">{{ prescription.medication }}</div>
                      <div class="text-sm text-muted-foreground">{{ prescription.dosage }}</div>
                    </div>
                  </td>
                  <td class="p-3 text-foreground">{{ prescription.doctor }}</td>
                  <td class="p-3">
                    <span :class="[
                      'px-2 py-1 rounded-md text-sm font-medium',
                      prescription.status === 'ready' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 
                      prescription.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 
                      prescription.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                      prescription.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400' : 
                      'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    ]">
                      {{ prescription.status }}
                    </span>
                  </td>
                  <td class="p-3 text-muted-foreground">{{ prescription.date }}</td>
                  <td class="p-3">
                    <div class="flex items-center gap-2">
                      <Button size="sm" variant="outline" @click="viewPrescription(prescription)">
                        <EyeIcon class="h-4 w-4" />
                      </Button>
                                             <Button size="sm" variant="outline" @click="editPrescription(prescription)">
                         <Edit class="h-4 w-4" />
                       </Button>
                      <Button size="sm" variant="outline" @click="processPrescription(prescription.id)">
                        <PlayIcon class="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" @click="printLabel(prescription)">
                        <PrinterIcon class="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <!-- Add Prescription Modal -->
      <div v-if="showAddPrescription" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Add New Prescription</CardTitle>
            <CardDescription>Enter prescription information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">Patient Name</label>
                <Input v-model="newPrescription.patient" placeholder="Enter patient name" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Patient Phone</label>
                <Input v-model="newPrescription.patientPhone" placeholder="Enter phone number" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">Medication</label>
                <Input v-model="newPrescription.medication" placeholder="Enter medication name" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Dosage</label>
                <Input v-model="newPrescription.dosage" placeholder="e.g., 500mg twice daily" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-foreground">Doctor</label>
                <Input v-model="newPrescription.doctor" placeholder="Enter doctor name" />
              </div>
              <div>
                <label class="text-sm font-medium text-foreground">Quantity</label>
                <Input v-model="newPrescription.quantity" type="number" placeholder="Enter quantity" />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-foreground">Instructions</label>
              <textarea 
                v-model="newPrescription.instructions" 
                class="w-full p-2 border border-input rounded-md bg-background text-foreground resize-none"
                rows="3"
                placeholder="Enter special instructions"
              ></textarea>
            </div>
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="showAddPrescription = false">Cancel</Button>
              <Button @click="addPrescription">Add Prescription</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Prescription Details Modal -->
      <div v-if="selectedPrescription" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Prescription Details - #{{ selectedPrescription.rxNumber }}</CardTitle>
            <CardDescription>Complete prescription information</CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground">Patient</label>
                <p class="text-foreground">{{ selectedPrescription.patient }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Phone</label>
                <p class="text-foreground">{{ selectedPrescription.patientPhone }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Doctor</label>
                <p class="text-foreground">{{ selectedPrescription.doctor }}</p>
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground">Date</label>
                <p class="text-foreground">{{ selectedPrescription.date }}</p>
              </div>
            </div>
            
            <div>
              <label class="text-sm font-medium text-muted-foreground">Medication</label>
              <div class="mt-2 p-3 bg-muted rounded-md">
                <p class="font-medium text-foreground">{{ selectedPrescription.medication }}</p>
                <p class="text-sm text-muted-foreground">{{ selectedPrescription.dosage }}</p>
                <p class="text-sm text-muted-foreground mt-1">{{ selectedPrescription.instructions }}</p>
              </div>
            </div>
            
            <div class="flex gap-2 justify-end">
              <Button variant="outline" @click="selectedPrescription = null">Close</Button>
              <Button @click="printLabel(selectedPrescription)">
                <PrinterIcon class="h-4 w-4 mr-2" />
                Print Label
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlusIcon,
  EyeIcon,
  Edit,
  PlayIcon,
  PrinterIcon
} from 'lucide-vue-next'

import Card from '../components/ui/card.vue'
import CardHeader from '../components/ui/card-header.vue'
import CardContent from '../components/ui/card-content.vue'
import CardTitle from '../components/ui/card-title.vue'
import CardDescription from '../components/ui/card-description.vue'
import Input from '../components/ui/input.vue'
import Button from '../components/ui/button.vue'

// Mock data - replace with actual API calls
const prescriptions = ref([
  {
    id: 'P001',
    rxNumber: 'RX2024001',
    patient: 'John Doe',
    patientPhone: '+1 (555) 123-4567',
    medication: 'Lisinopril 10mg',
    dosage: '1 tablet daily',
    doctor: 'Dr. Sarah Johnson',
    status: 'ready',
    date: '2024-01-15',
    quantity: 30,
    instructions: 'Take in the morning with food'
  },
  {
    id: 'P002',
    rxNumber: 'RX2024002',
    patient: 'Jane Smith',
    patientPhone: '+1 (555) 987-6543',
    medication: 'Metformin 500mg',
    dosage: '1 tablet twice daily',
    doctor: 'Dr. Michael Brown',
    status: 'processing',
    date: '2024-01-14',
    quantity: 60,
    instructions: 'Take with meals to reduce stomach upset'
  },
  {
    id: 'P003',
    rxNumber: 'RX2024003',
    patient: 'Mike Johnson',
    patientPhone: '+1 (555) 456-7890',
    medication: 'Atorvastatin 20mg',
    dosage: '1 tablet at bedtime',
    doctor: 'Dr. Emily Davis',
    status: 'pending',
    date: '2024-01-13',
    quantity: 30,
    instructions: 'Take at bedtime for best results'
  }
])

const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const showAddPrescription = ref(false)
interface Prescription {
  id: string
  rxNumber: string
  patient: string
  patientPhone: string
  medication: string
  dosage: string
  doctor: string
  status: string
  date: string
  quantity: number
  instructions: string
}

const selectedPrescription = ref<Prescription | null>(null)
const newPrescription = ref({
  patient: '',
  patientPhone: '',
  medication: '',
  dosage: '',
  doctor: '',
  quantity: '',
  instructions: ''
})

const filteredPrescriptions = computed(() => {
  let filtered = prescriptions.value
  
  if (searchQuery.value) {
    filtered = filtered.filter(prescription =>
      prescription.rxNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prescription.patient.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    filtered = filtered.filter(prescription => prescription.status === statusFilter.value)
  }
  
  if (dateFilter.value) {
    filtered = filtered.filter(prescription => prescription.date === dateFilter.value)
  }
  
  return filtered
})

const viewPrescription = (prescription: Prescription) => {
  selectedPrescription.value = prescription
}

const editPrescription = (prescription: Prescription) => {
  // Implement edit prescription
  console.log('Edit prescription:', prescription)
}

const processPrescription = (prescriptionId: string) => {
  // Implement process prescription
  console.log('Process prescription:', prescriptionId)
}

const printLabel = (prescription: Prescription) => {
  // Implement print label functionality
  console.log('Print label for prescription:', prescription.rxNumber)
}

const addPrescription = () => {
  if (newPrescription.value.patient && newPrescription.value.medication) {
    const prescription = {
      id: `P${String(prescriptions.value.length + 1).padStart(3, '0')}`,
      rxNumber: `RX${new Date().getFullYear()}${String(prescriptions.value.length + 1).padStart(3, '0')}`,
      patient: newPrescription.value.patient,
      patientPhone: newPrescription.value.patientPhone,
      medication: newPrescription.value.medication,
      dosage: newPrescription.value.dosage,
      doctor: newPrescription.value.doctor,
      quantity: parseInt(newPrescription.value.quantity) || 0,
      instructions: newPrescription.value.instructions,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    }
    prescriptions.value.push(prescription)
    newPrescription.value = { patient: '', patientPhone: '', medication: '', dosage: '', doctor: '', quantity: '', instructions: '' }
    showAddPrescription.value = false
  }
}
</script>
