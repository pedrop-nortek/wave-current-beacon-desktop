
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      // Header
      "app.title": "Monitor de Ondas e Correntes",
      "language": "Idioma",
      
      // Connection
      "connection.title": "Conexão Serial",
      "connection.port": "Porta COM",
      "connection.baudrate": "Baud Rate",
      "connection.selectPort": "Selecionar porta",
      "connection.refresh": "Atualizar portas",
      "connection.connect": "Conectar",
      "connection.disconnect": "Desconectar",
      "connection.connecting": "Conectando...",
      "connection.connected": "Conectado com sucesso",
      "connection.disconnected": "Desconectado",
      "connection.error": "Erro de conexão",
      
      // Measurement
      "measurement.start": "Iniciar Medição",
      "measurement.stop": "Parar Medição",
      "measurement.status": "Status da Medição",
      "measurement.running": "Em execução",
      "measurement.stopped": "Parado",
      "measurement.initializing": "Inicializando equipamento...",
      
      // Waves
      "waves.title": "Parâmetros de Ondas",
      "waves.hm0": "Hm0 (m)",
      "waves.hmax": "Hmax (m)",
      "waves.mdir": "Direção Principal (°)",
      "waves.tm02": "Tm02 (s)",
      "waves.tp": "Tp (s)",
      "waves.pressure": "Pressão (hPa)",
      "waves.temperature": "Temperatura (°C)",
      "waves.pitch": "Pitch (°)",
      "waves.roll": "Roll (°)",
      "waves.datetime": "Data/Hora",
      "waves.lastValues": "Últimos Valores",
      
      // Currents
      "currents.title": "Perfil de Correntes",
      "currents.velocity": "Velocidade",
      "currents.direction": "Direção",
      "currents.depth": "Profundidade (m)",
      "currents.time": "Tempo",
      "currents.intensity": "Intensidade (m/s)",
      "currents.angle": "Ângulo (°)",
      
      // Alerts
      "alerts.title": "Configuração de Alertas",
      "alerts.hm0Limit": "Limite Hm0 (m)",
      "alerts.hmaxLimit": "Limite Hmax (m)",
      "alerts.tm02Limit": "Limite Tm02 (s)",
      "alerts.enableAlerts": "Habilitar alertas",
      "alerts.warning": "ALERTA: Limite excedido!",
      
      // Export
      "export.title": "Exportar Dados",
      "export.dateRange": "Intervalo de Data",
      "export.startDate": "Data Início",
      "export.endDate": "Data Fim",
      "export.waveHeightFilter": "Filtro Altura de Onda",
      "export.minHeight": "Altura Mínima (m)",
      "export.maxHeight": "Altura Máxima (m)",
      "export.export": "Exportar Excel",
      "export.success": "Dados exportados com sucesso!",
      
      // License
      "license.title": "Gerenciamento de Licenças",
      "license.serialNumber": "Número de Série",
      "license.authorized": "Equipamentos Autorizados",
      "license.add": "Adicionar",
      "license.remove": "Remover",
      "license.unauthorized": "Equipamento não autorizado",
      "license.authorized.message": "Equipamento autorizado",
      
      // General
      "save": "Salvar",
      "cancel": "Cancelar",
      "close": "Fechar",
      "error": "Erro",
      "success": "Sucesso",
      "loading": "Carregando...",
      "noData": "Sem dados",
      "settings": "Configurações"
    }
  },
  es: {
    translation: {
      // Header
      "app.title": "Monitor de Olas y Corrientes",
      "language": "Idioma",
      
      // Connection
      "connection.title": "Conexión Serie",
      "connection.port": "Puerto COM",
      "connection.baudrate": "Velocidad en Baudios",
      "connection.selectPort": "Seleccionar puerto",
      "connection.refresh": "Actualizar puertos",
      "connection.connect": "Conectar",
      "connection.disconnect": "Desconectar",
      "connection.connecting": "Conectando...",
      "connection.connected": "Conectado con éxito",
      "connection.disconnected": "Desconectado",
      "connection.error": "Error de conexión",
      
      // Measurement
      "measurement.start": "Iniciar Medición",
      "measurement.stop": "Detener Medición",
      "measurement.status": "Estado de la Medición",
      "measurement.running": "En ejecución",
      "measurement.stopped": "Detenido",
      "measurement.initializing": "Inicializando equipo...",
      
      // Waves
      "waves.title": "Parámetros de Olas",
      "waves.hm0": "Hm0 (m)",
      "waves.hmax": "Hmax (m)",
      "waves.mdir": "Dirección Principal (°)",
      "waves.tm02": "Tm02 (s)",
      "waves.tp": "Tp (s)",
      "waves.pressure": "Presión (hPa)",
      "waves.temperature": "Temperatura (°C)",
      "waves.pitch": "Cabeceo (°)",
      "waves.roll": "Balanceo (°)",
      "waves.datetime": "Fecha/Hora",
      "waves.lastValues": "Últimos Valores",
      
      // Currents
      "currents.title": "Perfil de Corrientes",
      "currents.velocity": "Velocidad",
      "currents.direction": "Dirección",
      "currents.depth": "Profundidad (m)",
      "currents.time": "Tiempo",
      "currents.intensity": "Intensidad (m/s)",
      "currents.angle": "Ángulo (°)",
      
      // Alerts
      "alerts.title": "Configuración de Alertas",
      "alerts.hm0Limit": "Límite Hm0 (m)",
      "alerts.hmaxLimit": "Límite Hmax (m)",
      "alerts.tm02Limit": "Límite Tm02 (s)",
      "alerts.enableAlerts": "Habilitar alertas",
      "alerts.warning": "ALERTA: ¡Límite excedido!",
      
      // Export
      "export.title": "Exportar Datos",
      "export.dateRange": "Rango de Fechas",
      "export.startDate": "Fecha de Inicio",
      "export.endDate": "Fecha de Fin",
      "export.waveHeightFilter": "Filtro de Altura de Ola",
      "export.minHeight": "Altura Mínima (m)",
      "export.maxHeight": "Altura Máxima (m)",
      "export.export": "Exportar a Excel",
      "export.success": "¡Datos exportados con éxito!",
      
      // License
      "license.title": "Administración de Licencias",
      "license.serialNumber": "Número de Serie",
      "license.authorized": "Equipos Autorizados",
      "license.add": "Agregar",
      "license.remove": "Eliminar",
      "license.unauthorized": "Equipo no autorizado",
      "license.authorized.message": "Equipo autorizado",
      
      // General
      "save": "Guardar",
      "cancel": "Cancelar",
      "close": "Cerrar",
      "error": "Error",
      "success": "Éxito",
      "loading": "Cargando...",
      "noData": "Sin datos",
      "settings": "Configuración"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
