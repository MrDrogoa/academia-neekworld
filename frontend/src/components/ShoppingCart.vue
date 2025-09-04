<template>
  <div class="shopping-cart mr-0">
    <!-- Botón del carrito - flotante o navbar -->
    <v-btn
      v-if="!isCartPage"
      :class="getCartButtonClass"
      :icon="!isFloating"
      :size="isFloating ? 'large' : 'default'"
      :elevation="isFloating ? 6 : 0"
      @click="showCartDialog = true"
      :aria-label="getCartAriaLabel"
    >
      <v-badge
        :content="cartService.getItemCount()"
        :model-value="cartService.getItemCount() > 0"
        :color="
          isFloating && cartService.getItemCount() > 0 ? 'white' : 'error'
        "
        :offset-x="isFloating ? 10 : 0"
        :offset-y="isFloating ? 10 : 0"
      >
        <v-icon
          :size="isFloating ? 'large' : 'default'"
          :color="isFloating ? 'white' : 'default'"
        >
          mdi-cart
        </v-icon>
      </v-badge>
    </v-btn>

    <!-- Dialog del carrito -->
    <v-dialog v-model="showCartDialog" max-width="800px" scrollable>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon left>mdi-cart</v-icon>
          Carrito de Compras
          <v-spacer></v-spacer>
          <v-btn
            icon="mdi-close"
            variant="text"
            @click="showCartDialog = false"
          ></v-btn>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text style="max-height: 600px">
          <!-- Carrito vacío -->
          <div v-if="cartItems.length === 0" class="text-center py-8">
            <v-icon size="80" color="grey">mdi-cart-off</v-icon>
            <h3 class="mt-4 mb-2">Tu carrito está vacío</h3>
            <p class="text-grey">
              Explora nuestros cursos y agrega algunos a tu carrito
            </p>
            <v-btn
              color="primary"
              @click="
                $router.push('/courses');
                showCartDialog = false;
              "
            >
              Ver Cursos
            </v-btn>
          </div>

          <!-- Items del carrito -->
          <div v-else>
            <v-list>
              <v-list-item
                v-for="item in cartItems"
                :key="item.id"
                class="cart-item"
              >
                <template #prepend>
                  <v-img
                    :src="item.thumbnail || '/default-course.jpg'"
                    width="80"
                    height="60"
                    class="rounded"
                  ></v-img>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ item.title }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  <div>{{ item.instructor }}</div>
                  <div class="text-caption">{{ item.duration }}</div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="text-right">
                    <div
                      v-if="item.originalPrice > item.price"
                      class="text-caption text-decoration-line-through text-grey"
                    >
                      {{ formatCurrency(item.originalPrice) }}
                    </div>
                    <div class="font-weight-bold text-primary">
                      {{ formatCurrency(item.price) }}
                    </div>
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeFromCart(item.id)"
                      class="mt-1"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <!-- Cupón de descuento -->
            <div class="mb-4">
              <v-row>
                <v-col cols="8">
                  <v-text-field
                    v-model="couponCode"
                    label="Código de cupón"
                    density="compact"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    block
                    @click="applyCoupon"
                    :loading="applyingCoupon"
                  >
                    Aplicar
                  </v-btn>
                </v-col>
              </v-row>

              <div v-if="appliedCoupon" class="mt-2">
                <v-alert
                  type="success"
                  density="compact"
                  closable
                  @click:close="removeCoupon"
                >
                  {{ appliedCoupon.description }}
                  (-{{ formatCurrency(appliedCoupon.discountAmount) }})
                </v-alert>
              </div>
            </div>

            <!-- Resumen de totales -->
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <div class="d-flex justify-space-between mb-2">
                  <span>Subtotal:</span>
                  <span>{{ formatCurrency(cartTotal) }}</span>
                </div>

                <div
                  v-if="appliedCoupon"
                  class="d-flex justify-space-between mb-2 text-success"
                >
                  <span>Descuento:</span>
                  <span
                    >-{{ formatCurrency(appliedCoupon.discountAmount) }}</span
                  >
                </div>

                <v-divider class="my-2"></v-divider>

                <div
                  class="d-flex justify-space-between text-h6 font-weight-bold"
                >
                  <span>Total:</span>
                  <span>{{ formatCurrency(finalTotal) }}</span>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions v-if="cartItems.length > 0">
          <v-btn variant="text" @click="clearCart" color="error">
            Vaciar Carrito
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            size="large"
            @click="proceedToCheckout"
            :loading="processingCheckout"
            :disabled="checkoutButtonDisabled"
          >
            {{ checkoutButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de checkout -->
    <v-dialog v-model="showCheckoutDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <v-icon left>mdi-credit-card</v-icon>
          Finalizar Compra
        </v-card-title>

        <v-card-text>
          <v-form ref="paymentForm" v-model="paymentFormValid">
            <h4 class="mb-4">Información de Pago</h4>

            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="selectedPaymentMethod"
                  :items="paymentMethods"
                  label="Método de Pago"
                  item-title="name"
                  item-value="value"
                  :rules="[(v) => !!v || 'Selecciona un método de pago']"
                >
                  <template #item="{ item, props }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon>{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="paymentData.cardNumber"
                  label="Número de Tarjeta"
                  placeholder="1234 5678 9012 3456"
                  :rules="[(v) => !!v || 'Número de tarjeta requerido']"
                  @input="onCardNumberInput"
                  maxlength="19"
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="3">
                <v-text-field
                  v-model="paymentData.expiryDate"
                  label="MM/AA"
                  placeholder="12/25"
                  :rules="[(v) => !!v || 'Fecha requerida']"
                  @input="onExpiryDateInput"
                  maxlength="5"
                ></v-text-field>
              </v-col>

              <v-col cols="6" md="3">
                <v-text-field
                  v-model="paymentData.cvv"
                  label="CVV"
                  placeholder="123"
                  :rules="[(v) => !!v || 'CVV requerido']"
                  @input="onCvvInput"
                  maxlength="4"
                  type="password"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="paymentData.cardHolder"
                  label="Nombre del Titular"
                  placeholder="Juan Pérez"
                  :rules="[(v) => !!v || 'Nombre del titular requerido']"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-divider class="my-4"></v-divider>

            <!-- Resumen de compra -->
            <h4 class="mb-4">Resumen de Compra</h4>

            <!-- Resumen de cursos -->
            <v-card variant="outlined" class="mb-4">
              <v-card-text>
                <h5 class="mb-3">Cursos a Comprar:</h5>
                <v-list density="compact">
                  <v-list-item v-for="item in cartItems" :key="item.id">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <template #append>
                      <span class="font-weight-bold">{{
                        formatCurrency(item.price)
                      }}</span>
                    </template>
                  </v-list-item>
                </v-list>

                <v-divider class="my-3"></v-divider>

                <div
                  class="d-flex justify-space-between text-h6 font-weight-bold"
                >
                  <span>Total a Pagar:</span>
                  <span>{{ formatCurrency(finalTotal) }}</span>
                </div>
              </v-card-text>
            </v-card>

            <!-- Términos y condiciones -->
            <v-checkbox
              v-model="acceptTerms"
              label="Acepto los términos y condiciones"
              :rules="[(v) => !!v || 'Debes aceptar los términos']"
            ></v-checkbox>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn variant="text" @click="closeCheckout"> Cancelar </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="success"
            @click="completePurchase"
            :loading="processingPurchase"
            :disabled="!acceptTerms || !paymentFormValid"
          >
            Confirmar Compra
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import cartService from "@/services/cartService";
import authService from "@/services/authService";

export default {
  name: "ShoppingCart",
  props: {
    isCartPage: {
      type: Boolean,
      default: false,
    },
    isFloating: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const showCartDialog = ref(false);
    const showCheckoutDialog = ref(false);
    const processingCheckout = ref(false);
    const processingPurchase = ref(false);
    const applyingCoupon = ref(false);

    const couponCode = ref("");
    const appliedCoupon = ref(null);
    const paymentFormValid = ref(false);
    const acceptTerms = ref(false);

    const selectedPaymentMethod = ref("stripe");
    const paymentData = ref({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardHolder: "",
    });

    const snackbar = ref({
      show: false,
      message: "",
      color: "success",
    });

    // Datos estáticos
    const paymentMethods = [
      {
        name: "Tarjeta de Crédito/Débito (Stripe)",
        value: "stripe",
        icon: "mdi-credit-card",
      },
      { name: "Transbank (WebPay)", value: "transbank", icon: "mdi-bank" },
      { name: "Khipu", value: "khipu", icon: "mdi-cellphone" },
    ];

    // Computadas
    const cartItems = computed(() => cartService.getCartItems());
    const cartTotal = computed(() => cartService.getCartTotal());
    const finalTotal = computed(() => {
      let total = cartTotal.value;
      if (appliedCoupon.value) {
        total -= appliedCoupon.value.discountAmount;
      }
      return Math.max(0, total);
    });

    // Estado de autenticación para el botón de checkout
    const isUserAuthenticated = computed(() => authService.isAuthenticated());
    const isUserStudent = computed(() => authService.isStudent());
    const checkoutButtonText = computed(() => {
      if (!isUserAuthenticated.value) {
        return "Inicia Sesión para Comprar";
      }
      if (!isUserStudent.value) {
        return "Solo Estudiantes";
      }
      return "Proceder al Pago";
    });
    const checkoutButtonDisabled = computed(() => {
      return !isUserAuthenticated.value || !isUserStudent.value;
    });

    // Métodos
    const removeFromCart = (courseId) => {
      const result = cartService.removeCourse(courseId);
      showSnackbar(result.message, result.success ? "success" : "error");
    };

    const clearCart = () => {
      cartService.clearCart();
      showSnackbar("Carrito vaciado", "info");
    };

    const applyCoupon = async () => {
      if (!couponCode.value.trim()) {
        showSnackbar("Ingresa un código de cupón", "warning");
        return;
      }

      applyingCoupon.value = true;

      try {
        const result = cartService.applyCoupon(couponCode.value);

        if (result.success) {
          appliedCoupon.value = result.coupon;
          showSnackbar(result.message, "success");
          couponCode.value = "";
        } else {
          showSnackbar(result.message, "error");
        }
      } catch (error) {
        showSnackbar("Error al aplicar cupón", "error");
      } finally {
        applyingCoupon.value = false;
      }
    };

    const removeCoupon = () => {
      appliedCoupon.value = null;
      showSnackbar("Cupón removido", "info");
    };

    const proceedToCheckout = () => {
      // Verificar que el usuario esté autenticado como estudiante
      if (!authService.isAuthenticated()) {
        showSnackbar(
          "Debes iniciar sesión para proceder con la compra",
          "warning"
        );
        showCartDialog.value = false;
        // Aquí podrías emitir un evento o redirigir al login
        // emit('requiresAuth')
        return;
      }

      // Verificar que el usuario tenga rol de estudiante
      if (!authService.isStudent()) {
        showSnackbar("Solo los estudiantes pueden realizar compras", "error");
        return;
      }

      showCartDialog.value = false;
      showCheckoutDialog.value = true;
    };

    const closeCheckout = () => {
      showCheckoutDialog.value = false;
      acceptTerms.value = false;
    };

    const completePurchase = async () => {
      // Verificación adicional de autenticación antes del pago
      if (!authService.isAuthenticated()) {
        showSnackbar(
          "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
          "error"
        );
        closeCheckout();
        return;
      }

      if (!authService.isStudent()) {
        showSnackbar("Solo los estudiantes pueden realizar compras", "error");
        closeCheckout();
        return;
      }

      processingPurchase.value = true;

      try {
        // Los datos del usuario ahora vienen del authService
        const userInfo = {
          cardHolder: paymentData.value.cardHolder || "Usuario",
        };

        const result = await cartService.processCartPurchase(
          selectedPaymentMethod.value,
          userInfo
        );

        if (result.success) {
          // Mostrar información completa del resultado
          let successMessage = "¡Compra realizada exitosamente!";

          if (result.moodleEnrollment && result.moodleEnrollment.success) {
            successMessage += " Cursos habilitados en Moodle.";
          }

          showSnackbar(successMessage, "success");

          // Mostrar información de SSO si está disponible
          if (result.moodleSSO && result.moodleSSO.available) {
            setTimeout(() => {
              showSnackbar(
                "Puedes acceder directamente a Moodle desde el menú superior",
                "info"
              );
            }, 3000);
          }

          closeCheckout();

          // Redirigir a página de mis cursos
          setTimeout(() => {
            router.push("/my-courses");
          }, 2000);
        } else if (result.requiresAuth) {
          // El usuario necesita autenticarse
          showSnackbar(
            "Debes iniciar sesión para completar la compra",
            "warning"
          );
          closeCheckout();

          // Emitir evento para abrir dialog de autenticación
          // El componente padre debe manejar esto
          setTimeout(() => {
            showSnackbar(
              "Por favor, inicia sesión y vuelve a intentar la compra",
              "info"
            );
          }, 1000);
        } else {
          showSnackbar(
            result.message || "Error al procesar la compra",
            "error"
          );
        }
      } catch (error) {
        console.error("Error completing purchase:", error);
        showSnackbar("Error al procesar la compra", "error");
      } finally {
        processingPurchase.value = false;
      }
    };

    const getPaymentMethodName = (method) => {
      const paymentMethod = paymentMethods.find((pm) => pm.value === method);
      return paymentMethod ? paymentMethod.name : method;
    };

    const getPaymentMethodIcon = (method) => {
      const paymentMethod = paymentMethods.find((pm) => pm.value === method);
      return paymentMethod ? paymentMethod.icon : "mdi-credit-card";
    };

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(amount);
    };

    // Formatear número de tarjeta con espacios cada 4 dígitos
    const formatCardNumber = (value) => {
      if (!value) return "";

      // Remover todos los caracteres que no sean dígitos
      const cleanValue = value.replace(/\D/g, "");

      // Limitar a 16 dígitos
      const limitedValue = cleanValue.substring(0, 16);

      // Agregar espacios cada 4 dígitos
      return limitedValue.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    // Formatear fecha de vencimiento MM/AA
    const formatExpiryDate = (value) => {
      if (!value) return "";

      // Remover todos los caracteres que no sean dígitos
      const cleanValue = value.replace(/\D/g, "");

      // Limitar a 4 dígitos
      const limitedValue = cleanValue.substring(0, 4);

      // Agregar '/' después de los primeros 2 dígitos
      if (limitedValue.length >= 2) {
        return limitedValue.substring(0, 2) + "/" + limitedValue.substring(2);
      }

      return limitedValue;
    };

    // Manejar entrada del número de tarjeta
    const onCardNumberInput = (event) => {
      const formatted = formatCardNumber(event.target.value);
      paymentData.value.cardNumber = formatted;
    };

    // Manejar entrada de la fecha de vencimiento
    const onExpiryDateInput = (event) => {
      const formatted = formatExpiryDate(event.target.value);
      paymentData.value.expiryDate = formatted;
    };

    // Limitar CVV a solo números y máximo 4 dígitos
    const onCvvInput = (event) => {
      const cleanValue = event.target.value.replace(/\D/g, "");
      paymentData.value.cvv = cleanValue.substring(0, 4);
    };

    const showSnackbar = (message, color = "success") => {
      snackbar.value = {
        show: true,
        message,
        color,
      };
    };

    // Computed properties para el botón flotante
    const getCartButtonClass = computed(() => {
      if (!props.isFloating) {
        return "cart-button";
      }

      const hasItems = cartItems.value.length > 0;
      return `floating-cart-button ${
        hasItems ? "cart-has-items" : "cart-empty"
      }`;
    });

    const getCartAriaLabel = computed(() => {
      const itemCount = cartItems.value.length;

      if (props.isFloating) {
        if (itemCount > 0) {
          return `Abrir carrito de compras - ${itemCount} producto${
            itemCount > 1 ? "s" : ""
          } (botón flotante con animación)`;
        }
        return "Abrir carrito de compras - carrito vacío (botón flotante)";
      }

      return "Abrir carrito de compras";
    });

    onMounted(() => {
      // Cargar carrito al montar componente
      cartService.loadCartFromStorage();
    });

    return {
      cartService,
      showCartDialog,
      showCheckoutDialog,
      processingCheckout,
      processingPurchase,
      applyingCoupon,
      couponCode,
      appliedCoupon,
      paymentFormValid,
      acceptTerms,
      selectedPaymentMethod,
      paymentMethods,
      paymentData,
      snackbar,
      cartItems,
      cartTotal,
      finalTotal,
      isUserAuthenticated,
      isUserStudent,
      checkoutButtonText,
      checkoutButtonDisabled,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      proceedToCheckout,
      closeCheckout,
      completePurchase,
      getPaymentMethodName,
      getPaymentMethodIcon,
      formatCurrency,
      formatCardNumber,
      formatExpiryDate,
      onCardNumberInput,
      onExpiryDateInput,
      onCvvInput,
      getCartButtonClass,
      getCartAriaLabel,
    };
  },
};
</script>

<style scoped>
.car-pay {
  background-color: aqua !important;
}

.cart-button {
  background-color: blanchedalmond;
  position: relative;
}

.cart-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.cart-item:last-child {
  border-bottom: none;
}

@media (max-width: 600px) {
  .cart-item .v-list-item-title {
    font-size: 0.9rem;
  }
}
</style>
