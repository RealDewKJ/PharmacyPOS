<template>
  <Dialog :isOpen="isOpen" :title="title" :closeText="closeText" :showFooter="false" @close="handleClose">
    <div v-if="mode === 'open'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          เงินสดเริ่มต้น (Opening Cash)
        </label>
        <Input
          v-model.number="openingCash"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          class="w-full"
          @keyup.enter="handleOpen"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-foreground mb-2">
          หมายเหตุ (Notes) - ไม่บังคับ
        </label>
        <textarea
          v-model="notes"
          class="w-full p-2 border border-input rounded-md bg-background text-foreground"
          rows="3"
          placeholder="หมายเหตุเพิ่มเติม..."
        />
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button variant="outline" @click="handleClose">
          ยกเลิก
        </Button>
        <Button @click="handleOpen" :disabled="loading || openingCash < 0">
          <Loader2Icon v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
          เปิด POS Session
        </Button>
      </div>
    </div>

    <div v-else-if="mode === 'close'" class="space-y-4">
      <div v-if="summary" class="space-y-4">
        <div class="bg-muted/50 p-4 rounded-lg space-y-2">
          <h4 class="font-semibold text-foreground mb-3">สรุปยอดขาย</h4>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-muted-foreground">เปิดเมื่อ</p>
              <p class="font-medium text-foreground">
                {{ formatDateTime(session?.openedAt) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-muted-foreground">ปิดเมื่อ</p>
              <p class="font-medium text-foreground">
                {{ formatDateTime(session?.closedAt) }}
              </p>
            </div>
          </div>

          <div class="border-t border-border pt-3 mt-3 space-y-2">
            <div class="flex justify-between">
              <span class="text-foreground">ยอดขายรวม:</span>
              <span class="font-bold text-foreground">฿{{ formatNumber(summary.totalSales) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">จำนวน Transaction:</span>
              <span class="font-medium text-foreground">{{ summary.totalTransactions }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">เงินสด:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.totalCashSales) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">บัตรเครดิต/เดบิต:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.totalCardSales) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">โอนเงิน:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.totalBankTransferSales) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">ส่วนลด:</span>
              <span class="font-medium text-foreground">-฿{{ formatNumber(summary.totalDiscount) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">ภาษี:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.totalTax) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">เงินสดเริ่มต้น:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.openingCash) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-foreground">เงินสดที่คาดหวัง:</span>
              <span class="font-medium text-foreground">฿{{ formatNumber(summary.expectedCash) }}</span>
            </div>
            <div class="flex justify-between border-t border-border pt-2">
              <span class="text-foreground font-semibold">ส่วนต่าง:</span>
              <span 
                :class="[
                  'font-bold',
                  summary.difference >= 0 ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ summary.difference >= 0 ? '+' : '' }}฿{{ formatNumber(summary.difference) }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            เงินสดปิด (Closing Cash)
          </label>
          <Input
            v-model.number="closingCash"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            class="w-full"
            @keyup.enter="handleClose"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">
            หมายเหตุ (Notes) - ไม่บังคับ
          </label>
          <textarea
            v-model="notes"
            class="w-full p-2 border border-input rounded-md bg-background text-foreground"
            rows="3"
            placeholder="หมายเหตุเพิ่มเติม..."
          />
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <Button variant="outline" @click="handleCancel">
            ยกเลิก
          </Button>
          <Button @click="handleClose" :disabled="loading || closingCash < 0">
            <Loader2Icon v-if="loading" class="h-4 w-4 mr-2 animate-spin" />
            ปิด POS Session
          </Button>
        </div>
      </div>
      <div v-else class="text-center py-4">
        <Loader2Icon class="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p class="text-sm text-muted-foreground mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Dialog from './ui/dialog.vue'
import Input from './ui/input.vue'
import Button from './ui/button.vue'
import { Loader2Icon } from 'lucide-vue-next'
import { usePosSession, type PosSession, type SessionSummary } from '../composables/usePosSession'

interface Props {
  isOpen: boolean
  mode: 'open' | 'close'
  session?: PosSession | null
}

interface Emits {
  (e: 'close'): void
  (e: 'opened', session: PosSession): void
  (e: 'closed', session: PosSession): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { openSession, closeSession, getSessionSummary, loading } = usePosSession()

const openingCash = ref(0)
const closingCash = ref(0)
const notes = ref('')
const summary = ref<SessionSummary | null>(null)

const title = computed(() => {
  return props.mode === 'open' ? 'เปิด POS Session' : 'ปิด POS Session'
})

const closeText = computed(() => {
  return props.mode === 'open' ? 'ยกเลิก' : 'ปิด'
})

const formatNumber = (num: number) => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatDateTime = (dateString?: string | null) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    if (props.mode === 'close' && props.session) {
      // Load summary when opening close dialog
      try {
        summary.value = await getSessionSummary(props.session.id)
        closingCash.value = summary.value.expectedCash
      } catch (error) {
        console.error('Error loading summary:', error)
      }
    } else {
      openingCash.value = 0
      notes.value = ''
    }
  } else {
    // Reset when closing
    openingCash.value = 0
    closingCash.value = 0
    notes.value = ''
    summary.value = null
  }
})

const handleOpen = async () => {
  if (openingCash.value < 0) return
  
  try {
    const session = await openSession(openingCash.value, notes.value || undefined)
    if (session) {
      emit('opened', session)
      handleClose()
    }
  } catch (error) {
    console.error('Error opening session:', error)
    alert('ไม่สามารถเปิด session ได้ กรุณาลองอีกครั้ง')
  }
}

const handleClose = async () => {
  if (props.mode === 'close' && closingCash.value < 0) return
  
  try {
    const session = await closeSession(closingCash.value, notes.value || undefined)
    if (session) {
      emit('closed', session)
      emit('close')
    }
  } catch (error: any) {
    console.error('Error closing session:', error)
    alert(error.message || 'ไม่สามารถปิด session ได้ กรุณาลองอีกครั้ง')
  }
}

const handleCancel = () => {
  emit('close')
}
</script>

