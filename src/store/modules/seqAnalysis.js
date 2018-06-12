import Vue from 'vue'
import * as api from '../api.js'

const state = {
	datadocs: [], 
    currentdoc: '',
    sequences: [],
    steps: [],
    interpretations: {}
}
   
const mutations = {

	'SET_DATADOCS': (state, data) => { state.datadocs = data },
	'SET_CURRENTDOC': (state, data) => { state.currentdoc = data[0].record.datadoc },
	'SET_SEQUENCES': (state, data) => { state.sequences = data },
	'SET_STEPS': (state, data) => { state.steps = data },
	'SET_INTERPRETATIONS': (state, {step_id, data}) => { Vue.set(state.interpretations, step_id, data) },

	'DELETE_DATADOCS': state => { state.datadocs = [] },
	'DELETE_CURRENTDOC': state => { state.currentdoc = '' },
	'DELETE_SEQUENCES': state => { state.sequences = [] },
	'DELETE_STEPS': state => { state.steps = [] },
	'DELETE_INTERPRETATIONS': state => { state.interpretations = {} }
}


const actions = {

	getAllDataDocs(store) {
		return api.fetchAllDatadocs()
			.then(response => store.commit('SET_DATADOCS', response.data))
			.catch(error => store.commit('API_FAIL', error))
	},

	selectedDataDocChanged(store, id) {
		store.commit('DELETE_SEQUENCES')
		store.commit('DELETE_STEPS')
		store.commit('DELETE_INTERPRETATIONS')
		return api.fetchDatadoc(id)
			.then(response => store.commit('SET_CURRENTDOC', response.data))
			.catch(error => store.commit('API_FAIL', error))
	},

	newDataDoc(store, params) {

		return api.postDataDoc(params)
			.then(() => store.dispatch('getAllDataDocs'))
			.catch(error => store.commit('API_FAIL', error))
	},

	startAnalysis(store) {
		var name = store.state.currentdoc.properties.name;
		return new Promise((resolve, reject) => 
			api.createSequencesForDataDoc(name)
			.then(() => Promise.all([
							api.fetchSequences(name)
							.then(response => store.commit("SET_SEQUENCES", response.data)),
							api.fetchSteps(name)
							.then(response => store.commit("SET_STEPS", response.data))
						]))
			.then(() => Promise.all(store.state.steps.map(n => api.fetchInterpretations(name, n.record.step.id)
														.then(response =>  
															store.commit('SET_INTERPRETATIONS', { step_id: n.record.step.id, 
																								  data: response.data })
															))))
			.then(response => resolve(response))
			.catch(error => store.commit('API_FAIL', error)))
			
	},

	newStep(store, params) {
		return api.postStep(params)
			.then(() => api.fetchSteps(params.datadoc)
						.then(response => store.commit("SET_STEPS", response.data))
						.catch(error => store.commit('API_FAIL', error)))
			.catch(error => store.commit('API_FAIL', error))
	},

	selectedInterpretationChanged(store, params) {
		var name = store.state.currentdoc.properties.name;
		return api.postInterpretation(params)
			.then(() => api.fetchInterpretations(name, params.stepid)
														.then(response => store.commit('SET_INTERPRETATIONS', { 
																								  step_id: params.stepid, 
																								  data: response.data 
														}))
														.catch(error => store.commit('API_FAIL', error)))
			.catch(error => store.commit('API_FAIL', error))
	}
}


const getters = {

	getInterpretation: (state) => (seqid, stepid) => { 
		var intpr = '';
		if (stepid in state.interpretations) {
			var node = state.interpretations[stepid].find(n => n.record.sequence.id === seqid);
			if (node !== undefined) {
				intpr = node.record.interpretation.properties.content;
			}
		}
		return intpr;
	},
	 getIntID: (state) => (seqid, stepid) => { 
		var intid = -1;
		if (stepid in state.interpretations) {
			var node = state.interpretations[stepid].find(n => n.record.sequence.id === seqid);
			if (node !== undefined) {
				intid = node.record.interpretation.id;
			}
		}
		return intid;
	}
}

export default {
	state,
	getters,
	mutations,
	actions
}