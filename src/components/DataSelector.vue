<template>
<nav class="panel">
	<p class="panel-heading">Select data</p>
	<div class="panel-block">
		<div class="file has-name">
			<label class="file-label">
				<input class="file-input" type="file" name="datadoc" @change="loadTextFromFile">
				<span class="file-cta">
					<span class="file-icon">
						<i class="fas fa-upload"></i>
					</span>
					<span class="file-label">
						Upload file
					</span>
				</span>
			 	<span class="file-name">
			    	{{ filename }}
			    </span>
			</label>
		</div>
	</div>
	<div class="panel-block">
		<p class="control has-icons-left">
			<input @change="searchChanged($event)" class="input is-small" type="text" placeholder="Search data documents">
			<span class="icon is-small is-left">
				<i class="fas fa-search" aria-hidden="true"></i>
			</span>
		</p>
	</div>
	<div class="panel-block">
		<div class="select is-multiple is-fullwidth">
		  <select multiple size="8" v-model="selected">
		  	<option v-for="result in searchresults" :value="result" >
		  		{{ result }}
		  	</option>	    
		  </select>
		</div>
	</div>
</nav>
</template>


<script>
export default {

	data() {
		return {
			filename: '',
			selected: []
		}
	},

	computed: {

		searchresults() {
			return this.$store.state.seq.datadocs.map(n => n.record.datadoc.properties.name)
		},
	},

	watch: {
		selected: function(newc) {
			if (newc.length > 0) {
				this.loadTextFromMultiselect(newc[0])
				this.$store.dispatch("selectedDataDocChanged", this.getDataDocID(newc[0]))
			}
		}
	},

	methods: {
		loadTextFromFile(ev) {
			const file = ev.target.files[0]
			const reader = new FileReader()

			reader.onload = e => this.$emit('loadContent', e.target.result)
			reader.readAsText(file)

			this.filename = file.name
			this.$emit('loadFileName', file.name)
		},

		loadTextFromMultiselect(fname) {
			this.$emit('loadFileName', fname)
		},

		searchChanged(ev) {

			this.$store.dispatch('getAllDataDocs')
			//tdo: search with ev.target.value, use buefy auto complete
		},

		getDataDocID(dd_name) {

			let entry = this.$store.state.seq.datadocs.find(n => n.record.datadoc.properties.name === dd_name)
			if (entry !== undefined)
				return entry.record.datadoc.id
		}
	}
}
</script>
<style>

#submitData {

	margin-left:10px;
}

</style>