import * as api from '../api.js'

const state = {
    
    abstractions: []
}


const mutations = {

	 'SET_ABSTRACTIONS': (state, data) => { state.abstractions = data },
	 'DELETE_ABSTRACTIONS': state => { state.abstractions = [] },
}


const actions = {


	getAbstractions(store, intid) {
		return api.fetchAbstractions(intid)
		   .then(response => store.commit("SET_ABSTRACTIONS", response.data))
		   .catch(error => store.commit('API_FAIL', error))		
	},


	newAbstraction(store, params) {
		return api.postAbstraction(params)
			.then(() => store.dispatch('getAbstractions', params.intid))
			.catch(error => store.commit('API_FAIL', error))
	},

	connectCodes(store, params) {
		return api.postCodeConnection(params)
			.then(() => store.dispatch('getAbstractions', params.intid))
			.catch(error => store.commit('API_FAIL', error))
	},

	deleteSelectedConnections(store, {intid, ids}){
		var promises = ids.map(n => api.deleteCodeConnection(n))

		Promise.all(promises)
		.then(() => store.dispatch('getAbstractions', intid))
		.catch(error => store.commit('API_FAIL', error))
	},

	deleteSelectedCodes(store, {relids, codeids, intid}) {
	
		var promises_rels = relids.map(n => api.deleteCodeConnection(n))
		var promises_codes = codeids.map(n => api.deleteCode(n, intid))
	
		Promise.all(promises_rels)
		.then(() => Promise.all(promises_codes))
		.catch(error => store.commit('API_FAIL', error))
		.then(() => store.dispatch('getAbstractions', intid))
	},


}


const getters = {}


export default {
	state,
	getters,
	mutations,
	actions
}