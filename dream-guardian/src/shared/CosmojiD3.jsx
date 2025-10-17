import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export default function CosmojiD3({
  width = 320,
  height = 320,
  emojis = ['❄️', '🌌', '🧭', '🦭', '🔥', '🌬️', '🧊', '🐻', '🌙', '🧿'],
  interactive = false,
  selectedEmojis = [],
  onToggleEmoji,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear prior render
    container.innerHTML = '';

    const nodes = emojis.map((emoji, index) => ({ id: index, emoji }));
    const links = d3.range(emojis.length).map((i) => ({ source: i, target: (i + 1) % emojis.length }));
    // add a few cross links for constellation feel
    links.push({ source: 0, target: 5 }, { source: 2, target: 7 });

    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .style('display', 'block');

    const link = svg
      .append('g')
      .attr('stroke', 'rgba(255,255,255,0.6)')
      .attr('stroke-width', 1.2)
      .selectAll('line')
      .data(links)
      .enter()
      .append('line');

    const node = svg
      .append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.emoji)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', (d) => (selectedEmojis && selectedEmojis.includes(d.emoji) ? 34 : 26))
      .style('opacity', (d) => (selectedEmojis && selectedEmojis.length > 0 ? (selectedEmojis.includes(d.emoji) ? 1 : 0.7) : 1))
      .style('cursor', interactive ? 'pointer' : 'default')
      .on('click', (event, d) => {
        if (!interactive) return;
        if (typeof onToggleEmoji === 'function') onToggleEmoji(d.emoji);
      });

    const simulation = d3
      .forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(-60))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(20))
      .force('link', d3.forceLink(links).id((d) => d.id).distance(90).strength(0.7))
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('x', (d) => d.x).attr('y', (d) => d.y);
      });

    // gentle motion
    const jiggle = d3.interval(() => {
      nodes.forEach((n) => {
        n.vx += (Math.random() - 0.5) * 0.05;
        n.vy += (Math.random() - 0.5) * 0.05;
      });
    }, 1200);

    return () => {
      jiggle.stop();
      simulation.stop();
      svg.remove();
    };
  }, [width, height, interactive, Array.isArray(emojis) ? emojis.join(',') : String(emojis), Array.isArray(selectedEmojis) ? selectedEmojis.join(',') : '']);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
