<template>
  <div class="course-catalog">
    <v-container fluid class="p-0">
      <!-- Header -->
      <header class="bg-white py-5">
        <div class="container">
          <div class="py-3 py-lg-5 px-3 position-relative">
            <h2
              class="txt-cursos text-center display-5 display-lg-4 pt-3 pt-lg-5"
            >
              Catálogo de Cursos
            </h2>
            <p class="sub-cursos text-center py-2">
              Descubre y aprende con nuestros cursos especializados
            </p>
            <div class="d-flex justify-center align-center mt-2 pb-3 pb-lg-5">
              <v-chip
                v-if="dataSource === 'neekworld'"
                color="primary"
                size="small"
                prepend-icon="mdi-earth"
                aria-label="Conectado con Neekworld"
              >
                NeekWorld
              </v-chip>
              <v-chip
                v-else-if="dataSource === 'moodle'"
                color="success"
                size="small"
                prepend-icon="mdi-school"
                aria-label="Conectado con Moodle QA"
              >
                Moodle QA
              </v-chip>
              <v-chip
                v-else-if="dataSource === 'mock'"
                color="warning"
                size="small"
                prepend-icon="mdi-test-tube"
                aria-label="Mostrando datos de prueba"
              >
                Datos de Prueba
              </v-chip>
              <v-progress-circular
                v-if="loading"
                indeterminate
                size="20"
                width="3"
                color="primary"
                class="ml-2"
                aria-label="Cargando cursos"
              ></v-progress-circular>
            </div>

            <!-- icons-flotantes -->
            <div class="position-absolute flot-1">
              <img :src="svgImages.circleFill" alt="circle" />
            </div>
            <div class="position-absolute flot-2">
              <img :src="svgImages.brain" alt="brain" />
            </div>
            <div class="position-absolute flot-3">
              <img :src="svgImages.triangulo" alt="triangle" />
            </div>
            <div class="position-absolute flot-4">
              <img :src="svgImages.notes" alt="notes" />
            </div>
            <div class="position-absolute flot-5">
              <img :src="svgImages.rectangleFill" alt="rectangle" />
            </div>
            <div class="position-absolute flot-6">
              <img :src="svgImages.rectangleBg" alt="rectangle background" />
            </div>
          </div>
        </div>

        <!-- Carrito de compras 
        <shopping-cart />-->
      </header>

      <!-- Filtros -->
      <v-card
        class="w-75 mx-auto py-4"
        elevation="0"
        role="search"
        aria-label="Filtros de búsqueda de cursos"
      >
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4" class="txt-field">
              <v-text-field
                v-model="searchTerm"
                label="Buscar cursos"
                prepend-inner-icon="mdi-magnify"
                clearable
                density="compact"
                variant="outlined"
                aria-label="Campo de búsqueda de cursos"
                aria-describedby="search-help"
              ></v-text-field>
              <span id="search-help" class="sr-only">
                Escriba términos para buscar cursos por título o descripción
              </span>
            </v-col>

            <v-col cols="12" md="3" class="txt-field">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Categoría"
                clearable
                density="compact"
                variant="outlined"
                aria-label="Filtrar por categoría"
              ></v-select>
            </v-col>

            <v-col cols="12" md="3" class="txt-field">
              <v-select
                v-model="selectedLevel"
                :items="levels"
                label="Nivel"
                clearable
                density="compact"
                variant="outlined"
                aria-label="Filtrar por nivel de dificultad"
              ></v-select>
            </v-col>

            <v-col cols="12" md="2" class="txt-field">
              <v-select
                v-model="sortBy"
                :items="sortOptions"
                label="Ordenar por"
                density="compact"
                variant="outlined"
                aria-label="Ordenar resultados"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Lista de cursos -->
      <main role="main" aria-label="Lista de cursos disponibles">
        <v-row class="container">
          <v-col
            v-for="course in filteredCourses"
            :key="course.id"
            cols="12"
            sm="6"
            md="4"
            lg="4"
          >
            <v-card
              class="course-card h-100 bg-white rounded-xl"
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
                      v-if="course.isRealCourse"
                      color="success"
                      size="small"
                      class="ma-1"
                      prepend-icon="mdi-star"
                      aria-label="Curso real de Neekworld"
                    >
                      Real
                    </v-chip>
                  </div>
                </div>
              </v-img>

              <v-card-text class="px-5">
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
                  <span class="txt-p">
                    Instructor: {{ course.instructor }}
                  </span>
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
                <p :id="`course-desc-${course.id}`" class="txt-p mb-3">
                  {{ course.description }}
                </p>

                <!-- Tags de categorías -->
                <div class="mb-3">
                  <v-chip
                    v-for="tag in course.tags"
                    :key="tag"
                    size="x-small"
                    variant="outlined"
                    class="mr-1 txt-p"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions class="px-5">
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
                  <span class="txt-btn">Agregar</span>
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

        <!-- Mensaje si no hay cursos -->
        <div v-if="filteredCourses.length === 0" class="text-center py-12">
          <v-icon size="120" color="grey">mdi-book-open-page-variant</v-icon>
          <h3 class="text-h5 mt-4 mb-2">No se encontraron cursos</h3>
          <p class="text-grey">Intenta ajustar los filtros de búsqueda</p>
        </div>

        <!-- Paginación -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
          ></v-pagination>
        </div>
      </main>
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
        <v-btn variant="text" @click="snackbar.show = false"> Cerrar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from "vue";
