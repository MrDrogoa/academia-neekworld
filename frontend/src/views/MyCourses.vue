<template>
  <div class="my-courses">
    <v-container fluid>
      <!-- Header -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Mis Cursos</h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            Continúa tu aprendizaje donde lo dejaste
          </p>
        </div>
        
        <v-btn
          color="primary"
          variant="elevated"
          @click="$router.push('/catalog')"
        >
          <v-icon left>mdi-plus</v-icon>
          Explorar Más Cursos
        </v-btn>
      </div>

      <!-- Estadísticas rápidas -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center">
            <v-card-text>
              <v-icon size="40" color="primary" class="mb-2">mdi-book-open</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ enrolledCourses.length }}</h3>
              <p class="text-body-2 text-grey">Cursos Inscritos</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center">
            <v-card-text>
              <v-icon size="40" color="success" class="mb-2">mdi-check-circle</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ completedCount }}</h3>
              <p class="text-body-2 text-grey">Completados</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center">
            <v-card-text>
              <v-icon size="40" color="info" class="mb-2">mdi-clock</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ totalHours }}</h3>
              <p class="text-body-2 text-grey">Horas Totales</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="6" md="3">
          <v-card class="stat-card text-center">
            <v-card-text>
              <v-icon size="40" color="warning" class="mb-2">mdi-trophy</v-icon>
              <h3 class="text-h4 font-weight-bold">{{ certificatesCount }}</h3>
              <p class="text-body-2 text-grey">Certificados</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtros y búsqueda -->
      <v-card class="mb-6" elevation="1">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchTerm"
                label="Buscar en mis cursos"
                prepend-inner-icon="mdi-magnify"
                clearable
                density="compact"
                variant="outlined"
              ></v-text-field>
            </v-col>
            
            <v-col cols="12" md="3">
              <v-select
                v-model="filterStatus"
                :items="statusOptions"
                label="Estado"
                clearable
                density="compact"
                variant="outlined"
              ></v-select>
            </v-col>
            
            <v-col cols="12" md="3">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Ordenar por"
                density="compact"
                variant="outlined"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Loading spinner -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular
          indeterminate
          size="60"
          color="primary"
          class="mb-4"
        ></v-progress-circular>
        <p class="text-h6">Cargando tus cursos...</p>
      </div>

      <!-- Lista de cursos -->
      <div v-else-if="filteredCourses.length === 0" class="text-center py-12">
        <v-icon size="120" color="grey">mdi-school</v-icon>
        <h3 class="text-h5 mt-4 mb-2">No tienes cursos inscritos</h3>
        <p class="text-grey mb-4">Explora nuestro catálogo y comienza tu aprendizaje</p>
        <v-btn
          color="primary"
          size="large"
          @click="$router.push('/catalog')"
        >
          Explorar Cursos
        </v-btn>
      </div>

      <v-row v-else-if="!loading">
        <v-col
          v-for="course in filteredCourses"
          :key="course.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="course-card h-100" elevation="2">
            <!-- Imagen del curso -->
            <v-img
              :src="course.thumbnail || '/default-course.jpg'"
              height="180"
              cover
              class="course-image"
            >
              <div class="overlay d-flex align-end">
                <v-chip
                  :color="getStatusColor(course.status)"
                  size="small"
                  class="ma-2"
                >
                  {{ course.status }}
                </v-chip>
              </div>
            </v-img>

            <v-card-text class="pb-2">
              <!-- Título del curso -->
              <h3 class="text-h6 font-weight-bold mb-2">
                {{ course.title }}
              </h3>

              <!-- Instructor -->
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-1">mdi-account</v-icon>
                <span class="text-body-2 text-grey-darken-1">
                  {{ course.instructor }}
                </span>
              </div>

              <!-- Progreso -->
              <div class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-body-2">Progreso</span>
                  <span class="text-body-2 font-weight-bold">{{ course.progress }}%</span>
                </div>
                <v-progress-linear
                  :model-value="course.progress"
                  :color="getProgressColor(course.progress)"
                  height="6"
                  rounded
                ></v-progress-linear>
              </div>

              <!-- Información adicional -->
              <div class="d-flex justify-space-between text-body-2 text-grey-darken-1 mb-2">
                <span>
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ course.duration }}
                </span>
                <span>
                  <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(course.enrolledDate) }}
                </span>
              </div>

              <!-- Última actividad -->
              <div v-if="course.lastActivity" class="text-caption text-grey">
                Última actividad: {{ formatDate(course.lastActivity) }}
              </div>
            </v-card-text>

            <v-card-actions>
              <!-- Botón principal -->
              <v-btn
                v-if="course.status === 'En Progreso'"
                color="primary"
                variant="elevated"
                block
                @click="continueCourse(course)"
              >
                <v-icon left>mdi-play</v-icon>
                Continuar Curso
              </v-btn>

              <v-btn
                v-else-if="course.status === 'No Iniciado'"
                color="success"
                variant="elevated"
                block
                @click="startCourse(course)"
              >
                <v-icon left>mdi-play-circle</v-icon>
                Iniciar Curso
              </v-btn>

              <v-btn
                v-else-if="course.status === 'Completado'"
                color="info"
                variant="outlined"
                block
                @click="reviewCourse(course)"
              >
                <v-icon left>mdi-eye</v-icon>
                Revisar Curso
              </v-btn>

              <!-- Menú de opciones -->
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    variant="text"
                    size="small"
                    v-bind="props"
                  ></v-btn>
                </template>
                <v-list>
                  <v-list-item @click="viewCourseDetails(course)">
                    <v-list-item-title>Ver Detalles</v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="course.status === 'Completado'" @click="downloadCertificate(course)">
                    <v-list-item-title>Descargar Certificado</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="shareCourse(course)">
                    <v-list-item-title>Compartir</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Cursos recomendados -->
      <div v-if="recommendedCourses.length > 0" class="mt-12">
        <h2 class="text-h5 font-weight-bold mb-4">Cursos Recomendados</h2>
        <v-row>
          <v-col
            v-for="course in recommendedCourses"
            :key="course.id"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card class="recommendation-card" elevation="1" hover>
              <v-img
                :src="course.thumbnail || '/default-course.jpg'"
                height="150"
                cover
              ></v-img>
              
              <v-card-text>
                <h4 class="text-subtitle-1 font-weight-bold mb-1">
                  {{ course.title }}
                </h4>
                <p class="text-body-2 text-grey-darken-1 mb-2">
                  {{ course.instructor }}
                </p>
                <div class="d-flex justify-space-between align-center">
                  <span class="text-h6 font-weight-bold text-primary">
                    {{ formatCurrency(course.price) }}
                  </span>
                  <v-btn
                    color="primary"
                    size="small"
                    variant="outlined"
                    @click="viewCourse(course)"
                  >
                    Ver Curso
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import neekworldService from '@/services/neekworldService'

