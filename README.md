# 🎬 cineee.ar - Work in Progress

## 📋 **PROYECTO**
API que disponibiliza la cartelera de cines alternativos de Buenos Aires.

## 🚀 **ESTADO ACTUAL - MVP FUNCIONAL**

### ✅ **IMPLEMENTADO**
- **Backend n8n + PostgreSQL**: Flujo automatizado email → parser → BD
- **Parser Cacodelphia**: Extracción robusta de datos de newsletters
- **Frontend Next.js 16 + TypeScript**: Interfaz moderna y tipada
- **API REST**: Endpoints para consultar screenings
- **Generador iCal**: Exportación a calendarios (Google/Apple/Outlook)
- **Base de datos Railway**: PostgreSQL en la nube

### 🛠️ **FUNCIONALIDADES ACTIVAS**
- 📊 Visualización de cartelera agrupada por fecha
- 🎪 Filtrado por cine
- 📥 Descarga de archivos .ics para calendarios
- 📱 UI básica responsive
- 🔄 Actualización automática vía newsletters

### 🎯 **PRÓXIMOS PASOS**
1. **Parser Cine Lorca** - Integración de segunda fuente (OCR + GPT)
2. **Deploy Vercel** - Dominio cineee.ar en producción
3. **Más cines** - Gaumont, Cosmos, York
4. **Mejoras UI** - Experiencia mejorada

## 🏗️ **ARQUITECTURA**
```
Email Newsletter → n8n Workflow → PostgreSQL → Next.js Frontend → iCal Export
```

## 📊 **DATOS ACTUALES**
- ✅ **Cacodelphia**: Completamente integrado
- 🚧 **Cine Lorca**: En desarrollo
- 📋 **Cine Gaumont**: Próximamente
- 📋 **Cosmos UBA**: Próximamente
- 📋 **York Cine**: Próximamente

## 💻 **STACK**
- **Frontend**: Next.js 16, TypeScript, React
- **Backend**: n8n, PostgreSQL, Railway
- **Parser**: JavaScript, Regex, Date manipulation
- **Deploy**: Vercel (próximamente)

## 🎪 **CINES SOPORTADOS**
El proyecto parsea newsletters oficiales de cines alternativos para obtener datos estructurados de funciones, horarios y sinopsis.

---

**📌 Nota**: Proyecto en desarrollo activo. MVP local funcionando, expandiendo a más cines y mejoras de UX.