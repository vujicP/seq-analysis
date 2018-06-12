<template>
	<div>
		<template v-if="editing">
			<div>
				<textarea 
					@dblclick="openConceptModal()" 
					@blur="intprEntered($event)" 
					ref="txtarea" 
					class="txt-area" 
					placeholder="Enter interpretation" 
					v-model="content"> 
				</textarea>
			</div>
		</template>
		<template v-else-if="content === ''">
			<a @click="beginEditing()">Add new interpretation</a>
		</template>
		<template v-else>
			<div v-html="content_br" @click="beginEditing()"></div>
		</template>
		<b-modal :active.sync="isComponentModalActive" has-modal-card>
            <codesModal 
            	:int_id="int_id" 
            	:interpretation="content_br">
            </codesModal>
        </b-modal>
	</div>
</template>



<script>

import codesModal from './Codes.vue'

export default {
	components: {
		codesModal
	},

	props: ["seqid", "stepid"],

	data() {
		return {
			usercontent: '',
			editing: false,
			isComponentModalActive: false,
		}
	},

	computed: {
		content: {
			get: function() {
				return this.$store.getters.getInterpretation(this.seqid, this.stepid)
			},

			set: function(newV) {
				this.usercontent = newV
			}
		},

		content_br() {
			return this.content.split("\n").join("<br/>")
		},

		int_id() {
			return this.$store.getters.getIntID(this.seqid, this.stepid)
		}
	},
	watch: {

	},
	methods: {

		beginEditing() {
			this.editing = true
			this.$nextTick(function() {
				if (this.$refs.txtarea !== undefined) {
					this.$refs.txtarea.focus();
					this.$refs.txtarea.style.height = this.$refs.txtarea.scrollHeight.toString() + "px";
					this.$refs.txtarea.style.width = "400px"; //tdo: make editable or put in const.js
				}
			})
		},

		openConceptModal() {
			this.isComponentModalActive = true;
		},

		intprEntered(ev) {

			this.editing = false
			if (ev.target.value !== this.content) {
				var params = {
					content: ev.target.value
				}

				if (this.int_id !== -1) {
					params['intid'] = this.int_id
					params['stepid'] = this.stepid
				}
				else {
					params['seqid'] = this.seqid
					params['stepid'] = this.stepid
				}

				this.$store.dispatch('selectedInterpretationChanged', params)
					//tdo: spinner; handle api errors, display usercontent
			}
		},
	}
}
</script>


<style>

.txt-area {
	height:100%;
}
</style>