export default {
  name: 'MyCourses',
  setup() {
    const router = useRouter()
    const searchTerm = ref('')
    const filterStatus = ref('')
    const sortBy = ref('recent')

    const snackbar = ref({
      show: false,
      message: '',
      color: 'success'
    })

    // Datos de demo
    const enrolledCourses = ref([])
    const recommendedCourses = ref([])
    const loading = ref(true)

    // Cargar cursos inscritos (simulados o desde API)
    const loadEnrolledCourses = async () => {
      try {
        loading.value = true

        // Obtener cursos reales de Neekworld para recomendaciones
        const neekworldResult = await neekworldService.getCourses()
        if (neekworldResult.success && neekworldResult.courses.length > 0) {
          // Usar algunos cursos de Neekworld como recomendaciones
          recommendedCourses.value = neekworldResult.courses
            .slice(0, 3)
            .map(course => ({
              id: course.id,
              title: course.title,
              instructor: course.instructor,
              price: course.price,
              thumbnail: course.thumbnail || '/default-course.jpg'
            }))
        }

        // Cargar cursos inscritos desde localStorage o datos predeterminados
        const savedCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]')
        
        if (savedCourses.length > 0) {
          enrolledCourses.value = savedCourses
        } else {
          // Datos de demo con algunos cursos de Neekworld si están disponibles
          enrolledCourses.value = [
            {
              id: 'course_001',
              title: 'Desarrollo Web con Vue.js 3',
              instructor: 'María González',
              duration: '40 horas',
              status: 'En Progreso',
              progress: 65,
              thumbnail: '/course-vue.jpg',
              enrolledDate: '2024-01-15',
              lastActivity: '2024-02-01'
            },
            {
              id: 'course_002',
              title: 'Python para Data Science',
              instructor: 'Carlos Ruiz',
              duration: '60 horas',
              status: 'Completado',
              progress: 100,
              thumbnail: '/course-python.jpg',
              enrolledDate: '2023-12-01',
              lastActivity: '2024-01-20'
            }
          ]

          // Si hay cursos de Neekworld disponibles, agregar uno como "En Progreso"
          if (neekworldResult.success && neekworldResult.courses.length > 0) {
            const neekCourse = neekworldResult.courses[0]
            enrolledCourses.value.push({
              id: neekCourse.id,
              title: neekCourse.title,
              instructor: neekCourse.instructor,
              duration: '45 horas',
              status: 'No Iniciado',
              progress: 0,
              thumbnail: neekCourse.thumbnail || '/default-course.jpg',
              enrolledDate: new Date().toISOString().split('T')[0],
              lastActivity: null,
              isNeekworldCourse: true
            })
          }
        }

      } catch (error) {
        console.error('Error cargando cursos:', error)
        showSnackbar('Error al cargar cursos', 'error')
      } finally {
        loading.value = false
      }
    }

    const statusOptions = [
      'No Iniciado',
      'En Progreso',
      'Completado'
    ]

    const sortOptions = [
      { title: 'Más recientes', value: 'recent' },
      { title: 'Por progreso', value: 'progress' },
      { title: 'Alfabético', value: 'alphabetical' },
      { title: 'Por duración', value: 'duration' }
    ]

    // Computadas
    const filteredCourses = computed(() => {
      let courses = [...enrolledCourses.value]

      // Filtro por búsqueda
      if (searchTerm.value) {
        courses = courses.filter(course =>
          course.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
      }

      // Filtro por estado
      if (filterStatus.value) {
        courses = courses.filter(course => course.status === filterStatus.value)
      }

      // Ordenamiento
      switch (sortBy.value) {
        case 'progress':
          courses.sort((a, b) => b.progress - a.progress)
          break
        case 'alphabetical':
          courses.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'duration':
          courses.sort((a, b) => parseInt(a.duration) - parseInt(b.duration))
          break
        case 'recent':
        default:
          courses.sort((a, b) => new Date(b.enrolledDate) - new Date(a.enrolledDate))
          break
      }

      return courses
    })

    const completedCount = computed(() => {
      return enrolledCourses.value.filter(course => course.status === 'Completado').length
    })

    const totalHours = computed(() => {
      return enrolledCourses.value.reduce((total, course) => {
        return total + parseInt(course.duration)
      }, 0)
    })

    const certificatesCount = computed(() => {
      return enrolledCourses.value.filter(course => course.status === 'Completado').length
    })

    // Métodos
    const getStatusColor = (status) => {
      switch (status) {
        case 'No Iniciado':
          return 'grey'
        case 'En Progreso':
          return 'primary'
        case 'Completado':
          return 'success'
        default:
          return 'grey'
      }
    }

    const getProgressColor = (progress) => {
      if (progress < 30) return 'error'
      if (progress < 70) return 'warning'
      return 'success'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-CL')
    }

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP'
      }).format(amount)
    }

    const startCourse = (course) => {
      course.status = 'En Progreso'
      course.progress = 5
      course.lastActivity = new Date().toISOString().split('T')[0]
      
      // Guardar estado actualizado
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses.value))
      
      showSnackbar(`¡Has iniciado el curso "${course.title}"!`, 'success')
      
      // Si es un curso de Neekworld, abrir en Moodle
      if (course.isNeekworldCourse) {
        setTimeout(() => {
          const moodleUrl = `https://neekworld.cl/NW/course/view.php?id=${course.id}`
          window.open(moodleUrl, '_blank')
        }, 1000)
      }
    }

    const continueCourse = (course) => {
      // Actualizar última actividad
      course.lastActivity = new Date().toISOString().split('T')[0]
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses.value))
      
      showSnackbar(`Continuando "${course.title}"...`, 'info')
      
      // Redirigir a la plataforma LMS (Moodle real)
      const moodleUrl = `https://neekworld.cl/NW/course/view.php?id=${course.id}`
      window.open(moodleUrl, '_blank')
    }

    const reviewCourse = (course) => {
      showSnackbar(`Revisando "${course.title}"...`, 'info')
      
      // Redirigir a la plataforma LMS (Moodle real)
      const moodleUrl = `https://neekworld.cl/NW/course/view.php?id=${course.id}`
      window.open(moodleUrl, '_blank')
    }

    const viewCourseDetails = (course) => {
      router.push(`/courses/${course.id}`)
    }

    const downloadCertificate = (course) => {
      showSnackbar(`Descargando certificado de "${course.title}"...`, 'success')
      // En producción, descargar el certificado real
    }

    const shareCourse = (course) => {
      if (navigator.share) {
        navigator.share({
          title: course.title,
          text: `¡Estoy estudiando ${course.title}!`,
          url: window.location.origin + `/courses/${course.id}`
        })
      } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(window.location.origin + `/courses/${course.id}`)
        showSnackbar('Enlace copiado al portapapeles', 'success')
      }
    }

    const viewCourse = (course) => {
      router.push(`/courses/${course.id}`)
    }

    const showSnackbar = (message, color = 'success') => {
      snackbar.value = {
        show: true,
        message,
        color
      }
    }

    onMounted(async () => {
      // Cargar cursos base
      await loadEnrolledCourses()
      
      // Procesar compras recientes
      const recentPurchases = JSON.parse(localStorage.getItem('recentPurchases') || '[]')
      
      if (recentPurchases.length > 0) {
        // Agregar cursos comprados recientemente a la lista
        recentPurchases.forEach(purchase => {
          const existingCourse = enrolledCourses.value.find(c => c.id === purchase.id)
          if (!existingCourse) {
            enrolledCourses.value.unshift({
              ...purchase,
              status: 'No Iniciado',
              progress: 0,
              enrolledDate: new Date().toISOString().split('T')[0],
              lastActivity: null,
              isRecentPurchase: true
            })
          }
        })
        
        // Guardar la lista actualizada
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses.value))
        
        // Limpiar compras recientes después de agregarlas
        localStorage.removeItem('recentPurchases')
        
        if (recentPurchases.length === 1) {
          showSnackbar(`¡Bienvenido a "${recentPurchases[0].title}"! Ya puedes comenzar tu aprendizaje.`, 'success')
        } else {
          showSnackbar(`¡Has adquirido ${recentPurchases.length} cursos nuevos! Ya puedes comenzar tu aprendizaje.`, 'success')
        }
      }
    })

    return {
      searchTerm,
      filterStatus,
      sortBy,
      snackbar,
      enrolledCourses,
      recommendedCourses,
      statusOptions,
      sortOptions,
      filteredCourses,
      completedCount,
      totalHours,
      certificatesCount,
      loading,
      loadEnrolledCourses,
      getStatusColor,
      getProgressColor,
      formatDate,
      formatCurrency,
      startCourse,
      continueCourse,
      reviewCourse,
      viewCourseDetails,
      downloadCertificate,
      shareCourse,
      viewCourse
    }
  }
}
</script>

<style scoped>
.stat-card {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.course-card {
  transition: transform 0.2s ease-in-out;
}

.course-card:hover {
  transform: translateY(-4px);
}

.recommendation-card {
  transition: transform 0.2s ease-in-out;
}

.recommendation-card:hover {
  transform: translateY(-2px);
}

.course-image {
  position: relative;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

@media (max-width: 600px) {
  .course-card .text-h6 {
    font-size: 1.1rem;
  }
}
</style>
