import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      pt: {
        translation: {
          // General
          app: {
            title: 'ADCP Monitor',
            version: 'Versão',
          },
          save: 'Salvar',
          cancel: 'Cancelar',
          settings: 'Configurações',
          
          // Connection Panel
          connection: {
            title: 'Conexão Serial',
            port: 'Porta Serial',
            baudRate: 'Baud Rate',
            connect: 'Conectar',
            disconnect: 'Desconectar',
            status: 'Status',
            connected: 'Conectado',
            disconnected: 'Desconectado',
            selectPort: 'Selecionar porta',
            errorBaudRate: 'Baud Rate inválido',
          },
          
          // Waves Data Display
          waves: {
            title: 'Ondas',
            hm0: 'Altura Significativa (Hm0)',
            hmax: 'Altura Máxima (Hmax)',
            mdir: 'Direção Média (Mdir)',
            tm02: 'Período Médio (Tm02)',
            tp: 'Período de Pico (Tp)',
            pressure: 'Pressão',
            temperature: 'Temperatura',
            pitch: 'Inclinação',
            roll: 'Balanço',
          },
          
          // Currents Data Display
          currents: {
            title: 'Correntes',
            cellNumber: 'Célula',
            depth: 'Profundidade',
            velocity: 'Velocidade',
            direction: 'Direção',
          },
          
          // Measurement Control
          measurement: {
            title: 'Controle de Medição',
            start: 'Iniciar Medição',
            stop: 'Parar Medição',
            clearData: 'Limpar Dados',
            exportData: 'Exportar Dados',
            running: 'Medição em Andamento',
            stopped: 'Medição Parada',
            startTime: 'Início',
            duration: 'Duração',
          },
          
          // Alerts Panel
          alerts: {
            title: 'Alertas',
            enableAlerts: 'Habilitar Alertas',
            enableSound: 'Habilitar Som',
            hm0Limit: 'Limite de Hm0 (m)',
            hmaxLimit: 'Limite de Hmax (m)',
            tm02Limit: 'Limite de Tm02 (s)',
            warning: 'Atenção!',
          },
          
          // Export Panel
          export: {
            title: 'Exportar Dados',
            description: 'Selecione o formato e período para exportar os dados.',
            format: 'Formato',
            period: 'Período',
            all: 'Todos os dados',
            lastHour: 'Última hora',
            last24Hours: 'Últimas 24 horas',
            lastWeek: 'Última semana',
            exportButton: 'Exportar',
          },
          
          // Login and Authentication
          login: {
            title: 'Login Administrativo',
            description: 'Acesso necessário para gerenciar licenças de dispositivos.',
            username: 'Usuário',
            password: 'Senha',
            usernamePlaceholder: 'Digite o nome de usuário',
            passwordPlaceholder: 'Digite a senha',
            login: 'Entrar',
            logout: 'Sair',
            loggingIn: 'Entrando...',
            loggedOut: 'Logout realizado com sucesso',
            invalidCredentials: 'Usuário ou senha inválidos',
            error: 'Erro ao fazer login',
            blocked: 'Acesso bloqueado por {{time}} devido a tentativas excessivas',
            attempts: 'Tentativas: {{attempts}}/{{max}}',
            loginRequired: 'Login necessário para gerenciar licenças'
          },
          
          // License Management
          license: {
            title: 'Gerenciamento de Licenças',
            connectedDevice: 'Dispositivo Conectado',
            authorized: 'Dispositivos Autorizados',
            unauthorized: 'Não Autorizado',
            unauthorizedWarning: 'Este dispositivo não está autorizado a usar o software.',
            serialNumber: 'Número de Série',
            add: 'Adicionar',
            serialExists: 'Número de série já cadastrado',
            deviceAdded: 'Dispositivo adicionado com sucesso',
            deviceRemoved: 'Dispositivo removido com sucesso',
            noDevices: 'Nenhum dispositivo autorizado',
            loginRequired: 'Login necessário para gerenciar licenças',
            authorizedMessage: 'Autorizado'
          },
        }
      },
      es: {
        translation: {
          // General
          app: {
            title: 'Monitor ADCP',
            version: 'Versión',
          },
          save: 'Guardar',
          cancel: 'Cancelar',
          settings: 'Configuraciones',
          
          // Connection Panel
          connection: {
            title: 'Conexión Serial',
            port: 'Puerto Serial',
            baudRate: 'Baud Rate',
            connect: 'Conectar',
            disconnect: 'Desconectar',
            status: 'Estado',
            connected: 'Conectado',
            disconnected: 'Desconectado',
            selectPort: 'Seleccionar puerto',
            errorBaudRate: 'Baud Rate inválido',
          },
          
          // Waves Data Display
          waves: {
            title: 'Olas',
            hm0: 'Altura Significativa (Hm0)',
            hmax: 'Altura Máxima (Hmax)',
            mdir: 'Dirección Media (Mdir)',
            tm02: 'Período Medio (Tm02)',
            tp: 'Período de Pico (Tp)',
            pressure: 'Presión',
            temperature: 'Temperatura',
            pitch: 'Inclinación',
            roll: 'Balanceo',
          },
          
          // Currents Data Display
          currents: {
            title: 'Corrientes',
            cellNumber: 'Celda',
            depth: 'Profundidad',
            velocity: 'Velocidad',
            direction: 'Dirección',
          },
          
          // Measurement Control
          measurement: {
            title: 'Control de Medición',
            start: 'Iniciar Medición',
            stop: 'Detener Medición',
            clearData: 'Limpiar Datos',
            exportData: 'Exportar Datos',
            running: 'Medición en Curso',
            stopped: 'Medición Detenida',
            startTime: 'Inicio',
            duration: 'Duración',
          },
          
          // Alerts Panel
          alerts: {
            title: 'Alertas',
            enableAlerts: 'Habilitar Alertas',
            enableSound: 'Habilitar Sonido',
            hm0Limit: 'Límite de Hm0 (m)',
            hmaxLimit: 'Límite de Hmax (m)',
            tm02Limit: 'Límite de Tm02 (s)',
            warning: '¡Atención!',
          },
          
          // Export Panel
          export: {
            title: 'Exportar Datos',
            description: 'Seleccione el formato y período para exportar los datos.',
            format: 'Formato',
            period: 'Período',
            all: 'Todos los datos',
            lastHour: 'Última hora',
            last24Hours: 'Últimas 24 horas',
            lastWeek: 'Última semana',
            exportButton: 'Exportar',
          },
          
          // Login and Authentication
          login: {
            title: 'Inicio de Sesión Administrativo',
            description: 'Acceso necesario para gestionar licencias de dispositivos.',
            username: 'Usuario',
            password: 'Contraseña',
            usernamePlaceholder: 'Ingrese el nombre de usuario',
            passwordPlaceholder: 'Ingrese la contraseña',
            login: 'Iniciar',
            logout: 'Cerrar',
            loggingIn: 'Iniciando...',
            loggedOut: 'Sesión cerrada con éxito',
            invalidCredentials: 'Usuario o contraseña inválidos',
            error: 'Error al iniciar sesión',
            blocked: 'Acceso bloqueado por {{time}} debido a intentos excesivos',
            attempts: 'Intentos: {{attempts}}/{{max}}',
            loginRequired: 'Inicio de sesión necesario para gestionar licencias'
          },
          
          // License Management
          license: {
            title: 'Gestión de Licencias',
            connectedDevice: 'Dispositivo Conectado',
            authorized: 'Dispositivos Autorizados',
            unauthorized: 'No Autorizado',
            unauthorizedWarning: 'Este dispositivo no está autorizado para usar el software.',
            serialNumber: 'Número de Serie',
            add: 'Agregar',
            serialExists: 'Número de serie ya registrado',
            deviceAdded: 'Dispositivo agregado con éxito',
            deviceRemoved: 'Dispositivo eliminado con éxito',
            noDevices: 'Ningún dispositivo autorizado',
            loginRequired: 'Inicio de sesión necesario para gestionar licencias',
            authorizedMessage: 'Autorizado'
          },
        }
      }
    }
  });

export default i18n;
