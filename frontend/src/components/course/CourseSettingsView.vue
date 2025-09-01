<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>mdi-cog</v-icon>
            Configuración de Cursos
          </v-card-title>
          <v-card-subtitle>
            Gestiona las configuraciones globales para tus cursos
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Configuraciones generales -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Configuraciones Generales</v-card-title>
          <v-card-text>
            <v-form>
              <v-switch
                v-model="settings.autoApproval"
                label="Aprobación automática de cursos"
                color="primary"
                @change="updateSetting('autoApproval', $event)"
              ></v-switch>
              
              <v-switch
                v-model="settings.emailNotifications"
                label="Notificaciones por email"
                color="primary"
                @change="updateSetting('emailNotifications', $event)"
              ></v-switch>
              
              <v-switch
                v-model="settings.allowComments"
                label="Permitir comentarios por defecto"
                color="primary"
                @change="updateSetting('allowComments', $event)"
              ></v-switch>
              
              <v-switch
                v-model="settings.enableCertificates"
                label="Habilitar certificados"
                color="primary"
                @change="updateSetting('enableCertificates', $event)"
              ></v-switch>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Configuraciones de precios -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Configuraciones de Precios</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model.number="settings.minPrice"
                label="Precio mínimo (CLP)"
                type="number"
                prefix="$"
                @change="updateSetting('minPrice', $event)"
              ></v-text-field>
              
              <v-text-field
                v-model.number="settings.maxPrice"
                label="Precio máximo (CLP)"
                type="number"
                prefix="$"
                @change="updateSetting('maxPrice', $event)"
              ></v-text-field>
              
              <v-text-field
                v-model.number="settings.platformFee"
                label="Comisión de plataforma (%)"
                type="number"
                suffix="%"
                @change="updateSetting('platformFee', $event)"
              ></v-text-field>
              
              <v-select
                v-model="settings.defaultCurrency"
                :items="currencyOptions"
                label="Moneda por defecto"
                @update:model-value="updateSetting('defaultCurrency', $event)"
              ></v-select>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Configuraciones de contenido -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Configuraciones de Contenido</v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model.number="settings.maxVideoSize"
                label="Tamaño máximo de video (MB)"
                type="number"
                suffix="MB"
                @change="updateSetting('maxVideoSize', $event)"
              ></v-text-field>
              
              <v-text-field
                v-model.number="settings.maxImageSize"
                label="Tamaño máximo de imagen (MB)"
                type="number"
                suffix="MB"
                @change="updateSetting('maxImageSize', $event)"
              ></v-text-field>
              
              <v-select
                v-model="settings.allowedVideoFormats"
                :items="videoFormatOptions"
                label="Formatos de video permitidos"
                multiple
                chips
                @update:model-value="updateSetting('allowedVideoFormats', $event)"
              ></v-select>
              
              <v-select
                v-model="settings.allowedImageFormats"
                :items="imageFormatOptions"
                label="Formatos de imagen permitidos"
                multiple
                chips
                @update:model-value="updateSetting('allowedImageFormats', $event)"
              ></v-select>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Configuraciones de moderación -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Configuraciones de Moderación</v-card-title>
          <v-card-text>
            <v-form>
              <v-switch
                v-model="settings.contentModeration"
                label="Moderación de contenido automática"
                color="primary"
                @change="updateSetting('contentModeration', $event)"
              ></v-switch>
              
              <v-switch
                v-model="settings.requireApproval"
                label="Requiere aprobación manual"
                color="primary"
                @change="updateSetting('requireApproval', $event)"
              ></v-switch>
              
              <v-text-field
                v-model.number="settings.moderationTimeLimit"
                label="Tiempo límite para moderación (horas)"
                type="number"
                suffix="horas"
                @change="updateSetting('moderationTimeLimit', $event)"
              ></v-text-field>
              
              <v-textarea
                v-model="settings.moderationGuidelines"
                label="Directrices de moderación"
                rows="4"
                @change="updateSetting('moderationGuidelines', $event)"
              ></v-textarea>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Plantillas y categorías -->
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Gestión de Categorías
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="showAddCategoryDialog = true"
              prepend-icon="mdi-plus"
            >
              Agregar Categoría
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="categoryHeaders"
              :items="categories"
              class="elevation-1"
            >
              <template v-slot:[`item.active`]="{ item }">
                <v-switch
                  :model-value="item.active"
                  @update:model-value="toggleCategory(item.id, $event)"
                  color="primary"
                ></v-switch>
              </template>
              
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  @click="editCategory(item)"
                  class="mr-2"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  @click="deleteCategory(item)"
                  color="error"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Respaldo y restauración -->
      <v-col cols="12">
        <v-card>
          <v-card-title>Respaldo y Restauración</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-btn
                  @click="createBackup"
                  :loading="backupLoading"
                  prepend-icon="mdi-backup-restore"
                  block
                  variant="outlined"
                >
                  Crear Respaldo
                </v-btn>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-file-input
                  v-model="restoreFile"
                  label="Restaurar desde archivo"
                  accept=".json"
                  prepend-icon="mdi-upload"
                  @change="handleRestoreFile"
                ></v-file-input>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-btn
                  @click="resetToDefaults"
                  color="warning"
                  prepend-icon="mdi-restore"
                  block
                  variant="outlined"
                >
                  Restaurar Valores por Defecto
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog para agregar/editar categoría -->
    <v-dialog v-model="showAddCategoryDialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ editingCategory ? 'Editar Categoría' : 'Agregar Categoría' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="categoryForm" v-model="categoryFormValid">
            <v-text-field
              v-model="categoryForm.name"
              label="Nombre de la categoría *"
              :rules="[v => !!v || 'El nombre es requerido']"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="categoryForm.slug"
              label="Slug (URL) *"
              :rules="[v => !!v || 'El slug es requerido']"
              required
            ></v-text-field>
            
            <v-textarea
              v-model="categoryForm.description"
              label="Descripción"
              rows="3"
            ></v-textarea>
            
            <v-text-field
              v-model="categoryForm.icon"
              label="Icono (Material Design Icon)"
              placeholder="mdi-school"
            ></v-text-field>
            
            <v-text-field
              v-model="categoryForm.color"
              label="Color"
              type="color"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showAddCategoryDialog = false">Cancelar</v-btn>
          <v-btn
            @click="saveCategory"
            color="primary"
            :disabled="!categoryFormValid"
          >
            {{ editingCategory ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'CourseSettingsView',
  data() {
    return {
      settings: {
        autoApproval: false,
        emailNotifications: true,
        allowComments: true,
        enableCertificates: true,
        minPrice: 10000,
        maxPrice: 500000,
        platformFee: 15,
        defaultCurrency: 'CLP',
        maxVideoSize: 500,
        maxImageSize: 10,
        allowedVideoFormats: ['mp4', 'webm'],
        allowedImageFormats: ['jpg', 'png', 'webp'],
        contentModeration: true,
        requireApproval: true,
        moderationTimeLimit: 48,
        moderationGuidelines: 'Los cursos deben seguir las directrices de la comunidad...'
      },
      backupLoading: false,
      restoreFile: null,
      showAddCategoryDialog: false,
      editingCategory: null,
      categoryFormValid: false,
      categoryForm: {
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#1976D2'
      },
      currencyOptions: [
        { title: 'Peso Chileno (CLP)', value: 'CLP' },
        { title: 'Dólar Americano (USD)', value: 'USD' },
        { title: 'Euro (EUR)', value: 'EUR' }
      ],
      videoFormatOptions: [
        { title: 'MP4', value: 'mp4' },
        { title: 'WebM', value: 'webm' },
        { title: 'AVI', value: 'avi' },
        { title: 'MOV', value: 'mov' }
      ],
      imageFormatOptions: [
        { title: 'JPEG', value: 'jpg' },
        { title: 'PNG', value: 'png' },
        { title: 'WebP', value: 'webp' },
        { title: 'GIF', value: 'gif' }
      ],
      categoryHeaders: [
        { title: 'Nombre', key: 'name', sortable: true },
        { title: 'Slug', key: 'slug', sortable: true },
        { title: 'Descripción', key: 'description', sortable: false },
        { title: 'Activa', key: 'active', sortable: true },
        { title: 'Acciones', key: 'actions', sortable: false }
      ],
      categories: [
        {
          id: 1,
          name: 'Programación',
          slug: 'programming',
          description: 'Cursos de desarrollo de software',
          icon: 'mdi-code-tags',
          color: '#4CAF50',
          active: true
        },
        {
          id: 2,
          name: 'Diseño',
          slug: 'design',
          description: 'Cursos de diseño gráfico y UX/UI',
          icon: 'mdi-palette',
          color: '#2196F3',
          active: true
        },
        {
          id: 3,
          name: 'Marketing',
          slug: 'marketing',
          description: 'Cursos de marketing digital',
          icon: 'mdi-bullhorn',
          color: '#FF9800',
          active: true
        },
        {
          id: 4,
          name: 'Negocios',
          slug: 'business',
          description: 'Cursos de administración y emprendimiento',
          icon: 'mdi-briefcase',
          color: '#9C27B0',
          active: false
        }
      ]
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      // Cargar configuraciones desde localStorage o backend
      const savedSettings = localStorage.getItem('courseSettings')
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) }
      }
    },
    
    updateSetting(key, value) {
      this.settings[key] = value
      this.saveSettings()
      this.$toast?.success('Configuración actualizada')
    },
    
    saveSettings() {
      localStorage.setItem('courseSettings', JSON.stringify(this.settings))
      // En implementación real, enviar al backend
    },
    
    saveCategory() {
      if (!this.categoryFormValid) return
      
      if (this.editingCategory) {
        // Actualizar categoría existente
        const index = this.categories.findIndex(c => c.id === this.editingCategory.id)
        if (index !== -1) {
          this.categories[index] = {
            ...this.categories[index],
            ...this.categoryForm
          }
        }
        this.$toast?.success('Categoría actualizada exitosamente')
      } else {
        // Crear nueva categoría
        const newCategory = {
          id: Date.now(),
          ...this.categoryForm,
          active: true
        }
        this.categories.push(newCategory)
        this.$toast?.success('Categoría creada exitosamente')
      }
      
      this.showAddCategoryDialog = false
      this.resetCategoryForm()
    },
    
    editCategory(category) {
      this.editingCategory = category
      this.categoryForm = { ...category }
      this.showAddCategoryDialog = true
    },
    
    deleteCategory(category) {
      if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${category.name}"?`)) {
        const index = this.categories.findIndex(c => c.id === category.id)
        if (index !== -1) {
          this.categories.splice(index, 1)
          this.$toast?.success('Categoría eliminada exitosamente')
        }
      }
    },
    
    toggleCategory(categoryId, active) {
      const category = this.categories.find(c => c.id === categoryId)
      if (category) {
        category.active = active
        this.$toast?.success(`Categoría ${active ? 'activada' : 'desactivada'}`)
      }
    },
    
    resetCategoryForm() {
      this.categoryForm = {
        name: '',
        slug: '',
        description: '',
        icon: '',
        color: '#1976D2'
      }
      this.editingCategory = null
    },
    
    createBackup() {
      this.backupLoading = true
      
      setTimeout(() => {
        const backupData = {
          settings: this.settings,
          categories: this.categories,
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
        
        const blob = new Blob([JSON.stringify(backupData, null, 2)], {
          type: 'application/json'
        })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `course-settings-backup-${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        this.backupLoading = false
        this.$toast?.success('Respaldo creado exitosamente')
      }, 1000)
    },
    
    handleRestoreFile(file) {
      if (!file || !file[0]) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target.result)
          
          if (confirm('¿Estás seguro de que deseas restaurar la configuración? Esto sobrescribirá todas las configuraciones actuales.')) {
            this.settings = backupData.settings || this.settings
            this.categories = backupData.categories || this.categories
            this.saveSettings()
            this.$toast?.success('Configuración restaurada exitosamente')
          }
        } catch (error) {
          this.$toast?.error('Error al leer el archivo de respaldo')
        }
      }
      reader.readAsText(file[0])
    },
    
    resetToDefaults() {
      if (confirm('¿Estás seguro de que deseas restaurar todas las configuraciones a sus valores por defecto?')) {
        this.settings = {
          autoApproval: false,
          emailNotifications: true,
          allowComments: true,
          enableCertificates: true,
          minPrice: 10000,
          maxPrice: 500000,
          platformFee: 15,
          defaultCurrency: 'CLP',
          maxVideoSize: 500,
          maxImageSize: 10,
          allowedVideoFormats: ['mp4', 'webm'],
          allowedImageFormats: ['jpg', 'png', 'webp'],
          contentModeration: true,
          requireApproval: true,
          moderationTimeLimit: 48,
          moderationGuidelines: 'Los cursos deben seguir las directrices de la comunidad...'
        }
        
        this.saveSettings()
        this.$toast?.success('Configuraciones restauradas a valores por defecto')
      }
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
}
</style>
