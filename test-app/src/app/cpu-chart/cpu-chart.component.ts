import {
  Component,
  type OnInit,
  type OnDestroy,
  ViewChild,
} from '@angular/core';
import type { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-cpu-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './cpu-chart.component.html',
  styleUrl: './cpu-chart.component.scss',
})
export class CpuChartComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private intervalId?: number;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'CPU Usage (%)',
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return `Time: ${context[0].label}`;
          },
          label: (context) => {
            return `CPU: ${context.parsed.y.toFixed(1)}%`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          maxTicksLimit: 6,
        },
      },
      y: {
        min: 0,
        max: 100,
        display: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
          },
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  public lineChartType: 'line' = 'line';

  ngOnInit(): void {
    this.updateChart();
    this.intervalId = window.setInterval(() => {
      this.updateChart();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async updateChart(): Promise<void> {
    try {
      const cpuUsageRaw = await (window as any).api.getCpu();
      const cpuUsage = Number(cpuUsageRaw.currentLoad.toFixed(1));

      const labels = this.lineChartData.labels as string[];
      const data = this.lineChartData.datasets[0].data as number[];

      const now = new Date();
      const timeLabel = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      labels.push(timeLabel);
      data.push(cpuUsage);

      // Keep only last 20 data points for better performance
      if (labels.length > 20) {
        labels.shift();
        data.shift();
      }

      this.chart?.update('none');
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }
}
