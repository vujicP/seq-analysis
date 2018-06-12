<template>
	<div id="analysis-table" class="columns is-gapless is-multiline is-desktop">
			<div class="column is-5">
				<div class="columns is-gapless is-multiline is-desktop">
					<div class="column is-1">#</div>
					<div class="column is-11">Sequence</div>
					<template v-if="seqs.length > 0">
						<template v-for="(value, index) in seqs" >
							<div class="column is-1">{{ index + 1 }}</div>
							<div class="column is-11" :rownr="index" ref="rowheights">
								<div >{{ value.record.sequence.properties.content }}</div>
							</div>
						</template>
					</template>
				</div>
			</div>
			<div class="column is-7">
				<div class="columns step-table is-gapless is-multiline is-desktop">
					<div class="column is-12">
						<div class="columns is-gapless is-multiline is-desktop step-row">
							<template v-if="steps.length > 0">
								<div v-for="value in steps" class="column step-column">{{ value.record.step.properties.name }}</div>
							</template>
							<div class="column step-column">
								<template v-if="!fAdd_step">
									<a @click="newStep">Add new i.step</a>
								</template>
								<template v-else>
									<div>
										<input @change="stepChanged($event)" class="input" type="text" placeholder="Enter name for i.step">
									</div>
								</template>
							</div>
						</div>
				    </div>
				    <template v-if="rowsAndColumns.length > 0">
						<template v-for="(r, index) in rowsAndColumns" >
							<div class="column is-12">
								<div class ="columns is-gapless is-multiline is-desktop step-row">
									<template v-if="r.columns.length > 0">
										<div v-for="(c, index2) in r.columns" :rownr="index" ref="rowheights" class="column step-column">
											<div >
												<seqCell :seqid="r.seqid" :stepid="c.stepid"></seqCell>
												<div>{{ c.content }}</div>
											</div>
										</div>
									</template>
									<div class="column step-column"></div>
								</div>
							</div>
						</template>
					</template>					
				</div>
			</div>
		</div>
</template>

<script>
import seqCell from './SeqCell.vue'

export default {

	components: {
		seqCell
	},

	props: ["loaded", "filename"],

	data() {
		return {
			fAdd_step: false,
		}
	},

	computed: {
		seqs() {
			return this.$store.state.seq.sequences.sort((a,b) =>  
									parseInt(a.record.sequence.properties.seqnumber,10) - 
									parseInt(b.record.sequence.properties.seqnumber,10))

		},

		steps() {
			return this.$store.state.seq.steps
		},

		rowsAndColumns() {
			return this.seqs.map(seq => ({ seqid: seq.record.sequence.id,
										   columns: this.steps.map(step => ({
										   							stepid: step.record.step.id
										   						}))		
							 }))
		}
	},

	watch: {
		loaded(newV) {
			if (newV)
				this.$store.dispatch('startAnalysis', this.filename).then(() => this.setRowHeights())
		},
	},

	methods: {

		setRowHeights() {
			//dom manipulation neccessary to have fixed front columns and row heights still synced
			if (this.$refs.rowheights !== undefined && this.$refs.rowheights.length > 0) {
				for (let i = 0; i < this.rowsAndColumns.length; i++) {
					let f = this.$refs.rowheights.filter(n => n.getAttribute("rownr") === i.toString())
					let maxh = Math.max.apply(Math, f.map(n => n.scrollHeight))
					f.forEach(n => n.style.height = maxh.toString() + "px")
				}
			}
		},

		newStep() {
			//tdo: possibility too add from existing steps in db
			this.fAdd_step = true
		},
		stepChanged(ev) {

			this.fAdd_step = false;
			this.$store.dispatch('newStep', {
				name: ev.target.value,
				datadoc: this.filename
			})
		},
	}
}
</script>


<style>

#analysis-table > .column {
	border: 1px solid black;
}

.step-table {
	overflow-x: auto
}

.step-row {
	flex-wrap:nowrap !important;
}

.step-column {
    min-width: 400px ;
}


</style>


