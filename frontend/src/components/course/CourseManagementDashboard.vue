<template>
  <v-container fluid>
    <!-- Header del Dashboard -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>mdi-school</v-icon>
            Gestión de Cursos
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="showCreateDialog = true"
              prepend-icon="mdi-plus"
            >
              Crear Curso
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Estadísticas Generales -->
    <v-row>
      <v-col cols="12" md="3">
        <v-card color="primary">
          <v-card-text class="text-white">
            <div class="text-h4">{{ summary.totalCourses }}</div>
            <div>Total de Cursos</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="success">
          <v-card-text class="text-white">
            <div class="text-h4">{{ summary.totalStudents }}</div>
            <div>Estudiantes Totales</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="info">
          <v-card-text class="text-white">
            <div class="text-h4">${{ formatCurrency(summary.totalRevenue) }}</div>
            <div>Ingresos Totales</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="warning">
          <v-card-text class="text-white">
            <div class="text-h4">{{ summary.avgCompletionRate }}%</div>
            <div>Tasa de Finalización</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtros y Búsqueda -->
    <v-row>
      <v-col cols="12" md="4">
        <v-text-field
          v-model="searchQuery"
          label="Buscar cursos"
          prepend-inner-icon="mdi-magnify"
          clearable
          @input="filterCourses"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          label="Estado"
          clearable
          @update:model-value="filterCourses"
        ></v-select>
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="categoryFilter"
          :items="categoryOptions"
          label="Categoría"
          clearable
          @update:model-value="filterCourses"
        ></v-select>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn
          @click="refreshData"
          :loading="loading"
          block
          variant="outlined"
        >
          <v-icon>mdi-refresh</v-icon>
          Actualizar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Lista de Cursos -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Mis Cursos
            <v-spacer></v-spacer>
            <v-chip :color="getChipColor(filteredCourses.length)">
              {{ filteredCourses.length }} cursos
            </v-chip>
          </v-card-title>
          
          <v-data-table
            :headers="headers"
            :items="filteredCourses"
            :loading="loading"
            class="elevation-1"
          >
            <!-- Título del curso -->
            <template v-slot:[`item.title`]="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="40" class="mr-3">
                  <v-img :src="item.thumbnail || '/default-course.jpg'"></v-img>
                </v-avatar>
                <div>
                  <div class="font-weight-bold">{{ item.title }}</div>
                  <div class="text-caption text-grey">{{ item.category }}</div>
                </div>
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

            <!-- Estadísticas -->
            <template v-slot:[`item.stats`]="{ item }">
              <div>
                <div>{{ item.stats.studentsCount }} estudiantes</div>
                <div class="text-caption">{{ item.stats.completionRate }}% completado</div>
              </div>
            </template>

            <!-- Ingresos -->
            <template v-slot:[`item.revenue`]="{ item }">
              <div class="text-success font-weight-bold">
                ${{ formatCurrency(item.stats.totalRevenue) }}
              </div>
            </template>

            <!-- Acciones -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-eye"
                size="small"
                @click="viewAnalytics(item)"
                class="mr-1"
              ></v-btn>
              <v-btn
                icon="mdi-pencil"
                size="small"
                @click="editCourse(item)"
                class="mr-1"
              ></v-btn>
              <v-btn
                icon="mdi-account-group"
                size="small"
                @click="manageStudents(item)"
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
                  <v-list-item @click="duplicateCourse(item)">
                    <v-list-item-title>Duplicar</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="archiveCourse(item)">
                    <v-list-item-title>Archivar</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteCourse(item)" class="text-error">
                    <v-list-item-title>Eliminar</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para Crear/Editar Curso -->
    <CourseFormDialog
      v-model="showCreateDialog"
      :course="selectedCourse"
      @save="handleSaveCourse"
    />

    <!-- Dialog para Analytics -->
    <CourseAnalyticsDialog
      v-model="showAnalyticsDialog"
      :course="selectedCourse"
    />

    <!-- Dialog para Gestión de Estudiantes -->
    <CourseStudentsDialog
      v-model="showStudentsDialog"
      :course="selectedCourse"
    />
  </v-container>
</template>

<script>
import CourseFormDialog from './CourseFormDialog.vue'
import CourseAnalyticsDialog from './CourseAnalyticsDialog.vue'
import CourseStudentsDialog from './CourseStudentsDialog.vue'
import courseManagementService from '@/services/courseManagementService'

