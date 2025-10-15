<template>
  <section class="bg-dash">
    <v-container class="dashboard pa-4">
      <!-- Encabezado del Dashboard -->
      <header class="dashboard-header mb-6">
        <h2
          id="dashboard-title"
          class="title-card text-center py-5 display-5 display-lg-4"
        >
          Dashboard
        </h2>
        <p class="text-body-1 text-center" aria-describedby="dashboard-title">
          {{ welcomeMessage }}
        </p>
      </header>

      <!-- Loading state -->
      <div
        v-if="isLoading"
        role="status"
        aria-live="polite"
        aria-label="Cargando información"
      >
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              aria-label="Indicador de carga"
            ></v-progress-circular>
            <p class="mt-4">Cargando tu información...</p>
          </v-col>
        </v-row>
      </div>

      <!-- Error state -->
      <div v-else-if="errorMessage" role="alert" aria-live="assertive">
        <v-row justify="center">
          <v-col cols="12" md="6" class="text-center">
            <v-alert type="error" class="mb-4">{{ errorMessage }}</v-alert>
            <v-btn
              color="primary"
              @click="fetchData"
              aria-label="Reintentar carga de datos"
            >
              Reintentar
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <!-- Dashboard content -->
      <template v-else>
        <!-- Layout principal con sidebar y contenido -->
        <div class="row dashboard-main">
          <!-- Sidebar izquierdo con perfil -->
          <div class="col-md-3 col-12 mb-4">
            <div class="dashboard-sidebar">
              <!-- Imagen/Avatar del usuario -->
              <div class="user-avatar-section text-center mb-3">
                <div class="user-avatar">
                  <i
                    class="mdi mdi-account-circle"
                    style="font-size: 80px; color: #6c757d"
                  ></i>
                </div>
                <h4 class="mt-2">{{ userName }}</h4>
                <p class="text-muted txt-dash">
                  {{
                    userRole === "student"
                      ? "Estudiante"
                      : userRole === "teacher"
                      ? "Profesor"
                      : "Administrador"
                  }}
                </p>
              </div>

              <!-- Perfil Card -->
              <DashboardProfileCard :user="user" :role="userRole" />

              <!-- Acciones rápidas -->
              <DashboardQuickActionsCard :actions="quickActions" />
            </div>
          </div>

          <!-- Contenido principal -->
          <div class="col-md-9 col-12">
            <!-- Navigation Buttons Grid -->
            <DashboardNavigationButtons :userRole="userRole" class="dash-1" />

            <!-- Real-time Metrics Component -->
            <RealTimeMetrics
              :userRole="userRole"
              @metrics-updated="handleMetricsUpdate"
            />

            <!-- Grid de tarjetas principales -->
            <div class="row mb-4">
              <div class="col-lg-6 col-md-6 col-12 mb-3">
                <div class="dashboard-card-wrapper">
                  <div class="card-header bg-primary text-white text-center">
                    <h5 class="mb-0 txt-card-course">Cursos</h5>
                  </div>
                  <div class="card-body">
                    <h6 class="txt-card-course">Subtitle</h6>
                    <p class="text-muted txt-card-course">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum porta id metus non pellentesque.
                    </p>
                    <!-- Componente de cursos según rol -->
                    <div v-if="userRole === 'student'">
                      <DashboardStudentCourses
                        :inProgressCourses="inProgressCourses"
                        :enrolledCourses="enrolledCourses"
                      />
                    </div>
                    <div v-else-if="userRole === 'teacher'">
                      <DashboardTeacherCourses :courses="teacherCourses" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 col-md-6 col-12 mb-3">
                <div class="dashboard-card-wrapper">
                  <div class="card-header bg-primary text-white text-center">
                    <h5 class="mb-0 txt-card-course">Facturas</h5>
                  </div>
                  <div class="card-body">
                    <h6 class="txt-card-course">Subtitle</h6>
                    <p class="text-muted txt-card-course">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum porta id metus non pellentesque.
                    </p>
                    <!-- Componente de actividad -->
                    <DashboardActivityCard :activities="recentActivity" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Segunda fila de tarjetas -->
            <div class="row mb-4">
              <div class="col-lg-6 col-md-6 col-12 mb-3">
                <div class="dashboard-card-wrapper">
                  <div class="card-header bg-primary text-white text-center">
                    <h5 class="mb-0 txt-card-course">Becas</h5>
                  </div>
                  <div class="card-body">
                    <h6 class="txt-card-course">Subtitle</h6>
                    <p class="text-muted txt-card-course">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum porta id metus non pellentesque.
                    </p>
                    <!-- Métricas específicas según rol -->
                    <div v-if="userRole === 'student'">
                      <DashboardStudentMetrics
                        :completedCoursesCount="completedCoursesCount"
                        :completedCoursesPercentage="completedCoursesPercentage"
                        :passedEvaluationsCount="passedEvaluationsCount"
                        :passedEvaluationsPercentage="
                          passedEvaluationsPercentage
                        "
                        :certificatesCount="certificatesCount"
                      />
                    </div>
                    <div v-else-if="userRole === 'teacher'">
                      <DashboardTeacherStats
                        :teacherCourses="teacherCourses"
                        :totalStudentsCount="totalStudentsCount"
                        :pendingEvaluationsCount="pendingEvaluationsCount"
                      />
                    </div>
                    <div v-else-if="userRole === 'admin'">
                      <DashboardSalesSummary
                        :stats="adminStats"
                        :formatPrice="formatPrice"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-6 col-md-6 col-12 mb-3">
                <div class="dashboard-card-wrapper">
                  <div class="card-header bg-primary text-white text-center">
                    <h5 class="mb-0 txt-card-course">Certificados</h5>
                  </div>
                  <div class="card-body">
                    <h6 class="txt-card-course">Subtitle</h6>
                    <p class="text-muted txt-card-course">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum porta id metus non pellentesque.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarjeta de preferencias centrada -->
            <div class="row justify-content-center mb-4">
              <div class="col-lg-8 col-md-10 col-12">
                <div class="dashboard-card-wrapper">
                  <div class="card-header bg-primary text-white text-center">
                    <h5 class="mb-0 txt-card-course">Preferencias</h5>
                  </div>
                  <div class="card-body text-center">
                    <h6 class="txt-card-course">Subtitle</h6>
                    <p class="text-muted txt-card-course">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Vestibulum porta id metus non pellentesque.
                    </p>

                    <!-- Componentes adicionales según rol -->
                    <div
                      v-if="
                        userRole === 'student' && recommendedCourses.length > 0
                      "
                    >
                      <DashboardRecommendedCourses
                        :courses="recommendedCourses"
                      />
                    </div>
                    <div v-else-if="userRole === 'teacher'">
                      <DashboardStudentActivity
                        :activities="recentStudentActivity"
                      />
                    </div>
                    <div v-else-if="userRole === 'admin'">
                      <DashboardAdminMetrics :stats="adminStats" />
                      <DashboardCampaigns
                        :campaigns="adminStats.activeCampaigns"
                        :formatDate="formatDate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </v-container>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { formatPrice } from "@/utils/courseUtils";
