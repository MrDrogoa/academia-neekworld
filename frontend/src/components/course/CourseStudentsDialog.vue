<template>
  <v-dialog
    v-model="dialog"
    max-width="900px"
    scrollable
  >
    <v-card>
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon class="mr-3">mdi-account-group</v-icon>
          <div>
            <div class="text-h5">Gestión de Estudiantes</div>
            <div class="text-subtitle-1 text-grey">{{ course?.title }}</div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="showAddStudentDialog = true"
            prepend-icon="mdi-account-plus"
          >
            Agregar Estudiante
          </v-btn>
          <v-btn
            icon="mdi-close"
            @click="closeDialog"
            class="ml-2"
          ></v-btn>
        </div>
      </v-card-title>

      <v-card-text>
        <!-- Estadísticas rápidas -->
        <v-row class="mb-4">
          <v-col cols="12" md="4">
            <v-card color="primary" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4">{{ students.length }}</div>
                <div class="text-caption">Total de Estudiantes</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="success" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4">{{ activeStudents }}</div>
                <div class="text-caption">Estudiantes Activos</div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card color="warning" variant="tonal">
              <v-card-text class="text-center">
                <div class="text-h4">{{ averageProgress }}%</div>
                <div class="text-caption">Progreso Promedio</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filtros y búsqueda -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Buscar estudiantes"
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="filterStudents"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="progressFilter"
              :items="progressFilterOptions"
              label="Filtrar por progreso"
              clearable
              @update:model-value="filterStudents"
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusFilterOptions"
              label="Filtrar por estado"
              clearable
              @update:model-value="filterStudents"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Lista de estudiantes -->
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredStudents"
            :loading="loading"
            class="elevation-1"
          >
            <!-- Información del estudiante -->
            <template v-slot:[`item.student`]="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="40" class="mr-3">
                  <v-img :src="item.avatar || '/default-avatar.jpg'"></v-img>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ item.name }}</div>
                  <div class="text-caption text-grey">{{ item.email }}</div>
                </div>
              </div>
            </template>

            <!-- Progreso -->
            <template v-slot:[`item.progress`]="{ item }">
              <div>
                <v-progress-linear
                  :model-value="item.progress"
                  :color="getProgressColor(item.progress)"
                  height="8"
                  rounded
                ></v-progress-linear>
                <div class="text-caption text-center mt-1">{{ item.progress }}%</div>
              </div>
            </template>

            <!-- Estado -->
            <template v-slot:[`item.status`]="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ getStatusText(item.status) }}
              </v-chip>
            </template>

            <!-- Último acceso -->
            <template v-slot:[`item.lastAccess`]="{ item }">
              <div>
                <div class="text-body-2">{{ formatDate(item.lastAccess) }}</div>
                <div class="text-caption text-grey">
                  {{ getTimeAgo(item.lastAccess) }}
                </div>
              </div>
            </template>

            <!-- Acciones -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-eye"
                size="small"
                @click="viewStudentDetails(item)"
                class="mr-1"
              ></v-btn>
              <v-btn
                icon="mdi-email"
                size="small"
                @click="sendMessage(item)"
                class="mr-1"
              ></v-btn>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    v-bind="props"
                  ></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="resetProgress(item)">
                    <v-list-item-title>Reiniciar Progreso</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="changeStatus(item)">
                    <v-list-item-title>Cambiar Estado</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="removeStudent(item)" class="text-error">
                    <v-list-item-title>Remover del Curso</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="exportStudentsList"
          prepend-icon="mdi-download"
          variant="outlined"
        >
          Exportar Lista
        </v-btn>
        <v-btn @click="closeDialog">Cerrar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog para agregar estudiante -->
    <v-dialog v-model="showAddStudentDialog" max-width="500px">
      <v-card>
        <v-card-title>Agregar Estudiante al Curso</v-card-title>
        <v-card-text>
          <v-form ref="addStudentForm" v-model="addStudentFormValid">
            <v-text-field
              v-model="newStudent.name"
              label="Nombre completo *"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="newStudent.email"
              label="Email *"
              type="email"
              :rules="[
                v => !!v || 'El email es requerido',
                v => /.+@.+\..+/.test(v) || 'Email debe ser válido'
              ]"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="newStudent.notes"
              label="Notas adicionales"
              rows="3"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddStudentDialog = false">Cancelar</v-btn>
          <v-btn
            @click="addStudent"
            color="primary"
            :disabled="!addStudentFormValid"
            :loading="addingStudent"
          >
            Agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog para detalles del estudiante -->
    <v-dialog v-model="showStudentDetailsDialog" max-width="600px">
      <v-card v-if="selectedStudent">
        <v-card-title>
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <v-img :src="selectedStudent.avatar || '/default-avatar.jpg'"></v-img>
            </v-avatar>
            <div>
              <div class="text-h6">{{ selectedStudent.name }}</div>
              <div class="text-caption text-grey">{{ selectedStudent.email }}</div>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">Progreso del Curso</div>
              <v-progress-circular
                :model-value="selectedStudent.progress"
                :color="getProgressColor(selectedStudent.progress)"
                size="80"
                width="8"
              >
                {{ selectedStudent.progress }}%
              </v-progress-circular>
            </v-col>
            <v-col cols="12" md="6">
              <div class="text-subtitle-2 mb-2">Información</div>
              <div class="mb-2">
                <strong>Estado:</strong>
                <v-chip
                  :color="getStatusColor(selectedStudent.status)"
                  size="small"
                  class="ml-2"
                >
                  {{ getStatusText(selectedStudent.status) }}
                </v-chip>
              </div>
              <div class="mb-2">
                <strong>Inscrito:</strong> {{ formatDate(selectedStudent.enrolledAt) }}
              </div>
              <div class="mb-2">
                <strong>Último acceso:</strong> {{ formatDate(selectedStudent.lastAccess) }}
              </div>
            </v-col>
          </v-row>
          
          <!-- Progreso por módulos -->
          <div class="mt-4">
            <div class="text-subtitle-2 mb-2">Progreso por Módulos</div>
            <div v-for="module in selectedStudent.moduleProgress" :key="module.id" class="mb-2">
              <div class="d-flex justify-space-between mb-1">
                <span class="text-body-2">{{ module.name }}</span>
                <span class="text-body-2">{{ module.progress }}%</span>
              </div>
              <v-progress-linear
                :model-value="module.progress"
                :color="getProgressColor(module.progress)"
                height="6"
                rounded
              ></v-progress-linear>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showStudentDetailsDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import courseManagementService from '@/services/courseManagementService'

