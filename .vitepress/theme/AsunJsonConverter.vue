<script setup lang="ts">
import { ref, computed } from 'vue'
import { encode, encodeTyped, encodePretty, encodePrettyTyped, decode } from '@athanx/asun'

type Direction = 'json2asun' | 'asun2json'

const direction = ref<Direction>('json2asun')
const typedAsun = ref(false)
const prettyAsun = ref(false)
const input = ref('')
const output = ref('')
const error = ref('')

const sampleJson = `[
  { "id": 1, "name": "Alice", "score": 9.5, "active": true },
  { "id": 2, "name": "Bob", "score": 7.25, "active": false }
]`

function loadSample() {
  direction.value = 'json2asun'
  input.value = sampleJson
  convert()
}

function convert() {
  error.value = ''
  output.value = ''
  const src = input.value.trim()
  if (!src) return

  try {
    if (direction.value === 'json2asun') {
      const obj = JSON.parse(src)
      if (prettyAsun.value) {
        output.value = typedAsun.value ? encodePrettyTyped(obj) : encodePretty(obj)
      } else {
        output.value = typedAsun.value ? encodeTyped(obj) : encode(obj)
      }
    } else {
      const obj = decode(src)
      output.value = JSON.stringify(obj, null, 2)
    }
  } catch (e: any) {
    error.value = e.message || String(e)
  }
}

function swap() {
  const old = output.value || input.value
  direction.value = direction.value === 'json2asun' ? 'asun2json' : 'json2asun'
  input.value = old
  output.value = ''
  error.value = ''
}

function copyOutput() {
  if (output.value) {
    navigator.clipboard.writeText(output.value)
  }
}

function clearAll() {
  input.value = ''
  output.value = ''
  error.value = ''
}

const inputLabel = computed(() =>
  direction.value === 'json2asun' ? 'JSON' : 'ASUN'
)
const outputLabel = computed(() =>
  direction.value === 'json2asun' ? 'ASUN' : 'JSON'
)

const countNoSpace = (s: string) => s.replace(/\s/g, '').length
const inputChars = computed(() => countNoSpace(input.value))
const outputChars = computed(() => countNoSpace(output.value))
</script>

<template>
  <div class="converter-root">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn btn-primary" @click="convert">Convert</button>
        <button class="btn" @click="swap" title="Swap direction">⇄ Swap</button>
        <button class="btn" @click="loadSample">Sample</button>
        <button class="btn" @click="clearAll">Clear</button>
      </div>
      <div class="toolbar-right">
        <label class="toggle-label">
          <input type="checkbox" v-model="typedAsun" />
          <span>Typed</span>
        </label>
        <label class="toggle-label">
          <input type="checkbox" v-model="prettyAsun" />
          <span>Pretty</span>
        </label>
        <span class="direction-badge">{{ inputLabel }} → {{ outputLabel }}</span>
      </div>
    </div>

    <!-- Editor panels -->
    <div class="panels">
      <div class="panel">
        <div class="panel-header">{{ inputLabel }} <span class="char-count">{{ inputChars }} chars</span></div>
        <textarea
          v-model="input"
          class="editor"
          :placeholder="`Paste ${inputLabel} here…`"
          spellcheck="false"
          @keydown.ctrl.enter="convert"
          @keydown.meta.enter="convert"
        />
      </div>
      <div class="panel">
        <div class="panel-header">
          {{ outputLabel }} <span class="char-count">{{ outputChars }} chars</span>
          <button v-if="output" class="btn-copy" @click="copyOutput" title="Copy">📋</button>
        </div>
        <textarea
          :value="output"
          class="editor output"
          readonly
          placeholder="Result will appear here…"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-bar">{{ error }}</div>
  </div>
</template>

<style scoped>
.converter-root {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 130px);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 0.875rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-mute);
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}
.btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  user-select: none;
}

.direction-badge {
  font-size: 0.8rem;
  padding: 3px 10px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  flex: 1;
}

@media (max-width: 768px) {
  .panels {
    grid-template-columns: 1fr;
  }
}

.panel {
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
  margin-bottom: 0.35rem;
}

.char-count {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  text-transform: none;
  letter-spacing: 0;
}

.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  padding: 0;
  line-height: 1;
}

.editor {
  width: 100%;
  flex: 1;
  min-height: 300px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  resize: vertical;
  tab-size: 2;
}

.editor:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.editor.output {
  background: var(--vp-c-bg-alt);
}

.error-bar {
  margin-top: 0.75rem;
  padding: 10px 14px;
  border-radius: 6px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font-size: 0.85rem;
  font-family: var(--vp-font-family-mono);
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