import DashboardProfileCard from "@/components/dashboard/DashboardProfileCard.vue";
import DashboardActivityCard from "@/components/dashboard/DashboardActivityCard.vue";
import DashboardQuickActionsCard from "@/components/dashboard/DashboardQuickActionsCard.vue";
import DashboardStudentCourses from "@/components/dashboard/DashboardStudentCourses.vue";
import DashboardStudentMetrics from "@/components/dashboard/DashboardStudentMetrics.vue";
import DashboardRecommendedCourses from "@/components/dashboard/DashboardRecommendedCourses.vue";
import DashboardTeacherStats from "@/components/dashboard/DashboardTeacherStats.vue";
import DashboardTeacherCourses from "@/components/dashboard/DashboardTeacherCourses.vue";
import DashboardStudentActivity from "@/components/dashboard/DashboardStudentActivity.vue";
import DashboardAdminMetrics from "@/components/dashboard/DashboardAdminMetrics.vue";
import DashboardSalesSummary from "@/components/dashboard/DashboardSalesSummary.vue";
import DashboardCampaigns from "@/components/dashboard/DashboardCampaigns.vue";
import DashboardNavigationButtons from "@/components/dashboard/DashboardNavigationButtons.vue";
import RealTimeMetrics from "@/components/dashboard/RealTimeMetrics.vue";