import cartService from "@/services/cartService";
import moodleIntegrationService from "@/services/moodleIntegrationService";
import neekworldService from "@/services/neekworldService";
//import ShoppingCart from '@/components/ShoppingCart.vue'

// ===== IMPORTAR IMÁGENES SVG DESDE ASSETS =====
import circleFillSvg from "@/assets/img/circle-fill.svg";
import group254Svg from "@/assets/img/brain.svg";
import notesSvg from "@/assets/img/notes.svg";
import polygon4Svg from "@/assets/img/triangulo.svg";
import rectangle46Svg from "@/assets/img/Rectangle-fill.svg";
import rectangleBgSvg from "@/assets/img/Rectangle-bg.svg";

export default {
  name: "CourseCatalog",
  components: {
    //ShoppingCart
  },
  setup() {
    // Objeto con todas las imágenes SVG importadas
    const svgImages = {
      circleFill: circleFillSvg,
      brain: group254Svg,
      notes: notesSvg,
      triangulo: polygon4Svg,
      rectangleFill: rectangle46Svg,
      rectangleBg: rectangleBgSvg,
    };

    const searchTerm = ref("");
    const selectedCategory = ref("");
    const selectedLevel = ref("");
    const sortBy = ref("popularity");
    const currentPage = ref(1);
    const coursesPerPage = ref(12);
    const addingToCart = reactive({});
    const loading = ref(false);
    const dataSource = ref("mock"); // 'moodle' o 'mock'

    const snackbar = ref({
      show: false,
      message: "",
      color: "success",
    });

    // Cursos dinámicos (se cargan desde Moodle o mock data)
    const allCourses = ref([]);

    const categories = [
      "Tecnología y Herramientas Digitales",
      "Educación y Pedagogía",
      "Desarrollo Web",
      "Data Science",
      "Diseño",
      "Marketing",
      "DevOps",
      "Desarrollo Móvil",
      "Negocios",
      "Idiomas",
      "Fotografía",
      "Música",
      "General",
    ];

    const levels = ["Principiante", "Intermedio", "Avanzado"];

    const sortOptions = [
      { title: "Más popular", value: "popularity" },
      { title: "Precio: menor a mayor", value: "price_asc" },
      { title: "Precio: mayor a menor", value: "price_desc" },
      { title: "Mejor valorados", value: "rating" },
      { title: "Más recientes", value: "newest" },
    ];

    // Computadas
    const filteredCourses = computed(() => {
      let courses = [...allCourses.value];

      // Filtro por búsqueda
      if (searchTerm.value) {
        courses = courses.filter(
          (course) =>
            course.title
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase()) ||
            course.instructor
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase())
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
        courses = courses.filter(
          (course) => course.level === selectedLevel.value
        );
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

      // Paginación
      const start = (currentPage.value - 1) * coursesPerPage.value;
      const end = start + coursesPerPage.value;

      return courses.slice(start, end);
    });

    const totalPages = computed(() => {
      let courses = [...allCourses.value];

      // Aplicar los mismos filtros para calcular total
      if (searchTerm.value) {
        courses = courses.filter(
          (course) =>
            course.title
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase()) ||
            course.description
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase()) ||
            course.instructor
              .toLowerCase()
              .includes(searchTerm.value.toLowerCase())
        );
      }

      if (selectedCategory.value) {
        courses = courses.filter(
          (course) => course.category === selectedCategory.value
        );
      }

      if (selectedLevel.value) {
        courses = courses.filter(
          (course) => course.level === selectedLevel.value
        );
      }

      return Math.ceil(courses.length / coursesPerPage.value);
    });

    // Métodos
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

    const isInCart = (courseId) => {
      return cartService.isInCart(courseId);
    };

    const selectCourse = (course) => {
      // Redirigir a la página de detalles del curso o agregar al carrito
      if (!isInCart(course.id)) {
        addToCart(course);
      }
    };

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
        duration: "40 horas", // Valor por defecto
        level: "Intermedio", // Valor por defecto
        category: moodleCourse.categoryname || "General",
        price: 49900, // Precio por defecto
        originalPrice: 69900,
        rating: 4.5,
        reviewCount: 0,
        thumbnail: "/default-course.jpg",
        tags: ["Moodle", "E-learning"],
        source: "moodle",
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
          console.log(
            "✅ Cursos obtenidos de Neekworld:",
            result.courses.length
          );
          console.log("📋 Primeros 3 cursos:", result.courses.slice(0, 3));

          // Verificar categorías
          const categories = [
            ...new Set(result.courses.map((c) => c.category)),
          ];
          console.log("🏷️ Categorías encontradas:", categories);

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
        // Intentar cargar desde Moodle como fallback
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

          // Convertir cursos de Moodle al formato de la plataforma
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
          thumbnail:
            "/img-courses/desarrollo-web-fullstack-con react-y-node.png",
          tags: ["Vue.js", "JavaScript", "Frontend", "SPA"],
          source: "mock",
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
          thumbnail:
            "/img-courses/inteligencia-artificial-y-machine-learning.png",
          tags: ["Python", "Pandas", "NumPy", "Machine Learning"],
          source: "mock",
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
          thumbnail:
            "/img-courses/desarrollo-web-fullstack-con react-y-node.png",
          tags: ["React Native", "Mobile Development", "iOS", "Android"],
          source: "mock",
        },
      ];
    };

    onMounted(async () => {
      // Cargar carrito al montar componente
      cartService.loadCartFromStorage();

      // Intentar cargar cursos desde Neekworld primero, luego Moodle como fallback
      await loadCoursesFromNeekworld();
    });

    return {
      searchTerm,
      selectedCategory,
      selectedLevel,
      sortBy,
      currentPage,
      addingToCart,
      snackbar,
      loading,
      dataSource,
      allCourses,
      categories,
      levels,
      sortOptions,
      filteredCourses,
      totalPages,
      addToCart,
      isInCart,
      selectCourse,
      getLevelColor,
      formatCurrency,
      svgImages,
    };
  },
};
</script>

