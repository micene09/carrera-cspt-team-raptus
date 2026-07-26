<template>
	<RouterView v-slot="{ Component, route }">
		<header v-if="route.path !== '/bar-matteotti-card'" id="title" class="title-bar">
			<h3 class="title">Team Raptus App</h3>
			<span class="tools">
				<ThemeSwitch />
				<GitHubRepo :href="repoUrl" class="contrast" />
			</span>
		</header>
		<main :class="{
			page: route.path !== '/bar-matteotti-card',
			'matteotti-card': route.path === '/bar-matteotti-card'
		}">
			<component :is="Component" />
		</main>
	</RouterView>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GitHubRepo from './components/github-repo.vue'
import ThemeSwitch from './components/theme-switch.vue'

const repoUrl = ref('https://github.com/micene09/carrera-cspt-team-raptus')
</script>
