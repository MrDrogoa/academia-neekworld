import { createRouter, createWebHistory } from "vue-router";
import authService from "@/services/authService";
import TermsView from "@/views/TermsView.vue";

// Placeholder component for routes that haven't been created yet
const PlaceholderView = {
  template: `
    <div class="placeholder-view">
      <div class="container py-5 text-center">
        <h2>Page Under Construction</h2>
        <p>This page is currently being developed and will be available soon.</p>
        <router-link to="/" class="btn btn-primary">Return to Home</router-link>
      </div>
    </div>
  `,
};

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  // Rutas de autenticación (ya no necesarias, usamos dialog)
  {
    path: "/login",
    name: "login",
    redirect: "/", // Redirigir al home, el login se maneja por dialog
  },
  {
    path: "/register",
    name: "register",
    redirect: "/", // Redirigir al home, el registro se maneja por dialog
  },
  // Rutas protegidas
  {
    path: "/profile",
    name: "profile",
    component: () => import("../views/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashView.vue"),
    meta: { requiresAuth: true },
  },
  // Rutas de cursos
  {
    path: "/courses",
    name: "courses",
    component: () => import("../views/CourseCatalog.vue"),
  },
  {
    path: "/catalog",
    name: "catalog",
    component: () => import("../views/CourseCatalog.vue"),
  },
  {
    path: "/my-courses",
    name: "my-courses",
    component: () => import("../views/MyCourses.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/purchases",
    name: "purchases",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },
  {
    path: "/courses/:id",
    name: "CourseDetail",
    component: () => import("../views/courses/CourseDetail.vue"),
    props: true,
  },
  // Actualizar rutas de gestión de cursos para usar componentes reales
  {
    path: "/courses/create",
    name: "CreateCourse",
    component: () => import("../views/courses/CourseCreate.vue"),
    meta: { requiresAuth: true, roles: ["teacher", "admin"] },
  },
  {
    path: "/courses/:id/edit",
    name: "EditCourse",
    component: () => import("../views/courses/CourseEdit.vue"),
    props: true,
    meta: { requiresAuth: true, roles: ["teacher", "admin"] },
  },
  {
    path: "/courses/manage",
    name: "ManageCourses",
    component: () => import("../views/courses/CourseManage.vue"),
    meta: { requiresAuth: true, roles: ["teacher", "admin"] },
  },
  {
    path: "/courses/advanced-management",
    name: "AdvancedCourseManagement",
    component: () => import("../views/courses/AdvancedCourseManagement.vue"),
    meta: { requiresAuth: true, roles: ["teacher", "admin"] },
  },
  // Rutas de cursos del usuario
  {
    path: "/courses/enrolled",
    name: "EnrolledCourses",
    component: () => import("../views/courses/CourseEnrolled.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/courses/completed",
    name: "CompletedCourses",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },
  // Rutas de pago y checkout
  {
    path: "/courses/:id/checkout",
    name: "Checkout",
    component: () => import("../views/CheckoutView.vue"),
    meta: { requiresAuth: true, roles: ["student"] },
    props: (route) => ({ courseId: route.params.id }),
  },
  {
    path: "/payment/success",
    name: "PaymentSuccess",
    component: () => import("../views/PaymentSuccessView.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/cancel",
    name: "PaymentCancel",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/error",
    name: "PaymentError",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },

  // Transbank Routes
  {
    path: "/payment/transbank/return",
    name: "TransbankReturn",
    component: () => import("@/views/TransbankReturnView.vue"),
    meta: { requiresAuth: true },
  },

  // Stripe Routes
  {
    path: "/payment/stripe/checkout",
    name: "StripeCheckout",
    component: () => import("@/views/StripeCheckoutView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/payment/stripe/success",
    name: "StripeSuccess",
    component: () => import("@/views/PaymentSuccessView.vue"),
    meta: { requiresAuth: true },
  },

  // Khipu Routes
  {
    path: "/payment/khipu/return",
    name: "KhipuReturn",
    component: () => import("@/views/KhipuReturnView.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/payment/khipu/cancel",
    name: "KhipuCancel",
    component: () => import("@/views/PaymentCancelView.vue"),
    meta: { requiresAuth: true },
  },

  // Certificados - usando componente placeholder
  {
    path: "/certificates",
    name: "Certificates",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },

  // Rutas de evaluaciones
  {
    path: "/evaluations/:id/take",
    name: "ExamInterface",
    component: () => import("../views/ExamInterfaceView.vue"),
    meta: { requiresAuth: true, roles: ["student"] },
    props: true,
  },
  {
    path: "/evaluations/results/:responseId",
    name: "ExamResults",
    component: () => import("../views/ExamResultsView.vue"),
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/evaluations/reports",
    name: "EvaluationReports",
    component: () => import("../views/EvaluationReportsView.vue"),
    meta: { requiresAuth: true, roles: ["instructor", "admin"] },
  },

  // Configuración de cuenta - usando componente placeholder
  {
    path: "/account",
    name: "Account",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },
  // Panel de administración - usando componente placeholder
  {
    path: "/admin",
    name: "AdminPanel",
    component: () => import("../views/admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/admin/users",
    name: "UserManagement",
    component: () => import("../views/admin/UserManagementView.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },
  // Add the Moodle Courses route
  {
    path: "/moodle-courses",
    name: "MoodleCourses",
    component: () => import("../views/MoodleCoursesView.vue"),
  },
  // Contact route
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../views/ContactView.vue"),
  },

  // ===== RUTAS DEL SISTEMA DE PAGOS - FASE 4 =====

  // Dashboard principal de pagos
  {
    path: "/admin/payments",
    name: "PaymentDashboard",
    component: () => import("../components/PaymentDashboard.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Gestión de planes de pago
  {
    path: "/admin/payments/plans",
    name: "PaymentPlans",
    component: () => import("../components/PaymentPlans.vue"),
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Procesamiento de pagos
  {
    path: "/admin/payments/process",
    name: "ProcessPayment",
    component: PlaceholderView,
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Historial de pagos
  {
    path: "/admin/payments/history",
    name: "PaymentHistory",
    component: PlaceholderView,
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Gestión de suscripciones
  {
    path: "/admin/payments/subscriptions",
    name: "PaymentSubscriptions",
    component: PlaceholderView,
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Analytics de pagos
  {
    path: "/admin/payments/analytics",
    name: "PaymentAnalytics",
    component: PlaceholderView,
    meta: { requiresAuth: true, roles: ["admin"] },
  },

  // Vista de usuario: Mis pagos
  {
    path: "/my-payments",
    name: "UserPayments",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },

  // Vista de usuario: Mis suscripciones
  {
    path: "/my-subscriptions",
    name: "UserSubscriptions",
    component: PlaceholderView,
    meta: { requiresAuth: true },
  },

  // Checkout/Pago
  {
    path: "/checkout/:planId?",
    name: "Checkout",
    component: PlaceholderView,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: "/terms",
    name: "Terminos y condiciones",
    component: TermsView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Siempre vuelve al inicio cuando se cambia de página
    return { top: 0 };
  },
});

// Navigation guard para rutas protegidas con authService
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles;

  // Usar authService para verificar autenticación
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = currentUser.isAuthenticated;
  const userRole = currentUser.userData?.role;

  if (requiresAuth && !isAuthenticated) {
    // Redirigir al home y mostrar dialog de login
    next({ path: "/", query: { showAuth: "login", redirect: to.fullPath } });
  } else if (
    requiredRoles &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    // Usuario no tiene los permisos necesarios
    next({ path: "/dashboard" });
  } else {
    next();
  }
});

export default router;
