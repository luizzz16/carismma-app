import {GestorVentas} from './gestorVentas';
import {Orden} from './orden';

declare const Chart: any;

export class Administrar {
  private _gestor: GestorVentas;
  private _htmlSelectorFecha: HTMLInputElement;
  private _htmlbotonBuscarVenta: HTMLButtonElement;
  private _htmlResultado: HTMLDivElement;
  private _htmlListaVentas: HTMLOListElement;
  private _htmlChartMensaje: HTMLDivElement;
  private _htmlListaFinesSemana: HTMLOListElement;
  private _chartInstance: any | null = null;

  constructor(gestorVentas: GestorVentas) {
    this._gestor = gestorVentas;
    this._htmlSelectorFecha = document.getElementById('selectorFecha') as HTMLInputElement;
    this._htmlbotonBuscarVenta = document.getElementById('btnBuscarVenta') as HTMLButtonElement;
    this._htmlResultado = document.querySelector('#resultadoVenta') as HTMLDivElement;
    this._htmlListaVentas = document.getElementById('listaVentas') as HTMLOListElement;
    this._htmlChartMensaje = document.getElementById('graficoMensaje') as HTMLDivElement;
    this._htmlListaFinesSemana = document.getElementById('listaFinesSemana') as HTMLOListElement;

    this._htmlbotonBuscarVenta.addEventListener('click', async () => {
      const fechaStr = this._htmlSelectorFecha.value;
        if (!fechaStr) {
          alert('Selecciona una fecha primero.');
          return;
        }

        this._htmlResultado.innerHTML = '';
        this._htmlListaVentas.innerHTML = '';

        const fecha = new Date(fechaStr);
        const ordenes = await this._gestor.obternerVentasPorFecha(fecha);
        console.log('Ventas obtenidas:', ordenes);

        if (ordenes.length === 0) {
          this._htmlResultado.innerHTML = '<p>No hay ventas en esa fecha.</p>';
          return;
        }

        const resumenTotal: Record<string, number> = {};
        let totalOrden = 0;
        for (const orden of ordenes) {
          const resumenOrden = orden.getResumenConsumoOrd();
          totalOrden+= orden.getTotal();
          for (const producto in resumenOrden) {
            resumenTotal[producto] = (resumenTotal[producto] || 0) + resumenOrden[producto];
          }
        }

        this._htmlResultado.innerHTML = '<h3>Resumen de ventas</h3>';
        for (const producto in resumenTotal) {
          const li = document.createElement('li');
          li.textContent = `${producto}: ${resumenTotal[producto]}`;
          this._htmlListaVentas.appendChild(li);
        }
        const li = document.createElement('h3');
        li.textContent = `Total del día: $${totalOrden}`;
        this._htmlListaVentas.appendChild(li);
        this._htmlResultado.appendChild(this._htmlListaVentas);
      });

    this.inicializarGraficoFinesSemana();
  }

  private agruparVentasPorFinDeSemana(ordenes: Orden[]) {
    const acumuladoPorFinDeSemana: Record<string, { etiqueta: string; monto: number; fechaInicio: string }> = {};

    for (const orden of ordenes) {
      const fecha = this.parseFechaLocal(orden.fecha.toISOString().split('T')[0]);
      const diaSemana = fecha.getDay();

      if (![5, 6, 0].includes(diaSemana)) {
        continue;
      }

      const fechaInicio = new Date(fecha);
      if (diaSemana === 6) {
        fechaInicio.setDate(fecha.getDate() - 1);
      } else if (diaSemana === 0) {
        fechaInicio.setDate(fecha.getDate() - 2);
      }

      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 2);

      const fechaKey = fechaInicio.toISOString().split('T')[0];
      const etiqueta = `${this.formatearDiaMes(fechaInicio)} - ${this.formatearDiaMesConAnoCorto(fechaFin)}`;

      acumuladoPorFinDeSemana[fechaKey] = acumuladoPorFinDeSemana[fechaKey] || {
        etiqueta,
        monto: 0,
        fechaInicio: fechaKey
      };

      acumuladoPorFinDeSemana[fechaKey].monto += orden.getTotal();
    }

