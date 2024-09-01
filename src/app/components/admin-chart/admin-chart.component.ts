import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin-chart',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './admin-chart.component.html',
  styleUrl: './admin-chart.component.css',
})
export class AdminChartComponent implements OnInit {
  private productsUrl = 'http://localhost:3000/api/products';
  private ordersUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAndVisualizeData();
  }

  fetchAndVisualizeData(): void {
    // Fetch products and orders
    this.http.get(this.productsUrl).subscribe((products: any) => {
      this.visualizeProducts(products);
    });
  }

  visualizeProducts(products: any[]): void {
    const svg = d3.select('#products-chart');

    // Define dimensions and margins
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // Create SVG container
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const x = d3
      .scaleBand()
      .domain(products.map((p) => p.name))
      .range([0, width])
      .padding(0.2);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(products, (p) => p.price) || 0])
      .nice()
      .range([height, 0]);

    // Add bars
    svg
      .select('g')
      .selectAll('.bar')
      .data(products)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name)!)
      .attr('y', (d) => y(d.price))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.price))
      .style('fill', '#4a90e2')
      .style('stroke', '#ffffff')
      .style('stroke-width', '2px')
      .style('opacity', 0.8);

    // Add x-axis
    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333');

    // Add y-axis
    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#333');

    // Add chart title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .text('Product Prices');
  }
}
