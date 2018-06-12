import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import seq from './modules/seqAnalysis'
import cod from './modules/codings'



    const state = {}

    const actions = {}

    const mutations = {
        'API_FAIL': (state, error) => { console.error(error) }
    }

    const getters = {}

    const modules = {
        seq,
        cod
    }


    const store = new Vuex.Store({
        state,
        getters,
        mutations,
        actions,
        modules
    })

    export default store