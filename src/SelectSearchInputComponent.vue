<template>
	
	<!-- Docs: https://vue-select.org/ -->

	<div class="uk-margin">

        <div class="uk-inline uk-width-1-1">

        	<label class="uk-form-label">{{ inputLabel }}</label>

            <v-select 
            	:class="customClass"
            	:append-to-body="appendToBody"
				:autocomplete="autocomplete"
				:autoscroll="autoscroll"
				:calculate-position="calculatePosition"
				:clearable="clearable"
				:clear-search-on-blur="clearSearchOnBlur"
				:clear-search-on-select="clearSearchOnSelect"
				:close-on-select="closeOnSelect"
				:create-option="createOption"
				:deselect-from-dropdown="deselectFromDropdown"
				:dir="dir"
				:disabled="disabled"
				:dropdown-should-open="dropdownShouldOpen"
				:filter="filter"
				:filterable="filterable"
				:filter-by="filterBy"
				:get-option-key="getOptionKey"
				:get-option-label="getOptionLabel"
				:input-id="inputId"
				:label="label"
				:loading="loading"
				:multiple="multiple"
				:no-drop="noDrop"
				:on-tab="onTab"
				:options="customOptions"
				:placeholder="placeholder"
				:push-tags="pushTags"
				:reduce="reduce"
				:reset-on-options-change="resetOnOptionsChange"
				:searchable="searchable"
				:selectable="selectable"
				:select-on-tab="selectOnTab"
				:tabindex="tabindex"
				:taggable="taggable"
				:transition="transition"
				:uid="uid"
				:input-value="inputValue"
				:ajax="ajax"
				:method="method"
				:route-name="routeName"
				:search-params="searchParams"
				:q="q"
            	v-model="value"
            	@search="onSearch">
            </v-select>

        </div>

    </div>

</template>

