<template>
  <v-dialog
    v-model="dialog"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">
          {{ isEditing ? 'Editar Curso' : 'Crear Nuevo Curso' }}
        </span>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-close"
          @click="closeDialog"
        ></v-btn>
      </v-card-title>

      <v-card-text>
        <v-stepper v-model="step" :items="stepItems">
          <!-- Paso 1: Información Básica -->
          <template v-slot:[`item.1`]>
            <v-form ref="basicForm" v-model="basicFormValid">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="courseData.title"
                    label="Título del curso *"
                    :rules="[v => !!v || 'El título es requerido']"
                    counter="100"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="courseData.description"
                    label="Descripción *"
                    :rules="[v => !!v || 'La descripción es requerida']"
                    counter="500"
                    rows="4"
                    required
                  ></v-textarea>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="courseData.category"
                    :items="categoryOptions"
                    label="Categoría *"
                    :rules="[v => !!v || 'La categoría es requerida']"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="courseData.level"
                    :items="levelOptions"
                    label="Nivel *"
                    :rules="[v => !!v || 'El nivel es requerido']"
                    required
                  ></v-select>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="courseData.price"
                    label="Precio (CLP) *"
                    type="number"
                    :rules="[v => !!v || 'El precio es requerido', v => v > 0 || 'El precio debe ser mayor a 0']"
                    prefix="$"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="courseData.duration"
                    label="Duración (horas) *"
                    type="number"
                    :rules="[v => !!v || 'La duración es requerida', v => v > 0 || 'La duración debe ser mayor a 0']"
                    suffix="hrs"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </template>

          <!-- Paso 2: Contenido y Medios -->
          <template v-slot:[`item.2`]>
            <v-form ref="contentForm" v-model="contentFormValid">
              <v-row>
                <v-col cols="12">
                  <v-file-input
                    v-model="thumbnailFile"
                    label="Imagen de portada"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="handleThumbnailUpload"
                  ></v-file-input>
                  
                  <v-img
                    v-if="thumbnailPreview"
                    :src="thumbnailPreview"
                    max-height="200"
                    class="mt-2 rounded"
                  ></v-img>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    v-model="courseData.videoIntroUrl"
                    label="URL del video de introducción"
                    placeholder="https://youtube.com/watch?v=..."
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <h4 class="mb-3">Objetivos del curso</h4>
                  <div v-for="(objective, index) in courseData.objectives" :key="index" class="mb-2">
                    <v-text-field
                      v-model="courseData.objectives[index]"
                      :label="`Objetivo ${index + 1}`"
                      append-icon="mdi-delete"
                      @click:append="removeObjective(index)"
                    ></v-text-field>
                  </div>
                  <v-btn
                    @click="addObjective"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    size="small"
                  >
                    Agregar Objetivo
                  </v-btn>
                </v-col>
                
                <v-col cols="12">
                  <h4 class="mb-3">Prerrequisitos</h4>
                  <div v-for="(prerequisite, index) in courseData.prerequisites" :key="index" class="mb-2">
                    <v-text-field
                      v-model="courseData.prerequisites[index]"
                      :label="`Prerrequisito ${index + 1}`"
                      append-icon="mdi-delete"
                      @click:append="removePrerequisite(index)"
                    ></v-text-field>
                  </div>
                  <v-btn
                    @click="addPrerequisite"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    size="small"
                  >
                    Agregar Prerrequisito
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </template>

          <!-- Paso 3: Módulos del Curso -->
          <template v-slot:[`item.3`]>
            <div>
              <h4 class="mb-4">Módulos del curso</h4>
              
              <v-expansion-panels v-model="expandedModule" multiple>
                <v-expansion-panel
                  v-for="(module, index) in courseData.modules"
                  :key="index"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
                      {{ module.title || `Módulo ${index + 1}` }}
                      <v-spacer></v-spacer>
                      <v-btn
                        icon="mdi-delete"
                        size="small"
                        @click.stop="removeModule(index)"
                      ></v-btn>
                    </div>
                  </v-expansion-panel-title>
                  
                  <v-expansion-panel-text>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="module.title"
                          label="Título del módulo"
                          required
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12">
                        <v-textarea
                          v-model="module.description"
                          label="Descripción"
                          rows="3"
                        ></v-textarea>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="module.duration"
                          label="Duración (minutos)"
                          type="number"
                          suffix="min"
                        ></v-text-field>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="module.type"
                          :items="moduleTypes"
                          label="Tipo de módulo"
                        ></v-select>
                      </v-col>
                      
                      <!-- Lecciones del módulo -->
                      <v-col cols="12">
                        <h5 class="mb-2">Lecciones</h5>
                        <div v-for="(lesson, lessonIndex) in module.lessons" :key="lessonIndex" class="mb-2">
                          <v-card variant="outlined">
                            <v-card-text>
                              <v-row>
                                <v-col cols="12" md="6">
                                  <v-text-field
                                    v-model="lesson.title"
                                    label="Título de la lección"
                                    density="compact"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model.number="lesson.duration"
                                    label="Duración (min)"
                                    type="number"
                                    density="compact"
                                    suffix="min"
                                  ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                  <v-btn
                                    icon="mdi-delete"
                                    size="small"
                                    @click="removeLesson(index, lessonIndex)"
                                  ></v-btn>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </div>
                        <v-btn
                          @click="addLesson(index)"
                          variant="outlined"
                          size="small"
                          prepend-icon="mdi-plus"
                        >
                          Agregar Lección
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              
              <v-btn
                @click="addModule"
                variant="outlined"
                prepend-icon="mdi-plus"
                class="mt-4"
                block
              >
                Agregar Módulo
              </v-btn>
            </div>
          </template>

          <!-- Paso 4: Configuración Final -->
          <template v-slot:[`item.4`]>
            <v-form ref="settingsForm" v-model="settingsFormValid">
              <v-row>
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="courseData.isPublic"
                    label="Curso público"
                    color="primary"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="courseData.allowComments"
                    label="Permitir comentarios"
                    color="primary"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="courseData.certificateEnabled"
                    label="Emitir certificado"
                    color="primary"
                  ></v-switch>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-switch
                    v-model="courseData.hasDiscount"
                    label="Aplicar descuento"
                    color="primary"
                  ></v-switch>
                </v-col>
                
                <v-col v-if="courseData.hasDiscount" cols="12" md="6">
                  <v-text-field
                    v-model.number="courseData.discountPercentage"
                    label="Porcentaje de descuento"
                    type="number"
                    suffix="%"
                    :max="99"
                    :min="1"
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="courseData.tags"
                    label="Tags (separados por comas)"
                    placeholder="vue, javascript, frontend, programación"
                    rows="2"
                  ></v-textarea>
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="courseData.notes"
                    label="Notas adicionales"
                    placeholder="Información adicional para moderadores..."
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-form>
          </template>
        </v-stepper>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="closeDialog"
          variant="text"
        >
          Cancelar
        </v-btn>
        <v-btn
          v-if="step > 1"
          @click="previousStep"
          variant="outlined"
        >
          Anterior
        </v-btn>
        <v-btn
          v-if="step < stepItems.length"
          @click="nextStep"
          color="primary"
          :disabled="!canProceed"
        >
          Siguiente
        </v-btn>
        <v-btn
          v-if="step === stepItems.length"
          @click="saveCourse"
          color="primary"
          :loading="saving"
          :disabled="!canSave"
        >
          {{ isEditing ? 'Actualizar' : 'Crear' }} Curso
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CourseFormDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    course: {
      type: Object,
      default: null
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      step: 1,
      saving: false,
      basicFormValid: false,
      contentFormValid: true,
      settingsFormValid: true,
      expandedModule: [],
      thumbnailFile: null,
      thumbnailPreview: null,
      stepItems: [
        { title: 'Información Básica', value: 1 },
        { title: 'Contenido', value: 2 },
        { title: 'Módulos', value: 3 },
        { title: 'Configuración', value: 4 }
      ],
      courseData: {
        title: '',
        description: '',
        category: '',
        level: '',
        price: 0,
        duration: 0,
        thumbnail: '',
        videoIntroUrl: '',
        objectives: [''],
        prerequisites: [''],
        modules: [],
        isPublic: true,
        allowComments: true,
        certificateEnabled: false,
        hasDiscount: false,
        discountPercentage: 0,
        tags: '',
        notes: ''
      },
      categoryOptions: [
        { title: 'Programación', value: 'programming' },
        { title: 'Diseño', value: 'design' },
        { title: 'Marketing', value: 'marketing' },
        { title: 'Negocios', value: 'business' },
        { title: 'Idiomas', value: 'languages' },
        { title: 'Ciencias', value: 'science' },
        { title: 'Arte', value: 'art' },
        { title: 'Música', value: 'music' }
      ],
      levelOptions: [
        { title: 'Principiante', value: 'beginner' },
        { title: 'Intermedio', value: 'intermediate' },
        { title: 'Avanzado', value: 'advanced' }
      ],
      moduleTypes: [
        { title: 'Video', value: 'video' },
        { title: 'Texto', value: 'text' },
        { title: 'Quiz', value: 'quiz' },
        { title: 'Práctica', value: 'practice' },
        { title: 'Proyecto', value: 'project' }
      ]
    }
  },
  computed: {
    dialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    isEditing() {
      return !!this.course?.id
    },
    canProceed() {
      switch (this.step) {
        case 1:
          return this.basicFormValid
        case 2:
          return this.contentFormValid
        case 3:
          return true // Los módulos son opcionales
        case 4:
          return this.settingsFormValid
        default:
          return false
      }
    },
    canSave() {
      return this.basicFormValid && this.contentFormValid && this.settingsFormValid
    }
  },
  watch: {
    course: {
      handler(newCourse) {
        if (newCourse) {
          this.courseData = { ...this.getDefaultCourseData(), ...newCourse }
          this.thumbnailPreview = newCourse.thumbnail || null
        } else {
          this.courseData = this.getDefaultCourseData()
          this.thumbnailPreview = null
        }
      },
      immediate: true
    },
    dialog(isOpen) {
      if (isOpen) {
        this.step = 1
      }
    }
  },
  methods: {
    getDefaultCourseData() {
      return {
        title: '',
        description: '',
        category: '',
        level: '',
        price: 0,
        duration: 0,
        thumbnail: '',
        videoIntroUrl: '',
        objectives: [''],
        prerequisites: [''],
        modules: [],
        isPublic: true,
        allowComments: true,
        certificateEnabled: false,
        hasDiscount: false,
        discountPercentage: 0,
        tags: '',
        notes: ''
      }
    },
    
    nextStep() {
      if (this.step < this.stepItems.length) {
        this.step++
      }
    },
    
    previousStep() {
      if (this.step > 1) {
        this.step--
      }
    },
    
    async saveCourse() {
      this.saving = true
      try {
        // Procesar datos antes de enviar
        const processedData = this.processFormData()
        this.$emit('save', processedData)
        this.closeDialog()
      } catch (error) {
        console.error('Error saving course:', error)
      } finally {
        this.saving = false
      }
    },
    
    processFormData() {
      const data = { ...this.courseData }
      
      // Procesar objetivos y prerrequisitos
      data.objectives = data.objectives.filter(obj => obj.trim() !== '')
      data.prerequisites = data.prerequisites.filter(prereq => prereq.trim() !== '')
      
      // Procesar tags
      if (data.tags) {
        data.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      } else {
        data.tags = []
      }
      
      // Si hay thumbnail file, aquí se subiría a un servicio de almacenamiento
      if (this.thumbnailFile) {
        // TODO: Implementar subida de archivo
        data.thumbnail = this.thumbnailPreview
      }
      
      return data
    },
    
    closeDialog() {
      this.dialog = false
      this.step = 1
      this.courseData = this.getDefaultCourseData()
      this.thumbnailFile = null
      this.thumbnailPreview = null
    },
    
    handleThumbnailUpload(file) {
      if (file && file[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.thumbnailPreview = e.target.result
        }
        reader.readAsDataURL(file[0])
      } else {
        this.thumbnailPreview = null
      }
    },
    
    addObjective() {
      this.courseData.objectives.push('')
    },
    
    removeObjective(index) {
      this.courseData.objectives.splice(index, 1)
    },
    
    addPrerequisite() {
      this.courseData.prerequisites.push('')
    },
    
    removePrerequisite(index) {
      this.courseData.prerequisites.splice(index, 1)
    },
    
    addModule() {
      this.courseData.modules.push({
        title: '',
        description: '',
        duration: 0,
        type: 'video',
        lessons: []
      })
    },
    
    removeModule(index) {
      this.courseData.modules.splice(index, 1)
    },
    
    addLesson(moduleIndex) {
      if (!this.courseData.modules[moduleIndex].lessons) {
        this.courseData.modules[moduleIndex].lessons = []
      }
      this.courseData.modules[moduleIndex].lessons.push({
        title: '',
        duration: 0
      })
    },
    
    removeLesson(moduleIndex, lessonIndex) {
      this.courseData.modules[moduleIndex].lessons.splice(lessonIndex, 1)
    }
  }
}
</script>

<style scoped>
.v-stepper {
  box-shadow: none;
}
</style>
