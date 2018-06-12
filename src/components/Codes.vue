<template>
	<div class="modal-card" style="width: auto">
		<header class="modal-card-head">
               <p class="modal-card-title">Add concepts to interpretations</p>
        </header>
        <section class="modal-card-body">
			<div class="columns">
				<div class="column">
					<div class="intpr" v-html="interpretation_hl"></div>
				</div>
				<div class="column">
					<div class="columns">
						<div class="column is-5">
							 <p>Concept</p>
							 <b-autocomplete
				                rounded
				                v-model="concept"
				                :data="filteredConceptArray"
				                placeholder="e.g. Practice">
				                <template slot="empty">No results found</template>
				            </b-autocomplete>
						</div>
						<div class="column is-5">
							<p>Code</p>
							<b-autocomplete
				                rounded
				                v-model="code"
				                :data="filteredCodesArray"
				                placeholder="e.g. Jumping">
				                <template slot="empty">No results found</template>
				            </b-autocomplete>
						</div>
						<div class="buttonex column is-2">
							<br/>
							<button @click="addConcept" class="is-small">
								<template v-if="renaming!==''">Rename</template>
								<template v-else>Add</template>
							</button>
						</div>
					</div>
					<div class="columns is-multiline">
						<div class="column is-10">
							<div class="select is-multiple is-fullwidth">
							  <select multiple size="6" v-model="selectedCodes">
							  	<option v-for="n in nodeList" :value="n" >
							  		{{ n.displayValue }}
							  	</option>	    
							  </select>
							</div>
						</div>
						<div class="buttonex column is-2">
							<button @click="deleteConcept" class="is-small">Delete</button>
							<button @click="renameConcept" class="is-small">Rename</button>
							<br/><br/>
							<button @click="createRels" class="is-small">Create<br/>Rels</button>
						</div>
						<div class="column is-10">
							<div class="select is-multiple is-fullwidth">
							  <select multiple size="6" v-model="selectedRelationships">
							  	<option v-for="r in relationList" :value="r" >
							  		{{ r.displayValue }}
							  	</option>	    
							  </select>
							</div>
						</div>
						<div class="buttonex column is-2">
							<button @click="deleteRelation" class="is-small">Delete</button>
							<br/><br/>
							<button @click="setDir(1)" class="is-small">&lt;--</button>
							<button @click="setDir(2)" class="is-small">--&gt;</button>
							<button @click="setDir(0)" class="is-small">&lt;-&gt;</button>
						</div>
					</div>
				</div>
			</div>
		</section>
		 <footer class="modal-card-foot">
				<button class="button" @click="$parent.close">Close</button>
		 </footer>
	</div>
</template>



<script>

import {
	fetchCodes,
	fetchConcepts
} from '../store/api.js'

