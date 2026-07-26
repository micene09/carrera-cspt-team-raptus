<template>
	<section class="home">
		<RouterLink to="/logo" role="button">Logo</RouterLink>
		<RouterLink to="/bar-matteotti-card" role="button">Bar Matteotti Card</RouterLink>
	</section>
</template>
<style lang="scss" scoped>
	.home {
		display: grid;
		gap: var(--pico-spacing);
		gap: var(--pico-spacing);
		grid-template-columns: 1fr;

		@media screen and (min-width: 900px) {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
