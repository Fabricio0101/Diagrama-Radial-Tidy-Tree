import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RadialTreeChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {

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

    const width = 1208;

    const root = d3.hierarchy(data);
    const dx = 40;
    const dy = width / (root.height + 1);

    const tree = d3.tree().nodeSize([dx, dy]);

    root.sort((a, b) => d3.ascending(a.data.name, b.data.name));
    tree(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const height = x1 - x0 + dx * 2;

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-dy / 3, x0 - dx, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x));

    const node = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("fill", d => d.children ? "#555" : "#999")
      .attr("r", 2.5);

    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .clone(true).lower()
      .attr("stroke", "white");

    chartRef.current.innerHTML = '';
    chartRef.current.appendChild(svg.node());
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '100vh' }}></div>;
};

export default RadialTreeChart;