export default {
	props: ["interpretation", "int_id"],

	data() {
		return {
			concept: '',
			code: '',
			selectedCodes: [],
			selectedRelationships: [],
			renaming: '',
			searchResultsConcepts: [],
			searchResultsCodes: []
		}
	},

	computed: {
		interpretation_hl() {
			return this.interpretation
		},
		displayValue() {
			return this.code + " (" + this.concept + ")"
		},
		codesArray() {
			return this.searchResultsCodes.map(n => n.record.code.properties.name)
		},
		conceptArray() {
			return this.searchResultsConcepts.map(n => n.record.concept.properties.name)
		},
		filteredConceptArray() {
			return this.conceptArray.filter((option) => {
				return option
					.toString()
					.toLowerCase()
					.indexOf(this.concept.toLowerCase()) >= 0
			})
		},
		filteredCodesArray() {
			return this.codesArray.filter((option) => {
				return option
					.toString()
					.toLowerCase()
					.indexOf(this.code.toLowerCase()) >= 0
			})
		},
		abstractions() {
			return this.$store.state.cod.abstractions // relations between codes and concepts
		},
		nodeList() {
			return this.abstractions.map(n => ({
				displayValue: n.record.code.properties.name + " (" + this.getFirstLabel(n.record.code.labels) + ")",
				concept: this.getFirstLabel(n.record.code.labels),
				code: n.record.code.properties.name,
				code_id: n.record.code.id
			}))
		},
		relationList() {
			var list = []
			list = this.abstractions.reduce((arr,n) => { arr.push(...n.record.rels.filter(r => this.getFirstLabel(r[0].labels) !== "Concept").map(r => r[1])); 
														 return arr;}, []) //map relations between codes to flat array
				    .filter((rel,index,self) => self.map(r => r.id).indexOf(rel.id) === index) //remove duplicates
				    .map(rel => ({
									dir: 0,
									rel_id: rel.id,
									node1: this.findNodeByID(rel.start),
									node2: this.findNodeByID(rel.end),
									displayValue: this.getRelValue(0, this.findNodeByID(rel.start).concept, this.findNodeByID(rel.start).code, this.findNodeByID(rel.end).concept, this.findNodeByID(rel.end).code)
								}))

			/* 
			for(let i=0; i < this.abstractions.length; i++)
			{
				for(let j=0; j < this.abstractions[i].record.rels.length; j++)
				{
					var node2 = this.abstractions[i].record.rels[j][0]
					var rel = this.abstractions[i].record.rels[j][1]

					if(!list.some(n => n.rel_id === rel.id) && this.getFirstLabel(node2.labels) !== "Concept")
					{
						list.push({
									dir: 0,
									rel_id: rel.id,
									node1: this.findNodeByID(rel.start),
									node2: this.findNodeByID(rel.end),
									displayValue: this.getRelValue(0, this.findNodeByID(rel.start).concept, this.findNodeByID(rel.start).code, this.findNodeByID(rel.end).concept, this.findNodeByID(rel.end).code)
						})
					}
				}
			}*/

			return list
		}
	},

	mounted() {
		var that = this

		fetchCodes()
			.then(response => {
				that.searchResultsCodes = response.data
			})
			.catch(error => that.$store.commit('API_FAIL', error))

		fetchConcepts()
			.then(response => {
				that.searchResultsConcepts = response.data
			})
			.catch(error => that.$store.commit('API_FAIL', error))

		this.$store.dispatch('getAbstractions', this.int_id)
	},

	methods: {

		addConcept() {

			//do not allow same entries, concept or code can vary though
			if (this.code !== '' && this.concept !== '' && !this.nodeList.some(n => n.displayValue === this.displayValue)) {
				if (this.renaming !== '') {
					this.nodeList.find(n => n.displayValue === this.renaming && (
						n.displayValue = this.displayValue,
						n.code = this.code,
						n.concept = this.concept));
					this.relationList.forEach(n => n.displayValue = this.getRelValue(n.dir, n.node1.concept, n.node1.code, n.node2.concept, n.node2.code)) //update values in relationlist
					this.renaming = '';
					//tdo: db request

				} else {

					this.$store.dispatch('newAbstraction', {
						concept: this.concept,
						code: this.code,
						intid: this.int_id
					})
				}

				this.concept = ''
				this.code = ''
			}
		},

		renameConcept() {
			if (this.selectedCodes.length > 0) {
				this.renaming = this.selectedCodes[0].displayValue
				this.concept = this.selectedCodes[0].concept
				this.code = this.selectedCodes[0].code
			}
		},

		deleteConcept() {

			var that = this;
			this.$store.dispatch("deleteSelectedCodes", {
				relids: that.relationList.filter(r =>
						that.selectedCodes.some(c => (c.code_id === r.node1.code_id || c.code_id === r.node2.code_id)))
					.map(r => r.rel_id),
				codeids: that.selectedCodes.map(c => c.code_id),
				intid: that.int_id
			})

		},

		createRels() {
			var s = this.selectedCodes;
			for (var i = 0; i < s.length; i++)
				for (var j = i + 1; j < s.length; j++) {

					this.$store.dispatch('connectCodes', {
						id1: s[i].code_id,
						id2: s[j].code_id,
						intid: this.int_id
					})
				}
		},

		getRelValue(number, c1, l1, c2, l2) {
			var str = ' <-> '
			if (number === 1) str = " <-- "
			else if (number === 2) str = " --> "
			return l1 + str + l2 + " (" + c1 + str + c2 + ")"
		},

		deleteRelation() {

			this.$store.dispatch('deleteSelectedConnections', {
				intid: this.int_id,
				ids: this.selectedRelationships.map(r => r.rel_id)
			})
		},

		setDir(number) {
			this.selectedRelationships.forEach(n => {
				n.displayValue = this.getRelValue(number, n.node1.concept, n.node1.code, n.node2.concept, n.node2.code)
				n.dir = number
			})
			//tdo: db request
		},

		getFirstLabel(labels) {
			return JSON.parse(labels)[0]
		},

		findNodeByID(id){
			return this.nodeList.find(n => n.code_id === id)
		}
	}
}
</script>





<style>

.intpr
{
	min-width: 400px;
}

.buttonex > button{
	min-width: 70px;
}


</style>