export default {
  name: "DashView",

  components: {
    DashboardProfileCard,
    DashboardActivityCard,
    DashboardQuickActionsCard,
    DashboardStudentCourses,
    DashboardStudentMetrics,
    DashboardRecommendedCourses,
    DashboardTeacherStats,
    DashboardTeacherCourses,
    DashboardStudentActivity,
    DashboardAdminMetrics,
    DashboardSalesSummary,
    DashboardCampaigns,
    DashboardNavigationButtons,
    RealTimeMetrics,
  },

  data() {
    return {
      errorMessage: "",
      recentActivity: [
        {
          title: "Iniciaste sesión",
          icon: "mdi-login",
          time: "Ahora",
          color: "primary",
        },
        {
          title: "Visitaste el curso de Python",
          icon: "mdi-book-open-variant",
          time: "Ayer",
          color: "grey",
        },
        {
          title: "Completaste una lección",
          icon: "mdi-check-circle",
          time: "3 días",
          color: "grey",
        },
      ],
      adminStats: {
        usersCount: 256,
        coursesCount: 42,
        enrollmentsCount: 318,
        pendingSalesCount: 8,
        totalRevenue: 1658000,
        salesThisMonth: 24,
        salesByStatus: {
          pending: 8,
          paid: 5,
          completed: 178,
          refunded: 2,
        },
        activeCampaigns: [
          {
            id: "camp1",
            name: "Descuento Primavera",
            discount: 25,
            endDate: "2023-12-20",
          },
          {
            id: "camp2",
            name: "Navidad 2023",
            discount: 30,
            endDate: "2023-12-26",
          },
        ],
      },
      // Los datos de métricas ahora vienen del componente RealTimeMetrics
      // que se conecta directamente con Firebase a través de MetricsService
    };
  },

  computed: {
    ...mapState({
      user: (state) => state.user,
      loading: (state) => state.loading,
    }),

    ...mapGetters(["isAuthenticated", "isLoading", "userRole"]),

    ...mapGetters("courses", ["enrolledCourses", "teacherCourses"]),

    welcomeMessage() {
      const hour = new Date().getHours();
      let greeting = "Buenos días";

      if (hour >= 12 && hour < 18) {
        greeting = "Buenas tardes";
      } else if (hour >= 18) {
        greeting = "Buenas noches";
      }

      return `${greeting}, ${this.userName}. Bienvenido/a a tu panel de control.`;
    },

    userName() {
      return this.user?.name || "Usuario";
    },

    quickActions() {
      // Acciones basadas en el rol del usuario
      if (this.userRole === "student") {
        return [
          {
            title: "Ver mis cursos",
            icon: "mdi-book-open-page-variant",
            to: "/courses/enrolled",
            color: "primary",
          },
          {
            title: "Explorar cursos",
            icon: "mdi-magnify",
            to: "/courses",
            color: "secondary",
          },
          {
            title: "Mis certificados",
            icon: "mdi-certificate",
            to: "/certificates",
            color: "success",
          },
        ];
      } else if (this.userRole === "teacher") {
        return [
          {
            title: "Mis cursos",
            icon: "mdi-book-edit",
            to: "/courses/manage",
            color: "primary",
          },
          {
            title: "Crear curso",
            icon: "mdi-plus-circle",
            to: "/courses/create",
            color: "success",
          },
          {
            title: "Evaluar estudiantes",
            icon: "mdi-clipboard-text",
            to: "/teacher/evaluations",
            color: "info",
          },
        ];
      } else if (this.userRole === "admin") {
        return [
          {
            title: "Gestionar usuarios",
            icon: "mdi-account-group",
            to: "/admin/users",
            color: "primary",
          },
          {
            title: "Gestionar cursos",
            icon: "mdi-book-multiple",
            to: "/courses/manage",
            color: "secondary",
          },
          {
            title: "Gestionar ventas",
            icon: "mdi-currency-usd",
            to: "/admin/sales",
            color: "success",
          },
        ];
      }

      return [
        {
          title: "Completar perfil",
          icon: "mdi-account-edit",
          to: "/profile",
        },
        {
          title: "Explorar cursos",
          icon: "mdi-magnify",
          to: "/courses",
        },
      ];
    },

    // Student-specific computed properties
    inProgressCourses() {
      if (!this.enrolledCourses) return [];

      return this.enrolledCourses
        .filter((course) => course.progress < 100)
        .sort((a, b) => b.progress - a.progress);
    },

    completedCoursesCount() {
      if (!this.enrolledCourses) return 0;
      return this.enrolledCourses.filter((course) => course.progress === 100)
        .length;
    },

    completedCoursesPercentage() {
      if (!this.enrolledCourses || this.enrolledCourses.length === 0) return 0;
      return (this.completedCoursesCount / this.enrolledCourses.length) * 100;
    },

    passedEvaluationsCount() {
      if (!this.enrolledCourses) return 0;

      return this.enrolledCourses.reduce((count, course) => {
        return count + (course.passedEvaluations?.length || 0);
      }, 0);
    },

    passedEvaluationsPercentage() {
      if (!this.totalEvaluationsCount) return 0;
      return (this.passedEvaluationsCount / this.totalEvaluationsCount) * 100;
    },

    totalEvaluationsCount() {
      if (!this.enrolledCourses) return 0;

      return this.enrolledCourses.reduce((count, course) => {
        return count + (course.totalEvaluations || 0);
      }, 0);
    },

    certificatesCount() {
      if (!this.enrolledCourses) return 0;
      return this.enrolledCourses.filter((course) => course.certificateIssued)
        .length;
    },

    recommendedCourses() {
      return []; // Esto debería venir de una API basada en intereses del usuario
    },

    // Teacher-specific computed properties
    totalStudentsCount() {
      if (!this.teacherCourses) return 0;

      return this.teacherCourses.reduce((count, course) => {
        return count + (course.enrollmentCount || 0);
      }, 0);
    },

    pendingEvaluationsCount() {
      return 0; // Esto debería venir de una API
    },

    recentStudentActivity() {
      return []; // Esto debería venir de una API
    },
  },

  methods: {
    ...mapActions("courses", ["fetchEnrolledCourses", "fetchTeacherCourses"]),

    formatPrice(value) {
      return formatPrice(value);
    },

    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("es-CL");
    },

    handleMetricsUpdate(updateInfo) {
      // Las métricas ahora se actualizan directamente desde Firebase
      console.log("Métricas actualizadas desde Firebase:", updateInfo);

      // Mostrar notificación de actualización
      if (this.$toast) {
        this.$toast.success("Datos actualizados en tiempo real");
      }
    },

    fetchData() {
      this.errorMessage = "";

      // Si el usuario está autenticado, cargar sus datos
      if (this.isAuthenticated) {
        if (this.userRole === "student") {
          // eslint-disable-next-line no-unused-vars
          this.fetchEnrolledCourses().catch((_err) => {
            this.errorMessage =
              "No pudimos cargar tus cursos. Inténtalo de nuevo más tarde.";
          });
        } else if (this.userRole === "teacher") {
          // eslint-disable-next-line no-unused-vars
          this.fetchTeacherCourses().catch((_err) => {
            this.errorMessage =
              "No pudimos cargar tus cursos. Inténtalo de nuevo más tarde.";
          });
        }
      }
    },
  },

  created() {
    this.fetchData();
  },
};
</script>

