<template>
	<section class="bar-matteotti-card" :class="{ 'has-editor': isDev }">
		<aside v-if="isDev" class="editor-panel">
			<p class="editor-label">Editor (solo sviluppo)</p>
			<label>
				Nome e cognome affiliato
				<input v-model="name" type="text" placeholder="..." />
			</label>
			<label>
				Ruolo
				<input v-model="role" type="text" placeholder="..." />
			</label>
			<label>
				Codice
				<input v-model="code" type="text" placeholder="..." />
			</label>
		</aside>

		<div class="poster">
			<div class="poster-frame">
				<span class="poster-shine" aria-hidden="true"></span>
				<div class="brand-badge">
					<img src="/src/assets/logo-bar.jpeg" class="brand-badge-logo" alt="Bar Pasticceria Matteotti" />
				</div>
				<Logo class="team-logo" bg-color="transparent" primary="white" />
			</div>

			<span class="team-name font-raptus">TEAM RAPTUS</span>
			<div class="affiliate-block">
				<p class="line"><span class="label font-raptus">AFFILIATO</span> {{ name }}</p>
				<p class="line"><span class="label font-raptus">RUOLO</span> {{ role }}</p>
				<p class="line"><span class="label font-raptus">CODICE</span> {{ code }}</p>
				<p class="line small">Sconto 20% su tutto, fino al 30 Settembre 2026</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'
import Logo from '../components/logo.vue'

const isDev = import.meta.env.DEV

interface CardData {
	name: string
	role: string
	code: string
}

const DEFAULTS: CardData = { name: 'XXX', role: 'XXX', code: 'XXX' }

// Fields are joined with "|" into a simple delimited text, then base64url-encoded,
// so the query string only ever exposes one short "d" param instead of the raw values.
const FIELD_SEPARATOR = '|'

function sanitize(value: string): string {
	return value.replaceAll(FIELD_SEPARATOR, ' ')
}

function encode(data: CardData): string {
	const text = [data.name, data.role, data.code].map(sanitize).join(FIELD_SEPARATOR)
	const bytes = new TextEncoder().encode(text)
	let binary = ''
	bytes.forEach(byte => binary += String.fromCharCode(byte))
	return btoa(binary)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '')
}

function decode(value: unknown): CardData {
	if (typeof value !== 'string' || !value) return { ...DEFAULTS }
	try {
		const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
		const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
		const bytes = Uint8Array.from(atob(padded), char => char.charCodeAt(0))
		const [name, role, code] = new TextDecoder().decode(bytes).split(FIELD_SEPARATOR)
		return {
			name: name || DEFAULTS.name,
			role: role || DEFAULTS.role,
			code: code || DEFAULTS.code,
		}
	}
	catch {
		return { ...DEFAULTS }
	}
}

// Single query string parameter, e.g. #/bar-matteotti-card?d=THVjYSBSb3NzaXxQaWxvdGE
const params = useUrlSearchParams('hash', {
	initialValue: { d: encode(DEFAULTS) },
})

// Read the encoded value from the query string first, exposed as 3 individually
// editable fields that stay in sync with the "d" param whenever they change.
const data = computed<CardData>({
	get: () => decode(params.d),
	set: value => { params.d = encode(value) },
})

const name = computed({
	get: () => data.value.name,
	set: (value: string) => { data.value = { ...data.value, name: value } },
})
const role = computed({
	get: () => data.value.role,
	set: (value: string) => { data.value = { ...data.value, role: value } },
})
const code = computed({
	get: () => data.value.code,
	set: (value: string) => { data.value = { ...data.value, code: value } },
})
</script>

