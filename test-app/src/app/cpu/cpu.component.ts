import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { CpuChartComponent } from '../cpu-chart/cpu-chart.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cpu',
  standalone: true,
  templateUrl: './cpu.component.html',
  styleUrl: './cpu.component.scss',
  imports: [NgChartsModule, CpuChartComponent, CommonModule],
})
export class CpuComponent implements OnInit, OnDestroy {
  cpuLoad = 0;
  ramUsed = 0;
  ramTotal = 0;
  private intervalId?: number;

  ngOnInit(): void {
    this.updateMetrics();
    this.intervalId = window.setInterval(() => {
      this.updateMetrics();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private async updateMetrics(): Promise<void> {
    try {
      const cpu = await (window as any).api.getCpu();
      this.cpuLoad = Number.parseFloat(cpu.currentLoad.toFixed(1));

      const ram = await (window as any).api.getRam();
      this.ramTotal = +(ram.total / 1024 ** 3).toFixed(1);
      this.ramUsed = +(ram.used / 1024 ** 3).toFixed(1);
    } catch (error) {
      console.error('Error updating metrics:', error);
    }
  }

  getMemoryPercentage(): number {
    return this.ramTotal > 0
      ? Math.round((this.ramUsed / this.ramTotal) * 100)
      : 0;
  }
}