<style>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.title-card {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

/* Dashboard Main Layout */
.dashboard-main {
  margin: 0;
}

/* Sidebar Styles */
.dashboard-sidebar {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 20px;
}

.user-avatar-section {
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 10px;
}

/* Card Wrapper Styles */
.dashboard-card-wrapper {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.dashboard-card-wrapper:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.dashboard-card-wrapper .card-header {
  background: linear-gradient(135deg, #20b2aa, #17a2b8) !important;
  color: white;
  padding: 15px;
  border: none;
  font-weight: 600;
}

.dashboard-card-wrapper .card-body {
  padding: 20px;
}

.dashboard-card-wrapper .card-body h6 {
  color: #666;
  font-weight: 600;
  margin-bottom: 10px;
}

.dashboard-card-wrapper .card-body p.text-muted {
  color: #999 !important;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-sidebar {
    position: static;
    margin-bottom: 20px;
  }

  .dashboard-card-wrapper {
    margin-bottom: 20px;
  }
}

/* Override Vuetify styles if needed */
:deep(.v-container) {
  padding-left: 0;
  padding-right: 0;
}

/* Ensure Bootstrap grid works properly */
.row {
  margin-left: -15px;
  margin-right: -15px;
}

.col-12,
.col-md-3,
.col-md-9,
.col-lg-6,
.col-md-6,
.col-lg-8,
.col-md-10 {
  padding-left: 15px;
  padding-right: 15px;
}
</style>