<style lang="scss">
:root {
	--bordeaux: #590d18;
	--bordeaux-light: #7a1122;
	--pico-background-color: linear-gradient(180deg, var(--bordeaux-light) 0%, var(--bordeaux) 45%, #5c0c19 100%);
}
body > main.matteotti-card {
	background: var(--bordeaux);
	padding: 0;
	height: 100vh;
	overflow: auto;
}

.bar-matteotti-card {
	display: grid;
	justify-content: center;
	gap: var(--pico-spacing);
	max-width: 84rem;
	margin: 0 auto;
	padding: 0;
}

.editor-panel {
	display: grid;
	align-content: start;
	gap: .85rem;
	padding: var(--pico-spacing);
	border-radius: 1rem;
	background: color-mix(in srgb, #fff 4%, #000 96%);
	border: 1px solid color-mix(in srgb, white 40%, #000 60%);

	.editor-label {
		margin: 0 0 .25rem;
		text-transform: uppercase;
		letter-spacing: .12em;
		font-size: .75rem;
		color: white;
	}

	label {
		display: grid;
		gap: .35rem;
		font-weight: 600;
		font-size: .9rem;
	}

	input {
		background: rgba(255, 255, 255, .08);
		border-color: color-mix(in srgb, white 35%, #fff 65%);
		color: white;
	}
}

.poster {
	width: min(100%, 430px);
	aspect-ratio: 9 / 16;
	border-radius: var(--pico-spacing);
	padding: var(--pico-spacing);
	display: flex;
	flex-direction: column;
	gap: calc(var(--pico-spacing) / 1.5);
}

.poster-frame {
	position: relative;
	flex: 1 1 auto;
	border-radius: 1.1rem;
	border: 4px solid color-mix(in srgb, #fff 62%, transparent 38%);
	background:
		radial-gradient(circle at 30% 16%, rgba(255, 255, 255, .06), transparent 34%),
		linear-gradient(180deg, rgba(122, 16, 33, .5), rgba(92, 12, 25, .55));
	box-shadow:
		inset 0 2px 0 rgba(255, 255, 255, .6),
		inset 0 0 2.5rem rgba(255, 255, 255, .1),
		inset 0 -1.5rem 2.5rem rgba(0, 0, 0, .18),
		0 0 1.5rem rgba(255, 255, 255, .15);
	overflow: hidden;
	padding: clamp(1.25rem, 5vw, 2rem) 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: clamp(1.5rem, 6vw, 2.75rem);

	&::before {
		content: "";
		position: absolute;
		inset: 0;
		background: linear-gradient(160deg, rgba(255, 255, 255, .28) 0%, rgba(255, 255, 255, .08) 20%, transparent 40%);
		mix-blend-mode: screen;
		pointer-events: none;
	}
}

.poster-shine {
	position: absolute;
	inset: 0;
	pointer-events: none;
	mix-blend-mode: screen;
	background:
		linear-gradient(135deg,
			transparent 2%,
			rgba(255, 255, 255, .95) 6% 7.6%,
			rgba(255, 255, 255, .4) 7.8% 9.4%,
			transparent 9.8% 13%,
			rgba(255, 255, 255, .7) 13.2% 14.6%,
			transparent 15%);
}

.brand-badge {
	width: min(65%, 15rem);
	aspect-ratio: 1;
	border-radius: 50%;
	display: grid;
	place-items: center;
	overflow: hidden;

	.brand-badge-logo {
		width: 100%;
		height: auto;
	}
}

.team-logo {
	width: min(40%, 9rem);
	height: auto;
}
.team-name {
	text-align: center;
	font-size: 1.8rem;
	font-weight: 800;
	color: white;
}
.affiliate-block {
	text-align: center;
	padding-inline: .35rem;

	p, span {
		color: white;
	}
	.line {
		margin: 0 0 1rem 0;
		font-size: 1.5rem;
		font-weight: 300;
		line-height: 1.3;
		text-transform: uppercase;

		&.small {
			font-size: .7rem;
			font-weight: 300;
			text-transform: none;
		}
	}
	.label {
		font-size: 50%;
		font-weight: 300;
		display: block;
	}
}

@media screen and (min-width: 900px) {
	.bar-matteotti-card.has-editor {
		grid-template-columns: minmax(18rem, 24rem) auto;
		justify-content: start;
		align-items: start;
	}
}

@media screen and (max-width: 899px) {
	.bar-matteotti-card {
		padding-inline: .75rem;
	}
}
</style>
