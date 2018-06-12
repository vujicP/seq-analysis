<template>
	<div class="section">
		<h5 class="title is-5">Sequential Analysis</h5>
		<div id="data-preparation" class="columns">
			<div id="data-selection" class="column is-two-fifths">
				<dataSelector @loadFileName="filename = $event" @loadContent="content = $event"></dataSelector>
			</div>
			<div id="data-processing" class="column">
				<div class="columns">
					<div id="data-viewer" class="content column is-three-quarters" >
						<dataViewer @loadContent="current_doc = $event" :content_parent="content"></dataViewer>
					</div>
					<div id="data-options" class="column">
						<div class="grid-container">
							<span class="grid-item button is-small is-fullwidth is-success is-outlined" @click="saveDoc">Save doc in database</span>
							<br/>
							<a href="#analysistable" class="grid-item button is-small is-fullwidth is-primary is-rounded" @click="createSeq">Create sequences</a>
						</div>
					</div>
				</div>
			</div>
		</div>
		<seqTable :loaded="fTableload" :filename="filename"></seqTable>
	</div>
</template>


<script>
import dataViewer from './DataViewer.vue'
import dataSelector from './DataSelector.vue'
import seqTable from './SeqTable.vue'


export default {

	components: {

		dataViewer,
		dataSelector,
		seqTable
	},

	data() {
		return {
			content: '',
			current_doc: '',
			filename: '',
			fTableload: false,
		}
	},

	watch: {
		filename() {
			this.fTableload = false
		}
	},

	mounted() {
		this.$store.dispatch('getAllDataDocs')
	},

	methods: {

		saveDoc() {

			if (this.current_doc !== '' && this.filename !== '') {
				this.$store.dispatch('newDataDoc', {
					name: this.filename,
					content: this.current_doc

				})
			}
			//todo: warning message
		},

		createSeq() {
			this.fTableload = true
		},
	},
} 
</script>



<style>

#data-viewer {
	max-height: 600px;
}

#data-options {
	width:70px;
}

</style>