    return Object.values(acumuladoPorFinDeSemana).sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
  }

  private renderWeekendChart(datos: { etiqueta: string; monto: number }[]) {
    const canvas = document.getElementById('weekendSalesChart') as HTMLCanvasElement;
    if (!canvas) {
      return;
    }

    const anchoCalculado = Math.max(datos.length * 150, 720);
    this._chartInstance?.destroy();
    canvas.width = anchoCalculado;
    canvas.height = 360;

    const chartWrapper = canvas.closest('.chart-inner') as HTMLElement | null;
    if (chartWrapper) {
      chartWrapper.style.width = `${anchoCalculado}px`;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const labels = datos.map(item => item.etiqueta);
    const valores = datos.map(item => item.monto);

    const gradient = ctx.createLinearGradient(0, 0, 0, 360);
    gradient.addColorStop(0, 'rgba(255, 152, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');

    this._chartInstance = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Ventas totales por fin de semana',
            data: valores,
            fill: true,
            spanGaps: true,
            backgroundColor: gradient,
            borderColor: '#FF9800',
            borderWidth: 4,
            tension: 0.4,
            cubicInterpolationMode: 'monotone',
            pointStyle: 'circle',
            pointRadius: 8,
            pointBorderWidth: 3,
            pointBorderColor: '#ffffff',
            pointBackgroundColor: '#FF9800',
            pointHoverRadius: 10,
            pointHoverBorderColor: '#ffffff',
            pointHoverBackgroundColor: '#FF9800',
            pointHitRadius: 12
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 45,
              minRotation: 45,
              align: 'start',
              padding: 10,
              color: '#888',
              font: {
                size: 10
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Monto en pesos'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.06)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#333',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            padding: 12,
            callbacks: {
              title: (items: any[]) => {
                const etiqueta = items[0]?.label ?? '';
                return `Fin de semana: ${etiqueta}`;
              },
              label: (context: any) => {
                const value = Number(context.parsed.y ?? 0);
                const monto = value.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                return `Venta Total: $${monto}`;
              }
            }
          }
        }
      }
    });
  }

  private renderWeekendSummary(datos: { etiqueta: string; monto: number }[]) {
    this._htmlListaFinesSemana.innerHTML = '';

    for (const item of datos) {
      const li = document.createElement('li');
      li.textContent = `${item.etiqueta}: $${item.monto.toFixed(2)}`;
      this._htmlListaFinesSemana.appendChild(li);
    }
  }

  private formatearDiaMes(fecha: Date) {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    return `${dia}/${mes}`;
  }

  private formatearDiaMesConAnoCorto(fecha: Date) {
    const diaMes = this.formatearDiaMes(fecha);
    const añoCorto = fecha.getFullYear().toString().slice(-2);
    return `${diaMes}/${añoCorto}`;
  }

  private async inicializarGraficoFinesSemana() {
    this._htmlListaFinesSemana.innerHTML = '';
    this._chartInstance?.destroy();
    this._htmlChartMensaje.textContent = 'Cargando gráfico de fines de semana...';

    const ordenes = await this._gestor.obtenerTodasVentasPagadas();
    const finesSemana = this.agruparVentasPorFinDeSemana(ordenes);

    if (finesSemana.length === 0) {
      this._htmlChartMensaje.textContent = 'No hay ventas de viernes a domingo registradas.';
      return;
    }

    this._htmlChartMensaje.textContent = '';
    this.renderWeekendChart(finesSemana);
    this.renderWeekendSummary(finesSemana);
  }

  private parseFechaLocal(fechaStr: string): Date {
    const [año, mes, dia] = fechaStr.split('-').map(Number);
    return new Date(año, mes - 1, dia);
  }
}