<script>
	
	import vSelect from 'vue-select'
	import 'vue-select/dist/vue-select.css';

	export default {

		components: {

			vSelect,

		},

		props: {
			
			// General props

				inputLabel: {
					type: String,
					default: '',
				},	

				customClass: {
					type: String,
					required: false,
				},

			// Library props

				/**
				 * @appendToBody 
				 * 
				 * @url https://vue-select.org/api/props.html#appendtobody
				 * 
				 * Append the dropdown element to the end of the body and size/position it dynamically. 
				 * Use it if you have overflow or z-index issues.
				 * 
				 * See Dropdown Position (https://bit.ly/3zGo1Vl) for more details.
				 * 
				 */
				appendToBody: {
				    type: Boolean,
				    default: false
				},

				/**
				 * @autocomplete
				 * 
				 * @url https://vue-select.org/api/props.html#autocomplete
				 * 
				 * The value provided here will be bound to the autocomplete 
				 * HTML attribute (https://mzl.la/2JdaMzw) on the search input. 
				 * 
				 * Defaults to off.
				 * 
				 */
				autocomplete: {
				    type: String,
				    default: 'off'
				},

				/**
				 * @autoscroll 
				 * 
				 * @url https://vue-select.org/api/props.html#autoscroll
				 * 
				 * When true, the dropdown will automatically scroll to ensure that 
				 * the option highlighted is fully within the dropdown viewport when 
				 * navigating with keyboard arrows.
				 * 
				 */
				autoscroll: {
					type: Boolean,
					default: true
				},

				/**
				 * @calculatePosition 
				 * 
				 * @url https://vue-select.org/api/props.html#calculateposition
				 * 
				 * When appendToBody is true, this function is responsible for positioning the drop down list.
				 * 
				 * If a function is returned from calculatePosition, 
				 * it will be called when the drop down list is removed from the DOM. 
				 * This allows for any garbage collection you may need to do.
				 * 
				 * See Dropdown Position (https://bit.ly/3zGo1Vl) for more details.
				 * 
				 */
				calculatePosition: {

				    type: Function,
				    
				    /**
				     * @param dropdownList {HTMLUListElement}
				     * @param component {Vue} current instance of vue select
				     * @param width {string} calculated width in pixels of the dropdown menu
				     * @param top {string} absolute position top value in pixels relative to the document
				     * @param left {string} absolute position left value in pixels relative to the document
				     * @return {function|void}
				     * 
				     */
				    default(dropdownList, component, {width, top, left}) {
					
						dropdownList.style.top = top;
					
						dropdownList.style.left = left;
					
						dropdownList.style.width = width;
				    
				    }

				},

				/**
				 * @clearable
				 * 
				 * @url https://vue-select.org/api/props.html#clearable
				 * 
				 * Can the user clear the selected property?
				 * 
				 */
				clearable: {
					type: Boolean,
					default: true
				},

				/**
				 * @clearSearchOnBlur
				 * 
				 * @url https://vue-select.org/api/props.html#clearsearchonblur
				 * 
				 * Enables/disables clearing the search text when the search input is blurred.
				 * 
				 */
				clearSearchOnBlur: {
				    
				    type: Function,
				    
				    default: function ({ clearSearchOnSelect, multiple }) {
				    
				      return clearSearchOnSelect && !multiple
				    
				    }

				},

				/**
				 * @clearSearchOnSelect
				 * 
				 * @url https://vue-select.org/api/props.html#clearsearchonselect
				 * 
				 * Enables/disables clearing the search text when an option is selected.
				 * 
				 */
				clearSearchOnSelect: {
					type: Boolean,
					default: true
				},

				/**
				 * @closeOnSelect
				 * 
				 * @url https://vue-select.org/api/props.html#closeonselect
				 * 
				 * Close a dropdown when an option is chosen. 
				 * Set to false to keep the dropdown open (useful when combined with multi-select, for example)
				 * 
				 */
				closeOnSelect: {
					type: Boolean,
					default: true
				},

				/**
				 * @createOption
				 * 
				 * @url https://vue-select.org/api/props.html#createoption
				 * 
				 * User defined function for adding Options
				 * 
				 */
				createOption: { // book => ({ title: book, author: { firstName: '', lastName: '' } })
					
					type: Function,
					
					default(newOption) {
					
						if (typeof this.optionList[0] === 'object') {
						
							newOption = {[this.label]: newOption}
					
						}
						
						this.$emit('option:created', newOption)
						
						return newOption
					
					}

				},

				/**
				 * @deselectFromDropdown 
				 * 
				 * @url https://vue-select.org/api/props.html#deselectfromdropdown
				 * 
				 * Determines whether the user can deselect an option by clicking it from within the dropdown menu.
				 * 
				 */
				deselectFromDropdown: {
				    type: Boolean,
				    default: false
				},

				/**
				 * @dir 
				 * 
				 * @url https://vue-select.org/api/props.html#dir
				 * 
				 * Sets RTL support. Accepts ltr, rtl, auto.
				 * 
				 */
				dir: {
				    type: String,
				    default: 'auto'
				},	

				/**
				 * @disabled 
				 * 
				 * @url https://vue-select.org/api/props.html#disabled
				 * 
				 * Disable the entire component.
				 * 
				 */
				disabled: {
					type: Boolean,
					default: false
				},	

				/**
				 * @dropdownShouldOpen  
				 * 
				 * @url https://vue-select.org/api/props.html#dropdownshouldopen
				 * 
				 * Determines whether the dropdown should open. 
				 * Used for overriding the default dropdown behaviour. 
				 * Receives the vue-select instance as the single argument to the function.
				 * 
				 */
				dropdownShouldOpen: {

				    type: Function,

				    default({noDrop, open, mutableLoading}) {

				      return noDrop ? false : open && !mutableLoading;

				    }

				},

				/**
				 * @filter
				 * 
				 * @url https://vue-select.org/api/props.html#filter
				 * 
				 * Callback to filter results when search text is provided. 
				 * Default implementation loops each option, and returns the result of this.filterBy.
				 * 
				 */
				filter: {

					type: Function,
					
					default(options, search) {
					
						return options.filter(option => {
					
							let label = this.getOptionLabel(option);
					
							if (typeof label === "number") {
					
								label = label.toString();
					
							}
					
							return this.filterBy(option, label, search);
					
						});
					
					}

				},

				/**
				 * @filterable
				 * 
				 * @url https://vue-select.org/api/props.html#filter
				 * 
				 * When true, existing options will be filtered by the search text. 
				 * Should not be used in conjunction with taggable.
				 * 
				 * Si AJAX es true, también debe estar deshabilitado
				 * 
				 */
				filterable: {
					type: Boolean,
					default: true,
				},

				/**
				 * @filterBy
				 * 
				 * @url https://vue-select.org/api/props.html#filterby
				 * 
				 * Callback to determine if the provided option should match the current search text. 
				 * Used to determine if the option should be displayed.
				 * 
				 */
				filterBy: {
					
					type: Function,
					
					default(option, label, search) {
					
						return (label || '').toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
					
					}

				},

				/**
				 * @getOptionKey
				 * 
				 * @url https://vue-select.org/api/props.html#getoptionkey
				 * 
				 * Callback to get an option key. 
				 * If option is an object and has an id, returns option.id by default, 
				 * otherwise tries to serialize option to JSON.
				 * 
				 * The key must be unique for an option.
				 * 
				 */
				getOptionKey: {

					type: Function,
					
					default(option) {
						
						if (typeof option === 'object' && option.id) {
						
							return option.id
						
						} else {
						
							try {
							
								return JSON.stringify(option)
							
							} catch(e) {
							
								return console.warn(
								`[vue-select warn]: Could not stringify option ` +
								`to generate unique key. Please provide 'getOptionKey' prop ` +
								`to return a unique key for each option.\n` +
								'https://vue-select.org/api/props.html#getoptionkey'
								)
								
								return null
							
							}
						
						}

					}

				},

				/**
				 * @getOptionLabel
				 * 
				 * @url https://vue-select.org/api/props.html#getoptionlabel
				 * 
				 * Callback to generate the label text. 
				 * If {option} is an object, returns option[this.label] by default.
				 * 
				 * Label text is used for filtering comparison and displaying. 
				 * If you only need to adjust the display, you should use the option and selected-option slots.
				 * 
				 */
				getOptionLabel: {
					
					type: Function,
					
					default(option) {
					
						if (typeof option === 'object') {
						
							if (!option.hasOwnProperty(this.label)) {
							
								return console.warn(
									`[vue-select warn]: Label key "option.${this.label}" does not` +
									` exist in options object ${JSON.stringify(option)}.\n` +
									'https://vue-select.org/api/props.html#getoptionlabel'
								)
							
							}
							
							return option[this.label]
						
						}
						
						return option;
					
					}

				},

				/**
				 * @inputId
				 * 
				 * @url https://vue-select.org/api/props.html#inputid
				 * 
				 * Sets the id of the input element.
				 * 
				 */
				inputId: {
					type: String
				},

				/**
				 * @label
				 * 
				 * @url https://vue-select.org/api/props.html#label
				 * 
				 * Tells vue-select what key to use when generating option labels when each option is an object.
				 * 
				 */
				label: {
					type: String,
					default: "label"
				},

				/**
				 * @loading
				 * 
				 * @url https://vue-select.org/api/props.html#loading
				 * 
				 * Show spinner if the component is in a loading state.
				 * 
				 */
				loading: {
					type: Boolean,
					default: false
				},

				/**
				 * @multiple
				 * 
				 * @url https://vue-select.org/api/props.html#multiple
				 * 
				 * Equivalent to the multiple attribute on a <select> input.
				 * 
				 */
				multiple: {
					type: Boolean,
					default: false
				},

				/**
				 * @noDrop
				 * 
				 * @url https://vue-select.org/api/props.html#nodrop
				 * 
				 * Disable the dropdown entirely.
				 * 
				 */
				noDrop: {
					type: Boolean,
					default: false
				},

				/**
				 * @onTab
				 * 
				 * @url https://vue-select.org/api/props.html#ontab
				 * 
				 * Select the current value if selectOnTab is enabled
				 * 
				 */
				onTab: {
					type: Function,
					default: function() {
						if (this.selectOnTab) {
							this.typeAheadSelect();
						}
					}
				},

				/**
				 * @options
				 * 
				 * @url https://vue-select.org/api/props.html#options
				 * 
				 * An array of strings or objects to be used as dropdown choices. 
				 * If you are using an array of objects, vue-select will look for a label key 
				 * (ex. [{label: 'Canada', value: 'CA'}]). 
				 * A custom label key can be set with the label prop.
				 * 
				 */
				options: {
					type: Array,
					default() {
						return [];
					}
				},

				/**
				 * @placeholder
				 * 
				 * @url https://vue-select.org/api/props.html#placeholder
				 * 
				 * Equivalent to the placeholder attribute on an <input>.
				 * 
				 */
				placeholder: {
					type: String,
					default: ""
				},

				/**
				 * @pushTags
				 * 
				 * @url https://vue-select.org/api/props.html#pushtags
				 * 
				 * When true, newly created tags will be added to the options list.
				 * 
				 */
				pushTags: { // If you want added tags to be pushed to the options array, set push-tags to true.
					type: Boolean,
					default: false,
				},

				/**
				 * @reduce
				 * 
				 * @url https://vue-select.org/api/props.html#reduce
				 * 
				 * When working with objects, the reduce prop allows you to transform a 
				 * given object to only the information you want passed to a v-model binding or @input event.
				 * 
				 */
				reduce: {
					type: Function,
					default: option => option,
				},

				/**
				 * @resetOnOptionsChange
				 * 
				 * @url https://vue-select.org/api/props.html#resetonoptionschange
				 * 
				 * When false, updating the options will not reset the selected value.
				 * 
				 * Since v3.4+ the prop accepts either a boolean or function that returns a boolean.
				 * 
				 * If defined as a function, it will receive the params listed below.
				 *
				 * @type {Boolean|Function}
				 * @param {Array} newOptions
				 * @param {Array} oldOptions
				 * @param {Array} selectedValue
				 * 
				 */
				resetOnOptionsChange: {
				    default: false,
				    validator: (value) => ['function', 'boolean'].includes(typeof value)
				},

				/**
				 * @searchable
				 * 
				 * @url https://vue-select.org/api/props.html#searchable
				 * 
				 * Enable/disable filtering the options.
				 * 
				 */
				searchable: {
					type: Boolean,
					default: true
				},

				/**
				 * @selectable 
				 * 
				 * @url https://vue-select.org/api/props.html#selectable
				 * 
				 * The selectable prop determines if an option is selectable or not. 
				 * If selectable returns false for a given option, it will be displayed 
				 * with a vs__dropdown-option--disabled class. 
				 * The option will be disabled and unable to be selected.
				 * 
				 */
				selectable: {
				
					type: Function,
					
					/**
					 * @param {Object|String} option
					 * @return {boolean}
 					 */
					default: option => true,
				
				},

				/**
				 * @selectOnTab
				 * 
				 * @url https://vue-select.org/api/props.html#selectontab
				 * 
				 * When true, hitting the 'tab' key will select the current select value
				 * 
				 */
				selectOnTab: {
					type: Boolean,
					default: false
				},

				/**
				 * @tabindex
				 * 
				 * @url https://vue-select.org/api/props.html#tabindex
				 * 
				 * Set the tabindex for the input field.
				 * 
				 */
				tabindex: {
					type: Number,
					default: null
				},

				/**
				 * @taggable
				 * 
				 * @url https://vue-select.org/api/props.html#taggable
				 * 
				 * Enable/disable creating options from searchInput.
				 * 
				 */
				taggable: { // To allow input that's not present within the options, set the taggable prop to true.
					type: Boolean,
					default: false,
				},

				/**
				 * @transition
				 * 
				 * @url https://vue-select.org/api/props.html#transition
				 * 
				 * Sets a Vue transition property on the .dropdown-menu. vue-select 
				 * does not include CSS for transitions, you'll need to add them yourself.
				 * 
				 */
				transition: {
					type: String,
					default: "fade"
				},

				/**
				 * @uid
				 * 
				 * @url https://vue-select.org/api/props.html#uid
				 * 
				 * A unique identifier used to generate IDs and DOM attributes. 
				 * Must be unique for every instance of the component.
				 * 
				 */
				uid: {
					type: [String, Number],
					default: () => Math.floor(Math.random() * 100),
				},

				/**
				 * @value as inputValue
				 * 
				 * @url https://vue-select.org/api/props.html#value
				 * 
				 * Contains the currently selected value. 
				 * Very similar to a value attribute on an <input>. 
				 * You can listen for changes using the 'input' event.
				 * 
				 */
				inputValue: {
					default: null
				},

			// AJAX Props

				/**
				 * @ajax
				 * 
				 * Si está habilitado, es por que el componente va a cargar las opciones mediante AJAX
				 * 
				 */
				ajax: {
					type: Boolean,
					default: false,
				},

				/**
				 * 
				 * @validation
				 * Operación de validación
				 * 
				 */
				validation: {
					type: Function,
					default: value => true,
				},

				/**
				 * 
				 * @parseBeforeSubmit
				 * Permite preprocesar el valor que se enviará al servidor en la búsqueda
				 * 
				 */
				parseBeforeSubmit: {
	                type: Function,
	                default: value => value,
	            },

				/**
				 * @method
				 * 
				 * Se trata del método HTTP de la consulta
				 * 
				 */
				method: {
					type: String,
					default: 'post',
				},

				/**
				 * @routeName
				 * 
				 * Se trata de la URL a donde se va a realizar la búsqueda
				 * 
				 */
				routeName: {
					type: String,
					default: '',
				},

				/**
				 * @searchParams
				 * 
				 * Define un conjunto de parámetros externos, en un objeto JSON en par clave => valor, 
				 * para pasar como restricciones a la búsqueda en general
				 * 
				 */
				searchParams: {
					type: Object,
					default: {}
				},

				/**
				 * @q
				 * 
				 * Representa el parámetro de búsqueda, por ejemplo si estamos buscanod un nombre, q sería "name"
				 * 
				 */
				q: {
					type: String,
					default: ''
				},

				/**
				 * @minSearchLength
				 * 
				 * La longitud mínima para iniciar una búsqueda por AJAX
				 * 
				 */
				minSearchLength: {
					type: Number,
					default: 2
				},

			// Vue Model

				modelValue: {
					type: [String, Number, Array, Object],
					default: ""
				}

		},

		emits: ['update:modelValue', 'search'],

		mounted() {},

		data() {

			return {

				customOptions: this.options,

			}

		},

		watch: {

			options(val, oldVal) {}

		},

		computed: {

			value: {

				get() {
					
					return this.modelValue;

				},

				set(value){
					
					this.$emit('update:modelValue', value);

				}

			}

		},

		methods: {

			onSearch(search, loading) {

				if(search.length > this.minSearchLength && this.ajax && this.validation(search)) {

					loading(true);

					this.search(loading, search).then( res => loading(false)).catch( error => loading(false));

				}

			},
			
			search(loading, search) {

				return new Promise((resolve, reject) => {

					axios[this.method](route.name(this.routeName), {

						_token: csrf_token,

						paginate: 0,

						[this.q]: this.parseBeforeSubmit(search),

						...this.searchParams

					}).then( res => {

						this.$emit('search', res.data);

						this.customOptions = res.data;

						resolve(res);

					}).catch( error => {

						reject( error );

					});

				});

			}

		}

	}

</script>

<style scoped>
	
	.uk-form-large:not(textarea):not([multiple]):not([size]) {
	    padding-left: 0px; 
	    padding-right: 0px; 
	}

	::v-deep(.vs__dropdown-toggle) {
	    border: 1px solid #e5e5e5 !important;
	    border-radius: 5px !important;
	    height: 50px !important;
	}

	::v-deep(.vs__dropdown-menu) {
	    border: 1px solid #e5e5e5 !important;
	}

	::v-deep(.v-select.vs--single.vs--searchable) {
	    background: #fff;
	}

</style>