<style scoped>
h2 {
  margin: 0;
}
/* titulo de cursos */
.txt-cursos {
  font-weight: 800;
  color: #373b8a;
  font-family: "Montserrat", serif;
}

/* parrafos de cursos */
.sub-cursos {
  font-family: "Dm Sans", sans-serif;
  color: #666666;
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

/* icon-flotantes */
.flot-1 {
  top: 45px;
  right: -40px;
}

.flot-2 {
  top: -50px;
  right: -190px;
}

.flot-3 {
  bottom: 50px;
  left: 50px;
}

.flot-4 {
  bottom: -20px;
  left: -140px;
}

.flot-5 {
  top: -10px;
  left: -10px;
}

.flot-6 {
  top: 140px;
  right: -80px;
}

/* titulo de card */
.txt-title-card {
  font-family: "Montserrat", serif;
  color: #373b8a !important;
}

/* btn-card y texto */
.btn-add-to-cart {
  background-color: #2ea357 !important;
  font-family: "Dm Sans", sans-serif;
}

.btn-add-to-cart:hover {
  transform: translateY(-5px) !important;
}

.txt-p {
  font-family: "Dm Sans", sans-serif;
  color: #666666;
}

/*  */

@media (max-width: 1475px) {
  /* icon-brain */
  /* .flot-2 {
    display: none;
  } */
}

@media (max-width: 1024px) {
  .flot-1,
  .flot-3,
  .flot-4,
  .flot-5,
  .flot-6 {
    display: none;
  }
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* tipo de fuente de los campos */
.txt-field {
  font-family: "Dm Sans", sans-serif;
}

.course-card:focus {
  outline: 3px solid #2e8b57;
  outline-offset: 2px;
}

/* ===== ESTILOS MEJORADOS PARA BOTONES DEL CARRITO ===== */

/* Botón "Agregar" - Modo oscuro */
.v-theme--dark .v-btn.v-btn--variant-elevated {
  background-color: #4caf50 !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3) !important;
  border: 2px solid transparent !important;
}

/* Botón "En carrito" - Modo oscuro */
.v-theme--dark .v-btn.v-btn--variant-outlined.v-btn--disabled {
  background-color: #2d2d2d !important;
  color: #81c784 !important;
  border-color: #81c784 !important;
  opacity: 1 !important;
}

/* Alto contraste */
.high-contrast-mode .v-btn.v-btn--variant-elevated {
  background-color: #ffff00 !important;
  color: #000000 !important;
  border: 3px solid #000000 !important;
  box-shadow: none !important;
  font-weight: 700 !important;
}

/* Estilos para mejorar la alineación del icono del carrito */
.btn-add-to-cart {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
}

.btn-add-to-cart .svg-inline--fa {
  display: inline-flex !important;
  align-items: center !important;
  margin-right: 0 !important;
  font-size: 16px !important;
  vertical-align: middle !important;
}

/* Estilos para el botón "En carrito" */
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

.high-contrast-mode .v-btn.v-btn--variant-outlined.v-btn--disabled {
  background-color: #000000 !important;
  color: #ffff00 !important;
  border: 3px solid #ffff00 !important;
  opacity: 1 !important;
  font-weight: 700 !important;
}

/* Deshabilitar hover en campos de búsqueda y filtros */
.v-text-field:hover,
.v-select:hover,
.v-field:hover,
.v-input:hover {
  transform: none !important;
  box-shadow: none !important;
}

.v-text-field .v-field:hover,
.v-select .v-field:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Deshabilitar hover y sombra en tarjeta de filtros */
.v-card {
  box-shadow: none !important;
}

.v-card:hover {
  transform: none !important;
  box-shadow: none !important;
}

@media (prefers-reduced-motion: reduce) {
  /* Todas las animaciones deshabilitadas */
  * {
    transition: none !important;
    transform: none !important;
  }
}
</style>
