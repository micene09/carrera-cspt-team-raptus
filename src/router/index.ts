import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'
import LogoView from '../views/logo.vue'
import BarMatteottiCardView from '../views/bar-matteotti-card.vue'

const router = createRouter({
	history: createWebHistory('/carrera-cspt-team-raptus/'),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView,
		},
		{
			path: '/logo',
			name: 'logo',
			component: LogoView,
		},
		{
			path: '/bar-matteotti-card',
			name: 'bar-matteotti-card',
			component: BarMatteottiCardView,
		},
	],
})

export default router