export default {
  name: 'CourseStudentsDialog',
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
  emits: ['update:modelValue'],
  data() {
    return {
      loading: false,
      students: [],
      filteredStudents: [],
      searchQuery: '',
      progressFilter: null,
      statusFilter: null,
      showAddStudentDialog: false,
      showStudentDetailsDialog: false,
      selectedStudent: null,
      addStudentFormValid: false,
      addingStudent: false,
      newStudent: {
        name: '',
        email: '',
        notes: ''
      },
      headers: [
        { title: 'Estudiante', key: 'student', sortable: true },
        { title: 'Progreso', key: 'progress', sortable: true },
        { title: 'Estado', key: 'status', sortable: true },
        { title: 'Inscrito', key: 'enrolledAt', sortable: true },
        { title: 'Último Acceso', key: 'lastAccess', sortable: true },
        { title: 'Acciones', key: 'actions', sortable: false }
      ],
      progressFilterOptions: [
        { title: 'Sin comenzar (0%)', value: 'not-started' },
        { title: 'En progreso (1-99%)', value: 'in-progress' },
        { title: 'Completado (100%)', value: 'completed' }
      ],
      statusFilterOptions: [
        { title: 'Activo', value: 'active' },
        { title: 'Inactivo', value: 'inactive' },
        { title: 'Suspendido', value: 'suspended' },
        { title: 'Completado', value: 'completed' }
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
    activeStudents() {
      return this.students.filter(s => s.status === 'active').length
    },
    averageProgress() {
      if (this.students.length === 0) return 0
      const total = this.students.reduce((sum, student) => sum + student.progress, 0)
      return Math.round(total / this.students.length)
    }
  },
  watch: {
    dialog(isOpen) {
      if (isOpen && this.course) {
        this.loadStudents()
      }
    },
    course: {
      handler(newCourse) {
        if (newCourse && this.dialog) {
          this.loadStudents()
        }
      }
    }
  },
  methods: {
    async loadStudents() {
      if (!this.course?.id) return
      
      this.loading = true
      try {
        this.students = await courseManagementService.getCourseStudents(this.course.id)
        this.filteredStudents = [...this.students]
      } catch (error) {
        console.error('Error loading students:', error)
        this.$toast.error('Error al cargar los estudiantes')
      } finally {
        this.loading = false
      }
    },
    
    filterStudents() {
      let filtered = [...this.students]
      
      // Filtro por búsqueda
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(student => 
          student.name.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query)
        )
      }
      
      // Filtro por progreso
      if (this.progressFilter) {
        switch (this.progressFilter) {
          case 'not-started':
            filtered = filtered.filter(s => s.progress === 0)
            break
          case 'in-progress':
            filtered = filtered.filter(s => s.progress > 0 && s.progress < 100)
            break
          case 'completed':
            filtered = filtered.filter(s => s.progress === 100)
            break
        }
      }
      
      // Filtro por estado
      if (this.statusFilter) {
        filtered = filtered.filter(student => student.status === this.statusFilter)
      }
      
      this.filteredStudents = filtered
    },
    
    async addStudent() {
      if (!this.addStudentFormValid) return
      
      this.addingStudent = true
      try {
        const studentData = {
          ...this.newStudent,
          courseId: this.course.id
        }
        
        await courseManagementService.addStudentToCourse(this.course.id, studentData)
        
        // Limpiar formulario
        this.newStudent = { name: '', email: '', notes: '' }
        this.showAddStudentDialog = false
        
        // Recargar lista
        await this.loadStudents()
        
        this.$toast.success('Estudiante agregado exitosamente')
      } catch (error) {
        console.error('Error adding student:', error)
        this.$toast.error('Error al agregar estudiante')
      } finally {
        this.addingStudent = false
      }
    },
    
    viewStudentDetails(student) {
      // Agregar datos simulados de progreso por módulos
      this.selectedStudent = {
        ...student,
        moduleProgress: [
          { id: 1, name: 'Introducción', progress: 100 },
          { id: 2, name: 'Conceptos Básicos', progress: 80 },
          { id: 3, name: 'Práctica', progress: 45 },
          { id: 4, name: 'Proyecto Final', progress: 0 }
        ]
      }
      this.showStudentDetailsDialog = true
    },
    
    async removeStudent(student) {
      if (confirm(`¿Estás seguro de que deseas remover a ${student.name} del curso?`)) {
        try {
          await courseManagementService.removeStudentFromCourse(this.course.id, student.id)
          this.$toast.success('Estudiante removido exitosamente')
          await this.loadStudents()
        } catch (error) {
          console.error('Error removing student:', error)
          this.$toast.error('Error al remover estudiante')
        }
      }
    },
    
    sendMessage(student) {
      // Aquí se podría abrir un modal para enviar mensajes
      this.$toast.info(`Función de mensajería para ${student.name} - Por implementar`)
    },
    
    resetProgress(student) {
      if (confirm(`¿Estás seguro de que deseas reiniciar el progreso de ${student.name}?`)) {
        // Implementar reset de progreso
        this.$toast.info(`Progreso reiniciado para ${student.name} - Por implementar`)
      }
    },
    
    changeStatus(student) {
      // Implementar cambio de estado
      this.$toast.info(`Cambio de estado para ${student.name} - Por implementar`)
    },
    
    exportStudentsList() {
      const data = this.filteredStudents.map(student => ({
        nombre: student.name,
        email: student.email,
        progreso: `${student.progress}%`,
        estado: this.getStatusText(student.status),
        inscrito: this.formatDate(student.enrolledAt),
        ultimoAcceso: this.formatDate(student.lastAccess)
      }))
      
      const csv = this.convertToCSV(data)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `estudiantes-${this.course.title.replace(/\s+/g, '-')}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      this.$toast.success('Lista de estudiantes exportada')
    },
    
    convertToCSV(data) {
      if (!data.length) return ''
      
      const headers = Object.keys(data[0]).join(',')
      const rows = data.map(row => Object.values(row).join(','))
      
      return [headers, ...rows].join('\n')
    },
    
    getProgressColor(progress) {
      if (progress === 0) return 'grey'
      if (progress < 25) return 'error'
      if (progress < 50) return 'warning'
      if (progress < 75) return 'info'
      if (progress < 100) return 'primary'
      return 'success'
    },
    
    getStatusColor(status) {
      const colors = {
        active: 'success',
        inactive: 'warning',
        suspended: 'error',
        completed: 'primary'
      }
      return colors[status] || 'grey'
    },
    
    getStatusText(status) {
      const texts = {
        active: 'Activo',
        inactive: 'Inactivo',
        suspended: 'Suspendido',
        completed: 'Completado'
      }
      return texts[status] || status
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(new Date(date))
    },
    
    getTimeAgo(date) {
      const now = new Date()
      const then = new Date(date)
      const diff = now - then
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`
      if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
      if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
      return 'Ahora'
    },
    
    closeDialog() {
      this.dialog = false
      this.showAddStudentDialog = false
      this.showStudentDetailsDialog = false
      this.selectedStudent = null
    }
  }
}
</script>

<style scoped>
.v-progress-circular {
  margin: auto;
}
</style>
