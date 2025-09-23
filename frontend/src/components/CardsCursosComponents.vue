<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import cartService from "@/services/cartService";
import moodleIntegrationService from "@/services/moodleIntegrationService";
import neekworldService from "@/services/neekworldService";

// Variables reactivas
const searchTerm = ref("");
const selectedCategory = ref("");
const selectedLevel = ref("");
const sortBy = ref("popularity");
const currentPage = ref(1);
const coursesPerPage = ref(3); // Mostrar menos cursos en home
const addingToCart = reactive({});
const loading = ref(false);
const dataSource = ref("mock");

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
});

// Cursos dinámicos (se cargan desde las APIs o mock data)
const allCourses = ref([]);

// Computed properties
const filteredCourses = computed(() => {
  let courses = [...allCourses.value];

  // Filtro por búsqueda
  if (searchTerm.value) {
    courses = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
        course.description
          .toLowerCase()
          .includes(searchTerm.value.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  }

  // Filtro por categoría
  if (selectedCategory.value) {
    courses = courses.filter(
      (course) => course.category === selectedCategory.value
    );
  }

  // Filtro por nivel
  if (selectedLevel.value) {
    courses = courses.filter((course) => course.level === selectedLevel.value);
  }

  // Ordenamiento
  switch (sortBy.value) {
    case "price_asc":
      courses.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      courses.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      courses.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      // Por ahora mantener el orden original
      break;
    case "popularity":
    default:
      courses.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  // Paginación (mostrar solo los primeros cursos para home)
  const start = (currentPage.value - 1) * coursesPerPage.value;
  const end = start + coursesPerPage.value;

  return courses.slice(start, end);
});

// Métodos necesarios
const getLevelColor = (level) => {
  switch (level) {
    case "Principiante":
      return "success";
    case "Intermedio":
      return "warning";
    case "Avanzado":
      return "error";
    default:
      return "primary";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
};

const isInCart = (courseId) => {
  return cartService.isInCart(courseId);
};

const addToCart = async (course) => {
  addingToCart[course.id] = true;

  try {
    const result = cartService.addCourse(course);

    if (result.success) {
      showSnackbar(result.message, "success");
    } else {
      showSnackbar(result.message, "warning");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    showSnackbar("Error al agregar al carrito", "error");
  } finally {
    setTimeout(() => {
      addingToCart[course.id] = false;
    }, 500);
  }
};

const selectCourse = (course) => {
  if (!isInCart(course.id)) {
    addToCart(course);
  }
};

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    show: true,
    message,
    color,
  };
};

// Función para convertir curso de Moodle a formato de la plataforma
const convertMoodleCourse = (moodleCourse) => {
  return {
    id: `moodle_${moodleCourse.id}`,
    moodleId: moodleCourse.id,
    title: moodleCourse.fullname || moodleCourse.shortname,
    description: moodleCourse.summary || "Curso disponible en Moodle QA",
    instructor: "Instructor Moodle",
    duration: "40 horas",
    level: "Intermedio",
    category: moodleCourse.categoryname || "General",
    price: 49900,
    originalPrice: 69900,
    rating: 4.5,
    reviewCount: 0,
    thumbnail: "/default-course.jpg",
    tags: ["Moodle", "E-learning"],
    source: "moodle",
    isRealCourse: false,
  };
};

// Función para cargar cursos desde Neekworld
const loadCoursesFromNeekworld = async () => {
  loading.value = true;
  try {
    console.log("🌍 Intentando obtener cursos desde Neekworld...");
    const result = await neekworldService.getCourses();

    console.log("📊 Resultado de Neekworld:", result);

    if (result.success && result.courses.length > 0) {
      console.log("✅ Cursos obtenidos de Neekworld:", result.courses.length);
      console.log("📋 Primeros 3 cursos:", result.courses.slice(0, 3));

      dataSource.value = "neekworld";
      allCourses.value = result.courses;

      showSnackbar(
        `${result.courses.length} cursos cargados desde Neekworld`,
        "success"
      );
    } else {
      throw new Error("No se encontraron cursos en Neekworld");
    }
  } catch (error) {
    console.warn(
      "⚠️ No se pudieron cargar cursos de Neekworld:",
      error.message
    );
    await loadCoursesFromMoodle();
  } finally {
    loading.value = false;
  }
};

// Función para cargar cursos desde Moodle QA
const loadCoursesFromMoodle = async () => {
  loading.value = true;
  try {
    console.log("🔍 Intentando obtener cursos desde Moodle QA...");
    const result = await moodleIntegrationService.getCoursesFromMoodle();

    if (result.success && result.courses.length > 0) {
      console.log("✅ Cursos obtenidos de Moodle:", result.courses.length);
      dataSource.value = "moodle";

      const moodleCourses = result.courses.map(convertMoodleCourse);
      allCourses.value = moodleCourses;

      showSnackbar(
        `${moodleCourses.length} cursos cargados desde Moodle QA`,
        "success"
      );
    } else {
      throw new Error("No se encontraron cursos en Moodle QA");
    }
  } catch (error) {
    console.warn(
      "⚠️ No se pudieron cargar cursos de Moodle, usando cursos de prueba:",
      error.message
    );
    dataSource.value = "mock";
    loadMockCourses();
    showSnackbar(
      "Mostrando cursos de ejemplo (APIs no disponibles)",
      "warning"
    );
  } finally {
    loading.value = false;
  }
};

// Función para cargar cursos de prueba (fallback)
const loadMockCourses = () => {
  allCourses.value = [
    {
      id: "course_001",
      title: "Desarrollo Web con Vue.js 3",
      description:
        "Aprende a crear aplicaciones web modernas con Vue.js 3, Vuetify y las mejores prácticas.",
      instructor: "María González",
      duration: "40 horas",
      level: "Intermedio",
      category: "Desarrollo Web",
      price: 89900,
      originalPrice: 129900,
      rating: 4.8,
      reviewCount: 234,
      thumbnail: "/img-courses/desarrollo-web-fullstack-con react-y-node.png",
      tags: ["Vue.js", "JavaScript", "Frontend", "SPA"],
      source: "mock",
      isRealCourse: true,
    },
    {
      id: "course_002",
      title: "Python para Data Science",
      description:
        "Domina Python, pandas, numpy y matplotlib para análisis de datos profesional.",
      instructor: "Carlos Ruiz",
      duration: "60 horas",
      level: "Principiante",
      category: "Data Science",
      price: 109900,
      originalPrice: 159900,
      rating: 4.9,
      reviewCount: 456,
      thumbnail: "/img-courses/inteligencia-artificial-y-machine-learning.png",
      tags: ["Python", "Pandas", "NumPy", "Machine Learning"],
      source: "mock",
      isRealCourse: false,
    },
    {
      id: "course_003",
      title: "Marketing Digital Completo",
      description:
        "Estrategias de marketing digital, SEO, SEM, redes sociales y análisis de métricas.",
      instructor: "Pedro Sánchez",
      duration: "50 horas",
      level: "Principiante",
      category: "Marketing",
      price: 69900,
      originalPrice: 89900,
      rating: 4.6,
      reviewCount: 312,
      thumbnail: "/img-courses/marketing-digital-y-redes-sociales.png",
      tags: ["SEO", "Google Ads", "Social Media", "Analytics"],
      source: "mock",
      isRealCourse: true,
    },
    {
      id: "course_004",
      title: "React Native Masterclass",
      description:
        "Desarrolla aplicaciones móviles nativas para iOS y Android con React Native.",
      instructor: "Sofia López",
      duration: "55 horas",
      level: "Intermedio",
      category: "Desarrollo Móvil",
      price: 99900,
      originalPrice: 139900,
      rating: 4.7,
      reviewCount: 267,
      thumbnail: "/img-courses/desarrollo-web-fullstack-con react-y-node.png",
      tags: ["React Native", "Mobile Development", "iOS", "Android"],
      source: "mock",
      isRealCourse: false,
    },
    {
      id: "course_005",
      title: "UX/UI Design para Aplicaciones Web",
      description:
        "Diseña interfaces de usuario atractivas y funcionales con principios de UX/UI moderno.",
      instructor: "Laura Martínez",
      duration: "45 horas",
      level: "Intermedio",
      category: "Diseño",
      price: 79900,
      originalPrice: 99900,
      rating: 4.5,
      reviewCount: 189,
      thumbnail: "/img-courses/ux-ui-design-para-aplicaciones-web.png",
      tags: ["UX", "UI", "Design", "Figma"],
      source: "mock",
      isRealCourse: true,
    },
    {
      id: "course_006",
      title: "Ciberseguridad y Ethical Hacking",
      description:
        "Protege sistemas y redes aprendiendo técnicas de seguridad informática y hacking ético.",
      instructor: "MSc. Andrés López",
      duration: "65 horas",
      level: "Avanzado",
      category: "Tecnología y Herramientas Digitales",
      price: 129924,
      originalPrice: 168901,
      rating: 4.8,
      reviewCount: 471,
      thumbnail: "/img-courses/ciberseguridad-y-ethical-hacking.png",
      tags: ["Seguridad", "Hacking", "Redes", "Penetration Testing"],
      source: "mock",
      isRealCourse: true,
    },
  ];
};

onMounted(async () => {
  // Cargar carrito al montar componente
  cartService.loadCartFromStorage();

  // Intentar cargar cursos desde Neekworld primero, luego Moodle como fallback
  await loadCoursesFromNeekworld();
});
</script>
<template>
  <section class="pt-5">
    <h2 class="title-card text-center py-5 display-5 display-lg-4">
      Elige tu próximo curso
    </h2>
    <v-row class="container justify-content-center g-4">
      <v-col
        v-for="course in filteredCourses"
        class="w-full"
        :key="course.id"
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <v-card
          class="course-card h-100 bg-white rounded-xl d-flex flex-column"
          elevation="2"
          tabindex="0"
          role="article"
          :aria-labelledby="`course-title-${course.id}`"
          :aria-describedby="`course-desc-${course.id}`"
          @keydown.enter="selectCourse(course)"
          @keydown.space.prevent="selectCourse(course)"
        >
          <!-- Imagen del curso -->
          <v-img
            :src="course.thumbnail || '/default-course.jpg'"
            :alt="`Imagen del curso ${course.title} - ${course.description}`"
            height="200"
            cover
            class="course-image"
            role="img"
          >
            <div class="overlay d-flex align-end justify-space-between">
              <div class="d-flex flex-wrap ga-1">
                <v-chip
                  :color="getLevelColor(course.level)"
                  size="small"
                  class="ma-1"
                  :aria-label="`Nivel: ${course.level}`"
                >
                  {{ course.level }}
                </v-chip>
                <v-chip
                  v-if="
                    course.isRealCourse ||
                    course.source === 'neekworld' ||
                    course.source === 'moodle'
                  "
                  :color="
                    course.source === 'neekworld'
                      ? 'primary'
                      : course.source === 'moodle'
                      ? 'success'
                      : 'success'
                  "
                  size="small"
                  class="ma-1"
                  :prepend-icon="
                    course.source === 'neekworld'
                      ? 'mdi-earth'
                      : course.source === 'moodle'
                      ? 'mdi-school'
                      : 'mdi-star'
                  "
                  :aria-label="`Fuente: ${
                    course.source === 'neekworld'
                      ? 'Neekworld'
                      : course.source === 'moodle'
                      ? 'Moodle'
                      : 'Premium'
                  }`"
                >
                  {{
                    course.source === "neekworld"
                      ? "NeekWorld"
                      : course.source === "moodle"
                      ? "Moodle"
                      : "Premium"
                  }}
                </v-chip>
              </div>
            </div>
          </v-img>

          <v-card-text class="px-5 flex-grow-1 d-flex flex-column">
            <!-- Título del curso -->
            <h3
              :id="`course-title-${course.id}`"
              class="txt-title-card fw-bold mb-2"
            >
              {{ course.title }}
            </h3>

            <!-- Instructor -->
            <div class="d-flex align-center mb-2">
              <v-icon size="small" class="mr-1" aria-hidden="true"
                >mdi-account</v-icon
              >
              <span class="txt-p"> Instructor: {{ course.instructor }} </span>
            </div>

            <!-- Duración y rating -->
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center txt-p">
                <v-icon size="small" class="mr-1" aria-hidden="true"
                  >mdi-clock-outline</v-icon
                >
                <span class="txt-p">Duración: {{ course.duration }}</span>
              </div>

              <div class="d-flex align-center">
                <v-rating
                  :model-value="course.rating"
                  density="compact"
                  size="small"
                  readonly
                  half-increments
                  :aria-label="`Calificación: ${course.rating} de 5 estrellas`"
                ></v-rating>
                <span class="txt-p ml-1" aria-hidden="true">
                  ({{ course.reviewCount }})
                </span>
              </div>
            </div>

            <!-- Descripción -->
            <p
              :id="`course-desc-${course.id}`"
              class="txt-p mb-3 course-description"
            >
              {{ course.description }}
            </p>

            <!-- Tags de categorías -->
            <div class="mb-3 tags-section">
              <v-chip
                v-for="tag in course.tags.slice(0, 3)"
                :key="tag"
                size="x-small"
                variant="outlined"
                class="mr-1 mb-1 txt-p"
              >
                {{ tag }}
              </v-chip>
              <v-chip
                v-if="course.tags.length > 3"
                size="x-small"
                variant="outlined"
                class="mr-1 mb-1 txt-p"
              >
                +{{ course.tags.length - 3 }}
              </v-chip>
            </div>
          </v-card-text>

          <v-card-actions class="px-5 py-5">
            <!-- Precio -->
            <div class="flex-grow-1">
              <div
                v-if="course.originalPrice > course.price"
                class="text-caption text-decoration-line-through text-grey txt-p"
              >
                {{ formatCurrency(course.originalPrice) }}
              </div>
              <div class="font-weight-bold text-primary txt-p">
                {{ formatCurrency(course.price) }}
              </div>
            </div>

            <!-- Botón agregar al carrito -->
            <v-btn
              v-if="!isInCart(course.id)"
              variant="elevated"
              @click="addToCart(course)"
              :loading="addingToCart[course.id]"
              class="btn btn-add-to-cart rounded-4 px-4 py-3 fw-medium"
            >
              <FontAwesomeIcon icon="shopping-cart" class="me-2" />
              <span>Agregar</span>
            </v-btn>

            <v-btn
              v-else
              color="success"
              variant="outlined"
              disabled
              class="btn rounded-4 px-4 py-3 fw-medium d-flex align-center justify-center"
            >
              <FontAwesomeIcon icon="check" class="me-2" />
              <span class="txt-btn">En carrito</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div class="d-flex justify-content-center pt-4 pt-lg-5">
      <router-link
        to="/courses"
        class="btn btn-primary text-decoration-none border-0 rounded-4 px-4 py-3 fw-medium"
      >
        Cursos
      </router-link>
    </div>
  </section>

  <!-- Snackbar para notificaciones -->
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    location="top right"
  >
    {{ snackbar.message }}
    <template #actions>
      <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
    </template>
  </v-snackbar>
</template>

<style lang="scss" scoped>
// title card
.title-card {
  color: #373b8a;
  font-weight: 800;
  font-family: "Montserrat", sans-serif;
}

/* Estilos para las tarjetas de cursos */
.course-card {
  display: flex !important;
  flex-direction: column !important;
}

.course-card .v-card-text {
  flex-grow: 1 !important;
  display: flex !important;
  flex-direction: column !important;
}

.course-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-5px);
}

.course-card:focus {
  outline: 3px solid #2e8b57;
  outline-offset: 2px;
}

/* Imagen del curso */
.course-image {
  position: relative;
  width: 100%;
}

// boton curso
.btn-primary {
  background-color: #29acb9;
  color: white;
}

.btn-primary:hover {
  background-color: #32c4d2;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px #32c4d2;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

/* Título de tarjetas */
.txt-title-card {
  font-family: "Montserrat", sans-serif;
  color: #373b8a !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  line-clamp: 2 !important;
  min-height: 3rem !important;
}

/* Texto de párrafos */
.txt-p {
  font-family: "DM Sans", sans-serif;
  color: #666666;
}

/* Descripción del curso */
.course-description {
  display: -webkit-box !important;
  -webkit-line-clamp: 3 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  line-clamp: 3 !important;
  flex-grow: 1 !important;
}

/* Botón agregar al carrito */
.btn-add-to-cart {
  background-color: #2ea357 !important;
  font-family: "DM Sans", sans-serif;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}

.btn-add-to-cart:hover {
  transform: translateY(-5px) !important;
}

.btn-add-to-cart .svg-inline--fa {
  display: inline-flex !important;
  align-items: center !important;
  margin-right: 0 !important;
  font-size: 16px !important;
  vertical-align: middle !important;
}

/* Botón "En carrito" */
.v-btn.v-btn--variant-outlined {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}

.v-btn.v-btn--variant-outlined .svg-inline--fa {
  display: inline-flex !important;
  align-items: center !important;
  margin-right: 0 !important;
  font-size: 16px !important;
  vertical-align: middle !important;
}

/* Asegurar que el card-actions esté en la parte inferior */
.course-card .v-card-actions {
  margin-top: auto !important;
}
</style>
