import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadialTreeChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cx = width * 0.5;
    const cy = height * 0.5;
    const radius = Math.min(width, height) / 2 - 30;

    const data = {
      name: "Empresa de Alimentos",
      children: [
        {
          name: "Departamento de Vendas",
          children: [
            { name: "Vendas para Atacado A", children: [] },
            { name: "Vendas para Atacado B", children: [] },
            { name: "Vendas para Varejo", children: [] }
          ]
        },
        {
          name: "Departamento de Produção",
          children: [
            { name: "Produção de Pães", children: [] },
            { name: "Produção de Bolos", children: [] },
            { name: "Produção de Doces", children: [] }
          ]
        },
        {
          name: "Departamento de Logística",
          children: [
            { name: "Distribuição Regional A", children: [] },
            { name: "Distribuição Regional B", children: [] },
            { name: "Logística de Estoque", children: [] }
          ]
        },
        {
          name: "Departamento de Marketing",
          children: [
            { name: "Publicidade e Promoções", children: [] },
            { name: "Pesquisa de Mercado", children: [] }
          ]
        },
        {
          name: "Departamento de Recursos Humanos",
          children: [
            { name: "Recrutamento e Seleção", children: [] },
            { name: "Treinamento e Desenvolvimento", children: [] }
          ]
        }
        // Adicione mais departamentos conforme necessário
      ]
    };

    const tree = d3.tree()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

    const root = tree(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

    const svg = d3.create("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", [-cx, -cy, width, height])
      .attr("style", "width: 100%; height: 100%; font: 10px sans-serif;");

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", d3.linkRadial()
        .angle(d => d.x)
        .radius(d => d.y));

    svg.append("g")
      .selectAll()
      .data(root.descendants())
      .join("circle")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

    svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("text")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0) rotate(${d.x >= Math.PI ? 180 : 0})`)
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("paint-order", "stroke")
      .attr("stroke", "white")
      .attr("fill", "currentColor")
      .text(d => d.data.name);

    chartRef.current.innerHTML = '';
    chartRef.current.appendChild(svg.node());
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default RadialTreeChart;
