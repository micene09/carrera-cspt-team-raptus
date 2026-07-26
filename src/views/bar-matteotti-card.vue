<template>
	<section class="bar-matteotti-card" :class="{ 'has-editor': isDev }">
		<aside v-if="isDev" class="editor-panel">
			<p class="editor-label">Editor (solo sviluppo)</p>
			<label>
				Nome e cognome affiliato
				<input v-model="params.name" type="text" placeholder="..." />
			</label>
			<label>
				Ruolo
				<input v-model="params.role" type="text" placeholder="..." />
			</label>
			<label>
				Codice
				<input v-model="params.code" type="text" placeholder="..." />
			</label>
		</aside>

		<div class="poster">
			<div class="poster-frame">
				<span class="poster-shine" aria-hidden="true"></span>
				<!-- Placeholder for the sponsor bar logo: swap with the real artwork asset when available -->
				<div class="brand-badge">
					<Logo class="brand-badge-logo" bg-color="white" primary="#6e0f1e" />
				</div>
				<Logo class="team-logo" bg-color="transparent" primary="white" />
			</div>

			<span class="team-name">TEAM RAPTUS</span>
			<div class="affiliate-block">
				<p class="line"><span class="label">AFFILIATO</span> {{ params.name }}</p>
				<p class="line"><span class="label">RUOLO</span> {{ params.role }}</p>
				<p class="line"><span class="label">CODICE</span> {{ params.code }}</p>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useUrlSearchParams } from '@vueuse/core'
import Logo from '../components/logo.vue'

const isDev = import.meta.env.DEV

// Read the 3 editable values from the query string on load, and keep them in sync afterwards.
const params = useUrlSearchParams('hash', {
	initialValue: {
		name: 'XXX',
		role: 'XXX',
		code: 'XXX',
	},
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
	padding-block: var(--pico-spacing);
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
	border: 4px solid color-mix(in srgb, #fff 30%, transparent 70%);
	background:
		radial-gradient(circle at 30% 16%, rgba(255, 255, 255, .06), transparent 34%),
		linear-gradient(180deg, rgba(122, 16, 33, .5), rgba(92, 12, 25, .55));
	overflow: hidden;
	padding: clamp(1.25rem, 5vw, 2rem) 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: clamp(1.5rem, 6vw, 2.75rem);
}

.poster-shine {
	position: absolute;
	inset: 0;
	pointer-events: none;
	background:
		linear-gradient(135deg, transparent 4%, rgba(255, 255, 255, .55) 6% 7.4%, transparent 7.6% 10.4%, rgba(255, 255, 255, .3) 10.6% 11.6%, transparent 12%);
}

.brand-badge {
	width: min(65%, 15rem);
	aspect-ratio: 1;
	border-radius: 50%;
	background: white;
	display: grid;
	place-items: center;
	padding: 12%;
	box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--bordeaux) 25%, transparent 75%);

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
	font-size: 1.5rem;
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
		margin: 0 0 .5rem 0;
		font-size: 1.2rem;
		line-height: 1.5;
		text-transform: uppercase;
	}
	.label {
		font-size: 50%;
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