export default {
  name: 'CourseManagementDashboard',
  components: {
    CourseFormDialog,
    CourseAnalyticsDialog,
    CourseStudentsDialog
  },
  data() {
    return {
      loading: false,
      courses: [],
      filteredCourses: [],
      summary: {
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        avgCompletionRate: 0
      },
      searchQuery: '',
      statusFilter: null,
      categoryFilter: null,
      showCreateDialog: false,
      showAnalyticsDialog: false,
      showStudentsDialog: false,
      selectedCourse: null,
      headers: [
        { title: 'Curso', key: 'title', sortable: true },
        { title: 'Estado', key: 'status', sortable: true },
        { title: 'Precio', key: 'price', sortable: true },
        { title: 'Estudiantes', key: 'stats', sortable: false },
        { title: 'Ingresos', key: 'revenue', sortable: true },
        { title: 'Creado', key: 'createdAt', sortable: true },
        { title: 'Acciones', key: 'actions', sortable: false }
      ],
      statusOptions: [
        { title: 'Pendiente', value: 'pending' },
        { title: 'Aprobado', value: 'approved' },
        { title: 'Rechazado', value: 'rejected' },
        { title: 'Archivado', value: 'archived' }
      ],
      categoryOptions: [
        { title: 'Programación', value: 'programming' },
        { title: 'Diseño', value: 'design' },
        { title: 'Marketing', value: 'marketing' },
        { title: 'Negocios', value: 'business' },
        { title: 'Idiomas', value: 'languages' }
      ]
    }
  },
  async created() {
    await this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      this.loading = true
      try {
        const data = await courseManagementService.getCourseDashboard()
        this.courses = data.courses || []
        this.summary = data.summary || {}
        this.filteredCourses = [...this.courses]
      } catch (error) {
        console.error('Error loading dashboard:', error)
        this.$toast.error('Error al cargar el dashboard')
      } finally {
        this.loading = false
      }
    },
    
    filterCourses() {
      let filtered = [...this.courses]
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)
        )
      }
      
      if (this.statusFilter) {
        filtered = filtered.filter(course => course.status === this.statusFilter)
      }
      
      if (this.categoryFilter) {
        filtered = filtered.filter(course => course.category === this.categoryFilter)
      }
      
      this.filteredCourses = filtered
    },
    
    async refreshData() {
      await this.loadDashboardData()
    },
    
    getStatusColor(status) {
      const colors = {
        pending: 'warning',
        approved: 'success',
        rejected: 'error',
        archived: 'grey'
      }
      return colors[status] || 'grey'
    },
    
    getStatusText(status) {
      const texts = {
        pending: 'Pendiente',
        approved: 'Aprobado',
        rejected: 'Rechazado',
        archived: 'Archivado'
      }
      return texts[status] || status
    },
    
    getChipColor(count) {
      if (count === 0) return 'grey'
      if (count < 5) return 'warning'
      return 'success'
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('es-CL').format(amount || 0)
    },
    
    viewAnalytics(course) {
      this.selectedCourse = course
      this.showAnalyticsDialog = true
    },
    
    editCourse(course) {
      this.selectedCourse = course
      this.showCreateDialog = true
    },
    
    manageStudents(course) {
      this.selectedCourse = course
      this.showStudentsDialog = true
    },
    
    async handleSaveCourse(courseData) {
      try {
        if (this.selectedCourse?.id) {
          await courseManagementService.updateCourse(this.selectedCourse.id, courseData)
          this.$toast.success('Curso actualizado exitosamente')
        } else {
          await courseManagementService.createCourse(courseData)
          this.$toast.success('Curso creado exitosamente')
        }
        await this.loadDashboardData()
      } catch (error) {
        console.error('Error saving course:', error)
        this.$toast.error('Error al guardar el curso')
      }
    },
    
    async duplicateCourse(course) {
      try {
        const duplicateData = {
          ...course,
          title: `${course.title} (Copia)`,
          status: 'pending'
        }
        delete duplicateData.id
        delete duplicateData.stats
        
        await courseManagementService.createCourse(duplicateData)
        this.$toast.success('Curso duplicado exitosamente')
        await this.loadDashboardData()
      } catch (error) {
        console.error('Error duplicating course:', error)
        this.$toast.error('Error al duplicar el curso')
      }
    },
    
    async archiveCourse(course) {
      try {
        await courseManagementService.updateCourse(course.id, { status: 'archived' })
        this.$toast.success('Curso archivado exitosamente')
        await this.loadDashboardData()
      } catch (error) {
        console.error('Error archiving course:', error)
        this.$toast.error('Error al archivar el curso')
      }
    },
    
    async deleteCourse(course) {
      if (confirm('¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer.')) {
        try {
          await courseManagementService.deleteCourse(course.id)
          this.$toast.success('Curso eliminado exitosamente')
          await this.loadDashboardData()
        } catch (error) {
          console.error('Error deleting course:', error)
          this.$toast.error('Error al eliminar el curso')
        }
      }
    }
  }
}
</script>

<style scoped>
.course-thumbnail {
  border-radius: 8px;
}
</style>
