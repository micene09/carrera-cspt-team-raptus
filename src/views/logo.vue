<template>
	<section class="logo-lab">
		<div class="form" id="form">
			<ColorPicker label="Background" v-model="bgColor" />
			<ColorPicker label="Primary" v-model="primary" />
			<fieldset role="group">
				<button class="outline" @click="onClickRandomColors">Random</button>
				<button class="outline" :data-tooltip="copiedTooltip" @click="share">Share</button>
			</fieldset>
			<label>Save as</label>
			<fieldset role="group">
				<FormatPicker label="&nbsp;" v-model="format" />
				<button @click="download">Save</button>
			</fieldset>
			<ResolutionPicker v-if="format === 'PNG'" v-model:w="width" v-model:h="height" />
		</div>
		<div class="logo-wrapper" id="preview" :style="{ background: bgColor }" :aria-busy="loadingDebounced">
			<template v-if="!loadingDebounced">
				<Logo class="logo"
					:bgColor="bgColor"
					:primary="primary"
				/>
			</template>
		</div>
	</section>
	<div id="printArea" class="print-area" ref="printArea" :style="{
			background: bgColor,
			width: width + 'px',
			height: height + 'px'
	}">
		<Logo class="logo"
			:bgColor="bgColor"
			:primary="primary"
		/>
	</div>
</template>

<style lang="scss" scoped>
	#preview,
	.print-area {
		padding: 4rem;
		display: grid;
		align-items: center;
	}
	.logo-lab {
		display: grid;
		grid-template-areas:
			"p p"
			"f f";
		grid-template-rows: 20rem auto;
		#preview {
			grid-area: p;
			padding: var(--pico-spacing);
			text-align: center;
			> svg {
				height: 100%;
				width: 100%;
			}
			@media screen and (min-width: 900px) {
				border: var(--pico-border-width) solid var(--pico-form-element-border-color);
				border-radius: var(--pico-border-radius);
			}
		}
		#form {
			grid-area: f;
			padding-left: var(--pico-spacing);
			padding-right: var(--pico-spacing);
		}
		@media screen and (min-width: 900px) {
			grid-template-areas:
				"f p";
			grid-template-columns: 1fr 1fr;
			grid-template-rows: max-content max-content;
			#title, #form {
				padding: 0;
			}
			#preview {
				display: grid;
				align-items: center;
			}
		}
	}
	.print-area {
		position: absolute;
		top: -9999px;
	}
</style>

<script lang="ts">
import { ref, defineComponent, onMounted, useTemplateRef, watch } from "vue"
import { toPng, toSvg } from 'html-to-image'
import ColorScheme from "../color-scheme"
import Logo from "../components/logo.vue"
import ColorPicker from "../components/color-picker.vue"
import FormatPicker from "../components/format-picker.vue"
import ResolutionPicker from "../components/resolution-picker.vue"
import { refAutoReset, refDebounced, useClipboard, useDark, useShare } from "@vueuse/core"

export type Preset = {
	bgColor: string
	primary: string
}

export default defineComponent({
	components: {
		Logo,
		ColorPicker,
		FormatPicker,
		ResolutionPicker,
	},
	setup() {
		const loading = ref(true)
		const loadingDebounced = refDebounced(loading, 300)
		const copiedTooltip = refAutoReset<string | undefined>(undefined, 2500)
		const printArea = useTemplateRef<HTMLDivElement>("printArea")
		const isDark = useDark({
			selector: "html",
			attribute: "data-theme",
			valueDark: 'dark',
			valueLight: 'light'
		})
		const primary = ref(isDark.value ? "#ffffff" : "#691722")
		const bgColor = ref(isDark.value ? "#691722" : "#ffffff")
		const format = ref<"PNG" | "SVG">("PNG")
		const width = ref(1000)
		const height = ref(1000)

		function getPresetObject(): Preset {
			return {
				primary: primary.value,
				bgColor: bgColor.value,
			}
		}

		async function download() {
			const style = { position: "static" }
			const dataUrl = format.value === "PNG"
				? await toPng(printArea.value!, { width: width.value, height: height.value, style })
				: await toSvg(printArea.value!)
			const link = document.createElement('a')
			link.download = 'carrera-cspt-team-raptus.' + format.value.toLowerCase()
			link.href = dataUrl
			link.click()
		}

		function share() {
			const preset = getPresetObject()
			const searchParams = new URLSearchParams(preset)

			const { share, isSupported } = useShare()
			const url = new URL(location.href.split("?")[0] + "?" + searchParams.toString())
			if (isSupported.value) {
				share({
					title: `Team Raptus Logo - Primary ${primary.value}; Background ${bgColor.value}`,
					url: url.href,
				})
			}
			else {
				const { copy } = useClipboard()
				copy(url.toString())
				copiedTooltip.value = "Link copied"
			}
		}

		function onClickRandomColors() {
			const colors = new ColorScheme()
				.from_hue(Math.random() * 10000)
				.scheme('contrast')
				.variation('default')
				.colors()
			primary.value = '#' + colors.at(0)
			bgColor.value = '#' + colors.at(-1)
		}

		function onThemeChange(theme: "dark" | "light") {
			if (theme === "light") {
				if (bgColor.value === "#ffffff") {
					primary.value = "#ffffff"
					bgColor.value = "#691722"
				}
			}
			else {
				if (primary.value === "#691722" && theme === "dark") {
					bgColor.value = "#ffffff"
				}
			}
		}

		watch(isDark, value => {
			onThemeChange(value ? 'dark' : 'light')
		}, { immediate: true })

		onMounted(() => {
			const url = new URL(location.href)
			if (!url.search) return loading.value = false
			const params = url.searchParams
			const queryStringPreset: Partial<Preset> = {
				bgColor: params.get("bgColor") ?? "",
				primary: params.get("primary") ?? "",
			}
			bgColor.value = queryStringPreset.bgColor ?? "transparent"
			primary.value = queryStringPreset.primary ?? "transparent"
			if (primary.value === "transparent") onClickRandomColors()
			loading.value = false
		})

		return {
			loading,
			loadingDebounced,
			onClickRandomColors,
			printArea,
			bgColor,
			primary,
			format,
			width,
			height,
			share,
			copiedTooltip,
			download,
			onThemeChange,
		}
	},
})
</script>
